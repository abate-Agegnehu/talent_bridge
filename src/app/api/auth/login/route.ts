import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  let email: string | undefined
  let password: string | undefined
  let callbackUrl = "/dashboard"

  try {
    const body = await request.json()
    email = body?.email
    password = body?.password
    if (body?.callbackUrl && typeof body.callbackUrl === "string") {
      callbackUrl = body.callbackUrl
    }
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 },
    )
  }

  if (!email || !password) {
    return NextResponse.json(
      { message: "email and password are required" },
      { status: 400 },
    )
  }

  const origin = request.nextUrl.origin

  // 1) Fetch CSRF token, forwarding incoming cookies
  const csrfRes = await fetch(new URL("/api/auth/csrf", origin), {
    headers: { cookie: request.headers.get("cookie") || "" },
    cache: "no-store",
  })

  if (!csrfRes.ok) {
    return NextResponse.json(
      { message: "Failed to fetch CSRF token" },
      { status: 500 },
    )
  }

  const csrfJson = (await csrfRes.json()) as { csrfToken?: string }
  const csrfToken = csrfJson.csrfToken
  const csrfSetCookie = csrfRes.headers.get("set-cookie") || ""
  const csrfCookiePair = csrfSetCookie.split(";")[0]

  if (!csrfToken) {
    return NextResponse.json(
      { message: "Missing CSRF token" },
      { status: 500 },
    )
  }

  // 2) Convert JSON payload to form-urlencoded expected by NextAuth
  const form = new URLSearchParams()
  form.set("csrfToken", csrfToken)
  form.set("email", email)
  form.set("password", password)
  form.set("callbackUrl", callbackUrl)
  form.set("json", "true")
  form.set("redirect", "false")

  // 3) Proxy the request to NextAuth credentials callback
  let authRes = await fetch(
    new URL("/api/auth/callback/credentials", origin),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Cookie: [
          request.headers.get("cookie") || "",
          csrfCookiePair,
        ].filter(Boolean).join("; "),
      },
      body: form.toString(),
      cache: "no-store",
      redirect: "manual",
    },
  )

  // If NextAuth still returns a 302, convert to JSON response
  // Successful auth often sets cookies and provides a Location.
  if (authRes.status === 302) {
    const location = authRes.headers.get("location") || callbackUrl
    const setCookie = authRes.headers.get("set-cookie") || ""
    const hasSessionCookie = /\b(next-auth\.session-token|__Secure-next-auth\.session-token)=/.test(setCookie)
    const isErrorRedirect = /[?&]error=/.test(location)
    const ok = hasSessionCookie || !isErrorRedirect
    const response = NextResponse.json(
      { ok, redirect: location },
      { status: 200 },
    )
    if (setCookie) {
      response.headers.set("set-cookie", setCookie)
    }
    return response
  }

  // 4) Build JSON response and forward Set-Cookie to client
  let data: unknown = null
  try {
    data = await authRes.json()
  } catch {
    // ignore parse errors; some responses may be empty on success
  }

  const response = NextResponse.json(
    data ?? { ok: authRes.ok },
    { status: authRes.status },
  )

  const setCookie = authRes.headers.get("set-cookie")
  if (setCookie) {
    response.headers.set("set-cookie", setCookie)
  }

  return response
}
