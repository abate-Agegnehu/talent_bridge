import Link from "next/link";

export default function SignupIndexPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <div className="w-full max-w-md rounded-xl border-2 border-purple-400 bg-white p-8 shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-blue-500">TalentBridge</span>
        </div>

        {/* Subtitle */}
        <p className="text-center text-gray-500 mb-8">
          Create your TalentBridge account.
        </p>

        <div className="space-y-3">
          <Link
            href="/signup/company"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-400 transition-colors"
          >
            Sign up as Company
          </Link>
          <Link
            href="/signup/university"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-400 transition-colors"
          >
            Sign up as University
          </Link>
          <Link
            href="/signup/student"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-400 transition-colors"
          >
            Sign up as Student
          </Link>

          <p className="pt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-500 hover:text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
