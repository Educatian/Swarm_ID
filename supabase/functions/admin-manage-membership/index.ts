import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return response({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const authHeader = request.headers.get("Authorization") || "";
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return response({ error: "Authentication required" }, 401);

  const body = await request.json();
  const courseId = String(body.courseId || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const displayName = String(body.displayName || "").trim();
  const role = String(body.role || "admin").trim() === "user" ? "user" : "admin";
  if (!courseId || !email) return response({ error: "courseId and email are required" }, 400);

  const { data: instructor, error: instructorError } = await userClient
    .from("course_memberships")
    .select("course_id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .eq("role", "admin")
    .eq("status", "active")
    .maybeSingle();
  if (instructorError || !instructor) return response({ error: "Instructor permission required" }, 403);

  const { data: users, error: listError } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) return response({ error: listError.message }, 400);
  const target = users.users.find((item) => String(item.email || "").toLowerCase() === email);
  if (!target) return response({ error: "먼저 해당 이메일로 계정을 만들어야 합니다." }, 404);

  const { data: course, error: courseError } = await adminClient
    .from("courses")
    .select("institution_id, code")
    .eq("id", courseId)
    .single();
  if (courseError || !course) return response({ error: "Course not found" }, 404);

  const { data: membership, error: membershipError } = await adminClient
    .from("course_memberships")
    .upsert({
      user_id: target.id,
      institution_id: course.institution_id,
      course_id: courseId,
      role,
      display_name: displayName || target.user_metadata?.display_name || email,
      title: role === "admin" ? "Course instructor" : "Learner",
      section: course.code,
      is_primary: false,
      status: "active",
    }, { onConflict: "user_id,course_id" })
    .select("*")
    .single();
  if (membershipError) return response({ error: membershipError.message }, 400);
  return response({ membership });
});
