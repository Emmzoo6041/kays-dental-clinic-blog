import { NextResponse } from "next/server";
import { isAdmin, getCurrentUser } from "@/lib/supabase-server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null, isAdmin: false });
  return NextResponse.json({
    user: { email: user.email },
    isAdmin: await isAdmin(),
  });
}
