import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
interface PostPageProps { params: Promise<{ id: string }>; }
export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, include: { author: { select: { id: true, name: true, username: true, image: true } }, comments: { include: { author: { select: { id: true, username: true, image: true } } }, orderBy: { createdAt: "asc" } }, likes: true } });
  if (!post) { notFound(); }
  await prisma.post.update({ where: { id }, data: { views: post.views + 1 } });
  return (
    <div className="max-w-4xl mx-auto">
      <article className="glass rounded-2xl p-8 mb-6">
        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-400">
          <Link href={`/profile/${post.author.username}`}><div className="w-12 h-12 rounded-full bg-dark-300 overflow-hidden">{post.author.image ? (<img src={post.author.image} alt={post.author.name || post.author.username} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center"><span className="text-xl font-bold text-primary">{post.author.username[0].toUpperCase()}</span></div>)}</div></Link>
          <div><Link href={`/profile/${post.author.username}`} className="font-semibold hover:text-primary">{post.author.name || post.author.username}</Link><p className="text-sm text-gray-400">{formatDate(post.createdAt)}</p></div>
        </div>
        <div className="prose prose-invert max-w-none mb-8"><p className="text-gray-300 whitespace-pre-line text-lg leading-relaxed">{post.content}</p></div>
        <div className="flex items-center gap-6 pt-6 border-t border-dark-400">
          <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition">❤️ <span>{post.likes.length}</span></button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition">💬 <span>{post.comments.length}</span></button>
          <span className="flex items-center gap-2 text-gray-400">👁️ <span>{post.views}</span></span>
        </div>
      </article>
      <section className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">التعليقات ({post.comments.length})</h2>
        <div className="space-y-6">{post.comments.map((comment) => (<div key={comment.id} className="border-b border-dark-400 last:border-0 pb-6 last:pb-0"><div className="flex items-start gap-4"><Link href={`/profile/${comment.author.username}`}><div className="w-10 h-10 rounded-full bg-dark-300 overflow-hidden">{comment.author.image ? (<img src={comment.author.image} alt={comment.author.username} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center"><span className="font-bold text-primary">{comment.author.username[0].toUpperCase()}</span></div>)}</div></Link><div className="flex-1"><div className="flex items-center gap-2 mb-2"><Link href={`/profile/${comment.author.username}`} className="font-semibold hover:text-primary">@{comment.author.username}</Link><span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span></div><p className="text-gray-300">{comment.content}</p></div></div></div>))}</div>
        <div className="mt-8 pt-6 border-t border-dark-400">
          <form className="space-y-4">
            <textarea placeholder="أضف تعليقك..." className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition resize-none" rows={4} />
            <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-semibold transition">إرسال التعليق</button>
          </form>
        </div>
      </section>
    </div>
  );
}
