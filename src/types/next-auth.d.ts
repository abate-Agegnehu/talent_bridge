import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { RegistrationStatus } from "@/generated/prisma/enums"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
    company?: {
      id: number
      userId: number
      status: RegistrationStatus
    } | null
    university?: {
      id: number
      userId: number
      status: RegistrationStatus
    } | null
    student?: {
      id: number
      userId: number
      year: number
      cgpa?: number | null
      universityId: number | null
      departmentId: number | null
    } | null
    advisor?: {
      id: number
      userId: number
      departmentId: number
    } | null
    college?: {
      id: number
      userId: number
      universityId: number
    } | null
    department?: {
      id: number
      userId: number
      collegeId: number
    } | null
    admin?: {
      id: number
      userId: number
    } | null
  }

  interface User {
    id: string
    role: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string
    role: string
    company?: {
      id: number
      userId: number
      status: RegistrationStatus
    } | null
    university?: {
      id: number
      userId: number
      status: RegistrationStatus
    } | null
    student?: {
      id: number
      userId: number
      year: number
      cgpa?: number | null
      universityId: number | null
      departmentId: number | null
    } | null
    advisor?: {
      id: number
      userId: number
      departmentId: number
    } | null
    college?: {
      id: number
      userId: number
      universityId: number
    } | null
    department?: {
      id: number
      userId: number
      collegeId: number
    } | null
    admin?: {
      id: number
      userId: number
    } | null
  }
}
