import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Task Board</h1>
        <p className="text-gray-600 mb-6">Simple task management</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Log In
          </Link>
          <Link href="/signup" className="px-5 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
