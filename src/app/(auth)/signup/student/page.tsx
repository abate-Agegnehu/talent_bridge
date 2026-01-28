"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getJson, postJson } from "../../_lib/http";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Department = {
  id: number;
  collegeId: number;
  userId: number;
  user: User;
};

type College = {
  id: number;
  universityId: number;
  userId: number;
  user: User;
  departments: Department[];
};

type University = {
  id: number;
  userId: number;
  user: User;
  colleges: { id: number; userId: number; user: User }[];
};

export default function StudentSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState<number>(1);

  const [universities, setUniversities] = useState<University[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch all universities and colleges on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [universitiesData, collegesData] = await Promise.all([
          getJson<University[]>("/api/universities"),
          getJson<College[]>("/api/colleges"),
        ]);
        setUniversities(universitiesData);
        setAllColleges(collegesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  // Filter colleges by selected university
  const colleges = selectedUniversityId
    ? allColleges.filter((c) => c.universityId === selectedUniversityId)
    : [];

  // Get departments for selected college
  const selectedCollege = allColleges.find((c) => c.id === selectedCollegeId);
  const departments = selectedCollege?.departments ?? [];

  // Reset college and department when university changes
  function handleUniversityChange(universityId: number | null) {
    setSelectedUniversityId(universityId);
    setSelectedCollegeId(null);
    setSelectedDepartmentId(null);
  }

  // Reset department when college changes
  function handleCollegeChange(collegeId: number | null) {
    setSelectedCollegeId(collegeId);
    setSelectedDepartmentId(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await postJson("/api/students", {
        name,
        email,
        password,
        year,
        universityId: selectedUniversityId,
        collegeId: selectedCollegeId,
        departmentId: selectedDepartmentId,
      });
      setSuccess("Student account created successfully!");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

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
          Create a student account.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Year
            </label>
            <select
              name="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
              <option value={5}>5th Year</option>
            </select>
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              University
            </label>
            <select
              name="universityId"
              value={selectedUniversityId ?? ""}
              onChange={(e) =>
                handleUniversityChange(e.target.value ? Number(e.target.value) : null)
              }
              disabled={loadingData}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100"
            >
              <option value="">
                {loadingData ? "Loading..." : "Select university"}
              </option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.user.name}
                </option>
              ))}
            </select>
          </div>

          {/* College (dependent on university) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              College
            </label>
            <select
              name="collegeId"
              value={selectedCollegeId ?? ""}
              onChange={(e) =>
                handleCollegeChange(e.target.value ? Number(e.target.value) : null)
              }
              disabled={!selectedUniversityId || colleges.length === 0}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100"
            >
              <option value="">
                {!selectedUniversityId
                  ? "Select university first"
                  : colleges.length === 0
                  ? "No colleges available"
                  : "Select college"}
              </option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department (dependent on college) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Department
            </label>
            <select
              name="departmentId"
              value={selectedDepartmentId ?? ""}
              onChange={(e) =>
                setSelectedDepartmentId(e.target.value ? Number(e.target.value) : null)
              }
              disabled={!selectedCollegeId || departments.length === 0}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100"
            >
              <option value="">
                {!selectedCollegeId
                  ? "Select college first"
                  : departments.length === 0
                  ? "No departments available"
                  : "Select department"}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.user.name}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60 transition-colors"
          >
            {loading ? "Creating..." : "Create Student Account"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Want a different account type?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-500 hover:text-blue-600 hover:underline"
            >
              Go back
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
