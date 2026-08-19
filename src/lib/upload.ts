import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || 'darkforum-files';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(file: File): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`public/${file.name}`, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error('فشل رفع الملف: ' + error.message);

  const publicUrl = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path).data.publicUrl;

  alert('تم الرفع بنجاح! الرابط: ' + publicUrl);
  return publicUrl;
}

export async function getFiles(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list('public');

  if (error) throw new Error('فشل جلب الملفات: ' + error.message);

  return data.map(file => 
    `${supabaseUrl}/storage/v1/object/public/${bucketName}/public/${file.name}`
  );
}