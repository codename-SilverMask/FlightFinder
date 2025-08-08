import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">Not Found</h2>
      <p className="text-gray-400 mb-8">Could not find requested resource</p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
