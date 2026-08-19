export default function PostCard({ post }: { post: any }) {
  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="font-bold">{post.title}</h2>
      <p className="text-gray-600">{post.content?.substring(0, 100)}</p>
    </div>
  );
}