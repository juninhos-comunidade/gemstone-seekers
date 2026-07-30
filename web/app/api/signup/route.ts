import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();
  const hash = await bcrypt.hash(body.password, 10);

  return Response.json({ ok: true, hash, received: body }); // ✅ agora inclui o hash
}
