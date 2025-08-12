import { getDBConnection } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDBConnection();
    const [rows] = await db.execute("SELECT * FROM players ORDER BY score DESC, first_place DESC, second_place DESC");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Database error" }), { status: 500 });
  }
}
