// Port
process.env.PORT = process.env.PORT || 3000;

// Enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database
let DB_URL;

process.env.NODE_ENV === 'dev' ?  DB_URL = 'mongodb://localhost:27017/CRUD' : DB_URL = process.env.MONGO_URI;

process.env.DB_URL = DB_URL;

// Token expiration
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

// Seed
process.env.SEED = process.env.SEED || 'dev-seed';

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '1069546220836-rgrlrjupnbp65rvfi7hintvinm559ltq.apps.googleusercontent.com'; 