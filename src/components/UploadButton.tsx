 
'use client';

import { uploadFile } from '@/lib/upload';

export default function UploadButton() {
  const handleUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await uploadFile(file);
      }
    };
    input.click();
  };

  return (
    <button
      onClick={handleUpload}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      رفع ملف
    </button>
  );
}