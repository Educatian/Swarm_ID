import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const authHeader = request.headers.get("Authorization") || "";
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const body = await request.json();
  const action = String(body.action || "invite").trim();
  const courseId = String(body.courseId || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const displayName = String(body.displayName || "").trim();
  if (!courseId || !email) return new Response(JSON.stringify({ error: "courseId and email are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const { data: membership, error: membershipError } = await userClient
    .from("course_memberships")
    .select("course_id, role, status")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .eq("role", "admin")
    .eq("status", "active")
    .maybeSingle();
  if (membershipError || !membership) return new Response(JSON.stringify({ error: "Instructor permission required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  if (action === "revoke") {
    const { data: row, error } = await adminClient.from("course_invites").update({ status: "revoked", revoked_at: new Date().toISOString() }).eq("course_id", courseId).eq("email", email).select("*").single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ invite: row }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const { data: invite, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { display_name: displayName },
  });
  if (inviteError) return new Response(JSON.stringify({ error: inviteError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const { data: row, error: rowError } = await adminClient.from("course_invites").upsert({
    course_id: courseId,
    email,
    display_name: displayName || null,
    status: "pending",
    auth_user_id: invite.user.id,
    created_by: user.id,
    sent_at: new Date().toISOString(),
    last_sent_at: new Date().toISOString(),
  }, { onConflict: "course_id,email" }).select("*").single();
  if (rowError) return new Response(JSON.stringify({ error: rowError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  return new Response(JSON.stringify({ invite: row }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
