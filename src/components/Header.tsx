import { createServerSupabase, isAdmin } from "@/lib/supabase-server";
import { CLINIC } from "@/lib/clinic";
import { SignOutButton } from "./SignOutButton";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const supabase = createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const admin = await isAdmin();

  return (
    <HeaderClient
      logoUrl={CLINIC.logoUrl}
      clinicName={CLINIC.blogName}
      address={CLINIC.address1}
      isAdmin={admin}
      userEmail={user?.email ?? null}
      signOutSlot={user ? <SignOutButton /> : null}
    />
  );
}
