import type { NextAuthConfig } from "next-auth"
import prisma from "@/lib/prisma"

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        const userId = Number(user.id)
        if (user.role === "UNIVERSITY") {
          const university = await prisma.university.findFirst({ where: { userId } })
          token.university = university ?? null
        } else if (user.role === "COMPANY") {
          const company = await prisma.company.findFirst({ where: { userId } })
          token.company = company ?? null
        } else if (user.role === "STUDENT") {
          const student = await prisma.student.findFirst({ where: { userId } })
          token.student = student ?? null
        } else if (user.role === "ADVISOR") {
          const advisor = await prisma.advisor.findFirst({ where: { userId } })
          token.advisor = advisor ?? null
        } else if (user.role === "COLLEGE") {
          const college = await prisma.college.findFirst({ where: { userId } })
          token.college = college ?? null
        } else if (user.role === "DEPARTMENT") {
          const department = await prisma.department.findFirst({ where: { userId } })
          token.department = department ?? null
        } else if (user.role === "ADMIN") {
          const admin = await prisma.admin.findFirst({ where: { userId } })
          token.admin = admin ?? null
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.university = token.university
        session.company = token.company
        session.student = token.student
        session.advisor = token.advisor
        session.college = token.college
        session.department = token.department
        session.admin = token.admin
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
