 
import UploadButton from '@/components/UploadButton';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">رفع الملفات</h1>
      <UploadButton />
    </main>
  );
}