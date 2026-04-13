const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Use environment variable for password. Set DB_PASSWORD in your .env for production.
const env = process.env.ENV_CURRENT;
console.log({ env });

// Build URI depending on environment. If DEV, use local MongoDB; otherwise use Atlas with password from env.
let uri;
if (env === 'DEV') {
  console.log('RUNNING DEV ENV');
  uri = 'mongodb://localhost:27017';
} else {
  const user = process.env.MONGODB_USER || 'hyderdevelops_db_user';
  const password = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER || 'smi.pfdhbkd.mongodb.net';
  
  if (!password) {
    throw new Error('MongoDB password not set in environment variables');
  }
  
  uri = `mongodb+srv://${user}:${password}@${cluster}/?retryWrites=true&w=majority&appName=SMI`;
}

const ObjectID = ObjectId;

/* Reusable Database Object */
let db;
let client;

/* Create a MongoClient with a MongoClientOptions object to set the Stable API version */
function createClient(customUri) {
  const connectionUri = customUri || uri;
  return new MongoClient(connectionUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    retryWrites: true,
    maxPoolSize: 50,
    minPoolSize: 10,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 30000,
  });
}

/**
 * Connect to the database and cache the client/db for reuse.
 * Note: we intentionally do NOT close the client here so the connection stays open for the app lifetime.
 * @param {string} customUri optional connection string to override configured uri
 */
async function connect(customUri) {
  try {
    if (!client) {
      client = createClient(customUri);
    }

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    const dbName = process.env.DB_NAME || 'sheikh_imran';
    db = client.db(dbName);
    console.log('Database Connected');
    return db;
  } catch (err) {
    console.log('Database Connection Error ' + err);
    throw err;
  }
}

// Immediately attempt to connect (non-blocking). If you prefer lazy connect, remove this.
setTimeout(() => {
  connect()
    .then((database) => {
      db = database;
    })
    .catch((error) => {
      console.log('Database Connection Error ' + error);
    });
}, 2000);

/* General Read Query Function */
async function queryDatabase(collection_name, filter = {}, sort) {
  try {
    if (!db) throw new Error('Database not connected');
    const collection = db.collection(collection_name);
    let cursor = collection.find(filter);
    if (sort) cursor = cursor.sort(sort);
    const result = await cursor.toArray();
    return result;
  } catch (error) {
    console.log('Database Error ' + error);
    throw error;
  }
}

/* General Insert One */
async function insertIntoDatabase(collection_name, document) {
  try {
    if (!db) throw new Error('Database not connected');
    const collection = db.collection(collection_name);
    return await collection.insertOne(document);
  } catch (error) {
    console.log('Database Error ' + error);
    throw error;
  }
}

/* General Insert Many */
async function insertManyIntoDatabase(collection_name, documents) {
  try {
    if (!db) throw new Error('Database not connected');
    const collection = db.collection(collection_name);
    return await collection.insertMany(documents);
  } catch (error) {
    console.log('Database Error ' + error);
    throw error;
  }
}

/* Replace (upsert) */
async function ReplaceIntoDatabase(collection_name, filter, document, options = {}) {
  try {
    if (!db) throw new Error('Database not connected');
    const collection = db.collection(collection_name);
    // Use replaceOne with upsert option
    return await collection.replaceOne(filter, document, { upsert: true, ...options });
  } catch (error) {
    console.log('Database Error ' + error);
    throw error;
  }
}

async function UpdateDatabase(collection_name, filter, update, options = {}) {
  try {
    if (!db) throw new Error('Database not connected');
    const collection = db.collection(collection_name);
    return await collection.updateOne(filter, update, options);
  } catch (error) {
    console.log('Database Error ' + error);
    throw error;
  }
}

async function RemoveFromDatabase(collection_name, filter) {
  try {
    if (!db) throw new Error('Database not connected');
    const collection = db.collection(collection_name);
    return await collection.deleteOne(filter);
  } catch (error) {
    console.log('Database Error ' + error);
    throw error;
  }
}

async function Aggregate(collection_name, pipeline) {
  try {
    if (!db) throw new Error('Database not connected');
    const collection = db.collection(collection_name);
    return await collection.aggregate(pipeline).toArray();
  } catch (error) {
    console.log('Database Error ' + error);
    throw error;
  }
}

/**
 * Simple pagination helper
 * @param {string} collection_name
 * @param {object} filter
 * @param {number} page (1-based)
 * @param {number} limit
 * @param {object} sort
 */
async function Pagination(collection_name, filter = {}, page = 1, limit = 10, sort) {
  try {
    if (!db) throw new Error('Database not connected');
    const collection = db.collection(collection_name);
    const skip = (page - 1) * limit;
    let cursor = collection.find(filter);
    if (sort) cursor = cursor.sort(sort);
    const data = await cursor.skip(skip).limit(limit).toArray();
    const count = await collection.countDocuments(filter);
    return { count, data };
  } catch (error) {
    console.log('Database Error ' + error);
    throw error;
  }
}

async function closeClient() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Database connection closed');
  }
}

// Exports
exports.connect = connect;
exports.getDb = () => db;
exports.closeClient = closeClient;
exports.Pagination = Pagination;
exports.queryDatabase = queryDatabase;
exports.RemoveFromDatabase = RemoveFromDatabase;
exports.insertIntoDatabase = insertIntoDatabase;
exports.insertManyIntoDatabase = insertManyIntoDatabase;
exports.ReplaceIntoDatabase = ReplaceIntoDatabase;
exports.UpdateDatabase = UpdateDatabase;
exports.Aggregate = Aggregate;
exports.ObjectID = ObjectID;
