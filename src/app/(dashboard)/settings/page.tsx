import { createClient } from "@/lib/supabase/server";
import SettingsClient from "@/components/dashboard/SettingsClient";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", user!.id).single(),
  ]);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/50 mt-1">Manage your account and subscription.</p>
      </div>
      <SettingsClient user={user} profile={profile} subscription={subscription} />
    </div>
  );
}
