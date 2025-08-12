import { getDBConnection } from "@/lib/db";

export async function POST(req) {
  try {
    const { results, password } = await req.json(); 

    // VERY simple password check
    if (password !== process.env.LUDOPASSWORD) {
      return new Response(JSON.stringify({ message: "Invalid password" }), { status: 403 });
    }

    if (!Array.isArray(results) || results.length !== 4) {
      return new Response(JSON.stringify({ message: "Invalid results format" }), { status: 400 });
    }

    // ✅ Check for duplicate names (case-insensitive)
    const lowerCaseNames = results.map((name) => name.trim().toLowerCase());
    if (new Set(lowerCaseNames).size !== results.length) {
      return new Response(JSON.stringify({ message: "Duplicate player names are not allowed" }), { status: 400 });
    }

    const points = [5, 3, 1, 0];
    const positions = ["first_place", "second_place", "third_place", "fourth_place"];

    const db = await getDBConnection();

    // Record the game
    await db.execute(
      `INSERT INTO games (first_place_player, second_place_player, third_place_player, fourth_place_player)
       VALUES (?, ?, ?, ?)`,
      results
    );

    // Update each player's stats
    for (let i = 0; i < results.length; i++) {
      const name = results[i];
      const score = points[i];
      const field = positions[i];

      await db.execute(
        `INSERT INTO players (name, games_played, ${field}, score)
         VALUES (?, 1, 1, ?)
         ON DUPLICATE KEY UPDATE
           games_played = games_played + 1,
           ${field} = ${field} + 1,
           score = score + ?`,
        [name, score, score]
      );
    }

    return new Response(JSON.stringify({ message: "Game recorded successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Database error" }), { status: 500 });
  }
}
