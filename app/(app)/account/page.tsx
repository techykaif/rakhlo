import { createClient } from "@/lib/supabase/server";
import { AccountManagement } from "@/components/account/account-management";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data: deletion } = await supabase
    .from("account_deletion_requests")
    .select("requested_at,scheduled_for")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  const identities = userData.user.identities ?? [];
  const primaryProvider =
    typeof userData.user.app_metadata?.provider === "string"
      ? userData.user.app_metadata.provider
      : null;
  const hasOAuthIdentity = identities.some((identity) => identity.provider !== "email" && identity.provider !== "phone");
  const canChangePassword =
    primaryProvider === "email" ||
    (primaryProvider === null && identities.some((identity) => identity.provider === "email"));

  return (
    <AccountManagement
      email={userData.user.email ?? ""}
      hasOAuthIdentity={hasOAuthIdentity}
      canChangePassword={canChangePassword}
      deletion={
        deletion
          ? { requestedAt: deletion.requested_at, scheduledFor: deletion.scheduled_for }
          : null
      }
    />
  );
}
