'use client';

import { uploadFile } from '@/lib/upload';

export default function UploadButton() {
  const handleUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const url = await uploadFile(file);
          // هنا يمكنك إضافة الكود لعرض الصورة في الموقع
          alert('تم الرفع! الرابط:\n' + url);
          
          // مثال: إضافة الصورة للصفحة
          const img = document.createElement('img');
          img.src = url;
          img.style.maxWidth = '300px';
          img.style.marginTop = '10px';
          document.body.appendChild(img);
        } catch (error) {
          alert('فشل الرفع: ' + error);
        }
      }
    };
    input.click();
  };

  return (
    <button
      onClick={handleUpload}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
    >
      📤 رفع ملف
    </button>
  );
}