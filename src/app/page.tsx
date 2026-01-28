import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Building2,
  GraduationCap,
  MessageSquare,
  FileText,
  EyeOff,
  Link as LinkIcon,
  UserCheck,
  Briefcase,
  BarChart3,
  MessageCircle,
  UserPlus,
  FileBarChart,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
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
          <nav className="hidden md:flex gap-6">
            {/* Add nav links if needed */}
          </nav>
          <div className="flex items-center gap-4">
             <Link
              href="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-slate-900">
                  Bridging Students, Universities, and Industry Through Smart Internships
                </h1>
                <p className="max-w-[600px] text-slate-600 md:text-xl">
                  TalentBridge is a centralized digital platform that streamlines internship management, progress tracking, supervision, and evaluation — all in one place.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#how-it-works"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                  >
                    Explore How TalentBridge Works
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-blue-200 bg-white px-8 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                  >
                    View Features
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
                  {/* Abstract representation of the illustration */}
                  <div className="absolute top-0 right-0 p-4 bg-blue-100 rounded-2xl">
                     <Building2 className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="absolute top-1/4 left-0 p-4 bg-blue-100 rounded-2xl">
                     <GraduationCap className="w-16 h-16 text-blue-600" />
                  </div>
                   <div className="absolute bottom-0 right-1/4 p-4 bg-blue-100 rounded-2xl">
                     <Users className="w-16 h-16 text-blue-600" />
                  </div>
                  {/* Connecting lines could be added with SVG if needed for exact look */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why TalentBridge? */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">Why TalentBridge?</h2>
              <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                In today&apos;s dynamic educational and professional landscape, managing internships effectively is crucial yet often fraught with challenges. From fragmented communication to manual tracking, these hurdles can impede the valuable experience interns gain and the strategic partnerships institutions build.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
              <Card 
                icon={<MessageSquare className="h-8 w-8 text-blue-500" />}
                title="Fragmented Communication"
                description="Lack of a central hub leads to miscommunication and lost updates across stakeholders."
              />
              <Card 
                icon={<FileText className="h-8 w-8 text-blue-500" />}
                title="Manual Internship Management"
                description="Paperwork and disparate systems make administration cumbersome and prone to errors."
              />
              <Card 
                icon={<EyeOff className="h-8 w-8 text-blue-500" />}
                title="Limited Visibility & Feedback"
                description="Difficulty tracking student progress and providing timely, constructive feedback."
              />
              <Card 
                icon={<LinkIcon className="h-8 w-8 text-blue-500" />}
                title="Weak University-Industry Coordination"
                description="Challenges in forging and maintaining strong, mutually beneficial partnerships."
              />
            </div>
          </div>
        </section>

        {/* What is TalentBridge? */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
               <div className="rounded-full bg-blue-100 p-3">
                  <div className="h-6 w-6 text-blue-600 font-bold flex items-center justify-center">?</div>
               </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">What is TalentBridge?</h2>
              <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                TalentBridge is your comprehensive web-based platform designed to digitize and centralize the entire internship lifecycle. It seamlessly connects students seeking growth, universities fostering talent, and companies identifying future leaders. From internship posting and student application to advisor supervision, progress tracking, evaluation, and reporting, TalentBridge integrates every critical step to ensure a smooth, transparent, and enriching experience for all.
              </p>
            </div>
          </div>
        </section>

        {/* How TalentBridge Works */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">How TalentBridge Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StepCard number={1} title="Company" description="Post internship opportunities" />
              <StepCard number={2} title="Students" description="Apply and get assigned advisors" />
              <StepCard number={3} title="Progress" description="Tracked through reports and feedback" />
              <StepCard number={4} title="Universities" description="Evaluate and validate internship completion" />
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">Key Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
               <FeatureCard icon={<UserCheck className="h-6 w-6 text-blue-500" />} title="Role-Based Access" />
               <FeatureCard icon={<Briefcase className="h-6 w-6 text-blue-500" />} title="Internship Posting & Applications" />
               <FeatureCard icon={<BarChart3 className="h-6 w-6 text-blue-500" />} title="Progress Tracking & Weekly Reports" />
               <FeatureCard icon={<MessageCircle className="h-6 w-6 text-blue-500" />} title="Integrated Communication & Messaging" />
               <FeatureCard icon={<UserPlus className="h-6 w-6 text-blue-500" />} title="Advisor Assignment & Supervision" />
               <FeatureCard icon={<FileBarChart className="h-6 w-6 text-blue-500" />} title="Evaluation, Reports & Analytics" />
               <div className="md:col-span-2 lg:col-span-3 flex justify-center">
                  <FeatureCard icon={<ShieldCheck className="h-6 w-6 text-blue-500" />} title="Secure Authentication & Data Protection" className="max-w-sm w-full" />
               </div>
            </div>
          </div>
        </section>

         {/* Who Benefits */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">Who Benefits</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <BenefitColumn 
                title="For Students"
                items={[
                  "Discover relevant internship opportunities easily.",
                  "Simplified application and tracking process.",
                  "Direct communication with advisors and mentors.",
                  "Structured environment for skill development and feedback.",
                  "Access to performance reports for career development."
                ]}
              />
              <BenefitColumn 
                title="For Companies"
                items={[
                  "Access to a diverse pool of qualified student talent.",
                  "Streamlined posting and candidate management.",
                  "Efficient supervision and performance monitoring.",
                  "Strengthened employer branding and talent pipeline.",
                  "Simplified evaluation and feedback mechanisms."
                ]}
              />
              <BenefitColumn 
                title="For Universities"
                items={[
                  "Centralized platform for all internship programs.",
                  "Enhanced oversight and student support.",
                  "Robust reporting for accreditation and program review.",
                  "Improved collaboration with industry partners.",
                  "Digitized records and reduced administrative burden."
                ]}
              />
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center gap-4 text-center">
           <p className="text-xs text-slate-500">© 2025 TalentBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Card({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start space-y-2 rounded-lg border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="rounded-lg bg-blue-50 p-2">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center space-y-4 rounded-xl bg-white p-8 shadow-sm text-center">
       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
         {number}
       </div>
       <h3 className="text-xl font-bold text-slate-900">{title}</h3>
       <p className="text-slate-600">{description}</p>
    </div>
  )
}

function FeatureCard({ icon, title, className = "" }: { icon: React.ReactNode, title: string, className?: string }) {
    return (
        <div className={`flex flex-col items-center space-y-4 rounded-lg border border-slate-100 bg-white p-6 shadow-sm text-center hover:shadow-md transition-shadow ${className}`}>
            <div className="rounded-full bg-blue-50 p-3">
                {icon}
            </div>
            <h3 className="font-medium text-slate-900">{title}</h3>
        </div>
    )
}

function BenefitColumn({ title, items }: { title: string, items: string[] }) {
    return (
        <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
