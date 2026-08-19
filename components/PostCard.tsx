import Link from "next/link";
import { formatDate, truncateText } from "@/lib/utils";
interface PostCardProps { post: { id: string; title: string; content: string; createdAt: Date; views: number; author: { id: string; name: string | null; username: string; image: string | null }; comments: { id: string }[]; likes: { id: string }[] }; }
export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="glass rounded-xl p-6 hover:border-primary/50 transition-all animate-fadeIn">
      <div className="flex items-start gap-4">
        <Link href={`/profile/${post.author.username}`}><div className="w-12 h-12 rounded-full bg-dark-300 flex items-center justify-center overflow-hidden">{post.author.image ? (<img src={post.author.image} alt={post.author.name || post.author.username} className="w-full h-full object-cover" />) : (<span className="text-xl font-bold text-primary">{post.author.username[0].toUpperCase()}</span>)}</div></Link>
        <div className="flex-1">
          <Link href={`/posts/${post.id}`}><h3 className="text-xl font-bold mb-2 hover:text-primary transition">{post.title}</h3></Link>
          <p className="text-gray-400 mb-4">{truncateText(post.content, 150)}</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href={`/profile/${post.author.username}`} className="hover:text-primary transition">@{post.author.username}</Link>
            <span>{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1">💬 {post.comments.length}</span>
            <span className="flex items-center gap-1">❤️ {post.likes.length}</span>
            <span className="flex items-center gap-1">👁️ {post.views}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
