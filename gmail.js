/* Gmail diretto: accesso Google (Google Identity Services) + API REST di Gmail.
   Espone la stessa interfaccia del connettore Gmail di claude.ai (callTool, listTools) così
   il resto dell'app non cambia. Il token vive solo in memoria e dura circa un'ora.
   Le email vanno dal dispositivo a Google: non passano da nessun server dell'app. */
(function(){
  'use strict';
  const SC='https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly';
  const API='https://gmail.googleapis.com/gmail/v1/users/me/';
  let cid='',tok='',exp=0,gsi=null;
  const err=(code,info)=>({code,info:info||'',gd:true});
  const ready=()=>!!(tok&&Date.now()<exp-30000);
  const loadGsi=()=>gsi||(gsi=new Promise((ok,ko)=>{
    if(window.google&&google.accounts&&google.accounts.oauth2)return ok();
    const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';
    s.onload=()=>ok();s.onerror=()=>{gsi=null;ko(err('server_unavailable','gsi'))};
    document.head.appendChild(s);setTimeout(()=>{if(!(window.google&&google.accounts))ko(err('server_unavailable','gsi'))},15000)}));
  function connect(){
    return new Promise((ok,ko)=>{
      if(!cid)return ko(err('server_not_connected'));
      loadGsi().then(()=>{
        try{
          const tc=google.accounts.oauth2.initTokenClient({client_id:cid,scope:SC,
            callback:r=>{if(r&&r.access_token){tok=r.access_token;exp=Date.now()+(+r.expires_in||3600)*1000;ok()}else ko(err('needs_reauth',r&&r.error))},
            error_callback:e=>ko(err('needs_reauth',e&&e.type))});
          tc.requestAccessToken({prompt:''})
        }catch(e){ko(err('tool_error','init'))}
      }).catch(ko)})}
  async function api(path,opt){
    if(!ready())throw err('needs_reauth');
    let r;
    try{r=await fetch(API+path,Object.assign({},opt,{headers:Object.assign({Authorization:'Bearer '+tok},(opt&&opt.headers)||{})}))}
    catch(e){throw err('server_unavailable')}
    if(r.status===401){tok='';throw err('needs_reauth')}
    if(r.status===403){let t='';try{t=await r.text()}catch(e){}throw err(/has not been used|is disabled|accessNotConfigured/i.test(t)?'gd_api':'not_in_manifest','403')}
    if(!r.ok)throw err(r.status>=500||r.status===429?'server_unavailable':'tool_error',String(r.status));
    return r.json()}
  /* ---- codifiche ---- */
  const te=new TextEncoder(),td=new TextDecoder('utf-8');
  const b64=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)};
  const b64u=u8=>b64(u8).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const fromB64u=s=>{s=String(s||'').replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const x=atob(s),u=new Uint8Array(x.length);for(let i=0;i<x.length;i++)u[i]=x.charCodeAt(i);return u};
  const wrap=s=>s.replace(/(.{76})/g,'$1\r\n');
  const word=t=>/^[\x20-\x7e]*$/.test(t)?t:'=?UTF-8?B?'+b64(te.encode(t))+'?=';
  const clean=t=>String(t||'').replace(/[\r\n]+/g,' ');
  function mime(a){
    const bd='b'+Math.random().toString(36).slice(2)+Date.now().toString(36),ba='a'+Math.random().toString(36).slice(2)+Date.now().toString(36);
    const to=(Array.isArray(a.to)?a.to:[a.to]).map(clean).join(', ');
    const hd=['To: '+to,'Subject: '+word(clean(a.subject)),'MIME-Version: 1.0'];
    const text=String(a.body||''),html=a.htmlBody?String(a.htmlBody):'';
    const part=(type,body)=>'Content-Type: '+type+'; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n'+wrap(b64(te.encode(body)));
    const atts=a.attachments||[];
    let inner;
    if(html)inner='Content-Type: multipart/alternative; boundary="'+ba+'"\r\n\r\n--'+ba+'\r\n'+part('text/plain',text)+'\r\n--'+ba+'\r\n'+part('text/html',html)+'\r\n--'+ba+'--';
    else inner=part('text/plain',text);
    let out;
    if(atts.length){
      out=hd.join('\r\n')+'\r\nContent-Type: multipart/mixed; boundary="'+bd+'"\r\n\r\n--'+bd+'\r\n'+inner;
      atts.forEach(x=>{const n=word(clean(x.filename||'allegato'));
        out+='\r\n--'+bd+'\r\nContent-Type: '+(x.mimeType||'application/octet-stream')+'; name="'+n+'"\r\nContent-Disposition: attachment; filename="'+n+'"\r\nContent-Transfer-Encoding: base64\r\n\r\n'+wrap(String(x.content||''))});
      out+='\r\n--'+bd+'--'}
    else out=hd.join('\r\n')+'\r\n'+inner;
    return out}
  /* ---- messaggi nella forma del connettore ---- */
  const hv=(m,n)=>{const h=((m.payload&&m.payload.headers)||[]).find(x=>String(x.name).toLowerCase()===n.toLowerCase());return h?h.value:''};
  function bodyOf(p){
    if(!p)return {t:'',h:''};
    let t='',h='';
    const walk=x=>{if(!x)return;const d=x.body&&x.body.data;
      if(d&&/^text\/plain/i.test(x.mimeType||'')&&!t)t=td.decode(fromB64u(d));
      else if(d&&/^text\/html/i.test(x.mimeType||'')&&!h)h=td.decode(fromB64u(d));
      (x.parts||[]).forEach(walk)};
    walk(p);
    if(!t&&h)t=h.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<br\s*\/?>|<\/p>|<\/div>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\n{3,}/g,'\n\n').trim();
    return {t,h}}
  function mapMsg(m,full){
    const from=hv(m,'From'),to=hv(m,'To'),x=from.match(/[^\s<>"]+@[^\s<>"]+/),nm=from.replace(/<[^>]*>/g,'').replace(/["']/g,'').replace(x?x[0]:'','').trim();
    const o={id:m.id,threadId:m.threadId,sender:from,toRecipients:to?to.split(',').map(s=>s.trim()):[],subject:hv(m,'Subject'),date:hv(m,'Date'),
      internalDate:m.internalDate,snippet:m.snippet||'',labelIds:m.labelIds||[],addressDisplayNames:x&&nm?[{emailAddress:x[0],displayName:nm}]:[]};
    if(full)o.plaintextBody=bodyOf(m.payload).t;
    return o}
  async function pool(items,n,fn){const out=new Array(items.length);let i=0;await Promise.all(Array.from({length:Math.min(n,items.length)},async()=>{while(i<items.length){const k=i++;out[k]=await fn(items[k])}}));return out}
  const TOOLS={
    async send_message(a){
      const r=await api('messages/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({raw:b64u(te.encode(mime(a)))})});
      return {payload:{id:r.id,threadId:r.threadId}}},
    async search_threads(a){
      const n=Math.min(+a.pageSize||20,25);
      const l=await api('threads?maxResults='+n+'&q='+encodeURIComponent(a.query||''));
      const ths=await pool(l.threads||[],5,async t=>{
        const d=await api('threads/'+encodeURIComponent(t.id)+'?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date');
        return {id:t.id,snippet:t.snippet||'',messages:(d.messages||[]).map(m=>mapMsg(m,false))}});
      return {payload:{threads:ths}}},
    async get_thread(a){
      const d=await api('threads/'+encodeURIComponent(a.threadId)+'?format=full');
      return {payload:{id:d.id,messages:(d.messages||[]).map(m=>mapMsg(m,true))}}}};
  window.GD={
    setClient:c=>{c=String(c||'').trim();if(c!==cid){cid=c;tok='';exp=0}},
    cid:()=>cid,ready,connect,
    status:()=>!cid?'assente':ready()?'connected':'needs_reauth',
    async callTool(server,tool,args){if(server!=='Gmail'||!TOOLS[tool])throw err('tool_error','tool');return TOOLS[tool](args||{})},
    async listTools(){return {servers:[{server:'Gmail',authStatus:ready()?'connected':'needs_reauth'}]}},
    _mime:mime}
})();
