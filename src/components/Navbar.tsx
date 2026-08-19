export default function Navbar() {
  return (
    <nav className="p-4 border-b">
      <div className="max-w-4xl mx-auto flex justify-between">
        <a href="/" className="font-bold">DarkForum</a>
        <div className="space-x-4">
          <a href="/posts">المشاركات</a>
          <a href="/login">دخول</a>
        </div>
      </div>
    </nav>
  );
}