import { MongoClient } from "mongodb";

const URI_1 = process.env.MONGO_URI_1 || process.env.MONGO_URI;
const URI_2 = process.env.MONGO_URI_2 || null;

if (!URI_1) throw new Error("MONGO_URI_1 (or MONGO_URI) environment variable missing");

function makeClientPromise(uri, cacheKey) {
  if (!uri) return null;
  const options = {};

  if (process.env.NODE_ENV === "development") {
    if (!global[cacheKey]) {
      const client = new MongoClient(uri, options);
      global[cacheKey] = client.connect();
    }
    return global[cacheKey];
  }

  const client = new MongoClient(uri, options);
  return client.connect();
}

// clientPromise1 is always available. clientPromise2 is null if MONGO_URI_2 isn't set —
// every place that uses it checks for null first, so the site works fine with just one DB.
export const clientPromise1 = makeClientPromise(URI_1, "_mongoClientPromise1");
export const clientPromise2 = URI_2 ? makeClientPromise(URI_2, "_mongoClientPromise2") : null;

// default export kept for backward compatibility
export default clientPromise1;
