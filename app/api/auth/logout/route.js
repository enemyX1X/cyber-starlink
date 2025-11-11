export async function POST() {
  // expire cookie
  const cookie = `cs_user=; Path=/; Max-Age=0; SameSite=Lax`;
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
  });
}
