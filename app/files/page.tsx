import { getFiles } from '@/lib/upload';

export default async function FilesPage() {
  let files: string[] = [];
  
  try {
    files = await getFiles();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">الملفات المرفوعة</h1>
      
      {files.length === 0 ? (
        <p className="text-gray-400">لا توجد ملفات مرفوعة بعد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((url, index) => {
            const fileName = url.split('/').pop();
            const isImage = fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            const isVideo = fileName?.match(/\.(mp4|webm|ogg)$/i);
            
            return (
              <div key={index} className="glass rounded-xl p-4">
                {isImage ? (
                  <img src={url} alt={fileName || ''} className="w-full h-40 object-cover rounded-lg mb-2" />
                ) : isVideo ? (
                  <video src={url} controls className="w-full h-40 rounded-lg mb-2" />
                ) : (
                  <div className="w-full h-40 bg-dark-300 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
                
                <p className="text-sm text-gray-400 truncate">{fileName}</p>
                <a href={url} target="_blank" className="text-primary text-sm hover:underline">
                  عرض
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}