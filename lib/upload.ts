import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pptzomxjafmweyjkrflr.supabase.co';
const supabaseKey = 'sb_publishable_lrYndaF4sXgfXP_VIhgERg__CSsLpOC';

const supabase = createClient(supabaseUrl, supabaseKey);

const bucketName = 'uploads1';

export async function uploadFile(file: File): Promise<string> {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`public/${fileName}`, file);

  if (error) {
    throw new Error('فشل الرفع: ' + error.message);
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${data.path}`;

  return publicUrl;
}

// دالة لجلب جميع الملفات
export async function getFiles(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list('public');

  if (error) {
    throw new Error('فشل جلب الملفات: ' + error.message);
  }

  return data.map(file => 
    `${supabaseUrl}/storage/v1/object/public/${bucketName}/public/${file.name}`
  );
}