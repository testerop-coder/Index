import { clientPromise1, clientPromise2 } from "../../../lib/mongodb";

export const dynamic = "force-dynamic"; // cache band - har baar fresh data

const PROJECTION = {
  _id: 1, title: 1, genres: 1, image_url: 1, watch_link: 1,
  views: 1, featured: 1, buttons: 1, added_at: 1,
};

async function fetchFrom(clientPromise) {
  if (!clientPromise) return [];
  const client = await clientPromise;
  const col = client.db("aniindex").collection("anime");
  const docs = await col.find({}, { projection: PROJECTION }).sort({ title: 1 }).toArray();
  return docs.map(d => ({ ...d, _id: d._id.toString() }));
}

export async function GET() {
  try {
    // Fetch both DBs in parallel. clientPromise2 is null if MONGO_URI_2 isn't
    // configured, in which case fetchFrom just returns an empty array — so
    // this works identically whether one or two DBs are set up.
    const [fromDb1, fromDb2] = await Promise.all([
      fetchFrom(clientPromise1),
      fetchFrom(clientPromise2),
    ]);

    const combined = [...fromDb1, ...fromDb2].sort((a, b) => a.title.localeCompare(b.title));

    return Response.json({ ok: true, data: combined });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
