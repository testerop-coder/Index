import clientPromise from "../../../lib/mongodb";

export const dynamic = "force-dynamic"; // cache band - har baar fresh data

export async function GET() {
  try {
    const client = await clientPromise;
    const col    = client.db("aniindex").collection("anime");
    const anime  = await col
      .find({}, { projection: { _id: 1, title: 1, genres: 1, image_url: 1, watch_link: 1, views: 1, featured: 1, buttons: 1, added_at: 1 } })
      .sort({ title: 1 })
      .toArray();

    // convert ObjectId to string
    const data = anime.map(a => ({ ...a, _id: a._id.toString() }));
    return Response.json({ ok: true, data });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
