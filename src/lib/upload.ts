 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

const bucketName = 'uploads1';

export async function uploadFile(file: File) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`public/${file.name}`, file);

  if (error) {
    alert('فشل الرفع: ' + error.message);
    return;
  }

  const publicUrl = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path).publicUrl;

  alert('تم الرفع بنجاح! الرابط: ' + publicUrl);
}