import {
  Users,
  Building2,
  GraduationCap,
  MessageSquare,
  FileText,
  Briefcase,
  LayoutDashboard,
  Settings,
  FileBarChart,
  UserCheck,
  Building,
  School,
  BookOpen,
  ClipboardList,
  CheckSquare,
  UserPlus,
  Send,
  Bell,
  Search,
  LogOut,
  Menu
} from "lucide-react";

export type Role = 'UNIVERSITY' | 'COMPANY' | 'COLLEGE' | 'DEPARTMENT' | 'ADVISOR' | 'STUDENT' | 'ADMIN';

export const MENU_ITEMS: Record<Role, {
  label: string;
  items: {
    label: string;
    icon: any;
    href: string;
    active?: boolean;
  }[]
}[]> = {
  ADMIN: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
      ]
    },
    {
      label: "Management",
      items: [
        { label: "University", icon: School, href: "/dashboard/universities" },
        { label: "Company", icon: Building2, href: "/dashboard/companies" },
      ]
    }
  ],
  UNIVERSITY: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
      ]
    },
    {
      label: "Management",
      items: [
        { label: "Colleges", icon: Building, href: "/dashboard/colleges" },
      ]
    },
  ],
  COLLEGE: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
      ]
    },
    {
      label: "Management",
      items: [
        { label: "Departments", icon: Building, href: "/dashboard/departments" },
        { label: "Advisors", icon: Users, href: "/dashboard/advisors" },
      ]
    },
    {
      label: "Reports",
      items: [
        { label: "Reports", icon: FileBarChart, href: "/dashboard/reports" },
      ]
    }
  ],
  DEPARTMENT: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
      ]
    },
    {
      label: "Advisors & Students",
      items: [
        { label: "Advisors", icon: UserPlus, href: "/dashboard/advisors" },
        { label: "Students", icon: GraduationCap, href: "/dashboard/students" },
        { label: "Assign Advisor", icon: GraduationCap, href: "/dashboard/assign-advisor" },

      ]
    },

  ],
  ADVISOR: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
      ]
    },
    {
      label: "Students",
      items: [
        { label: "Assigned Students", icon: GraduationCap, href: "/dashboard/students" },
      ]
    },
    {
      label: "Communication",
      items: [
        { label: "Chat", icon: MessageSquare, href: "/dashboard/chat" },
      ]
    }
  ],
  COMPANY: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
      ]
    },
    {
      label: "Internships",
      items: [
        { label: "Manage Internships", icon: Briefcase, href: "/dashboard/internships" },
      ]
    },
    {
      label: "Reports & Comms",
      items: [
        { label: "Reports", icon: FileText, href: "/dashboard/reports" },
        { label: "Chat", icon: MessageSquare, href: "/dashboard/chat" },
      ]
    }
  ],
  STUDENT: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
      ]
    },
    {
      label: "Internship",
      items: [
        { label: "Internship", icon: Send, href: "/dashboard/apply" },
        { label: "Acceptance Letter", icon: FileText, href: "/dashboard/acceptance" },
      ]
    },
    {
      label: "Learning",
      items: [
        { label: "Skills", icon: BookOpen, href: "/dashboard/skills" },
      ]
    },
    {
      label: "Communication",
      items: [
        { label: "Chat", icon: MessageSquare, href: "/dashboard/chat" },
      ]
    }
  ]
};
