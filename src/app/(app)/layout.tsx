import { AppHeader } from "@/components/AppHeader";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader userEmail={user?.email} logout={logout} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
