import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server component client — reads the user's session from cookies
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

// Admin client — uses the service role key, bypasses RLS. Server-only.
export function createAdminSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Get the currently logged-in user (or null)
export async function getCurrentUser() {
  const supabase = createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Check if the current user is the admin (Dr. Esther)
export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user?.email) return false;
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  return user.email.toLowerCase() === adminEmail;
}
