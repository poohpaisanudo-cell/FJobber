import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          FJobber
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/applications" className="hover:underline">
            ใบสมัครของฉัน
          </Link>
          <Link href="/companies" className="hover:underline">
            บริษัทและรีวิว
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </nav>
  );
}