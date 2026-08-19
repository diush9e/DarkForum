export default function Sidebar() {
  return (
    <aside className="w-64 p-4 border-r">
      <h3 className="font-bold mb-4">القائمة</h3>
      <ul className="space-y-2">
        <li><a href="/">الرئيسية</a></li>
        <li><a href="/posts">المشاركات</a></li>
      </ul>
    </aside>
  );
}