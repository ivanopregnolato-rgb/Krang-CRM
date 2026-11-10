-- KRANG CRM: cifratura end-to-end (versione 1.6.0). Da eseguire una volta nel SQL Editor. Si puo' rieseguire.
-- Le foto vengono cifrate sul dispositivo: nel bucket diventano file binari, non piu' immagini JPEG.
update storage.buckets
   set allowed_mime_types = array['application/octet-stream','image/jpeg','image/png','image/webp'],
       file_size_limit = 3145728
 where id = 'media';
