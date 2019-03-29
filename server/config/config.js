// Port
process.env.PORT = process.env.PORT || 3000;

// Enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database
let DB_URL;

process.env.NODE_ENV === 'dev' ?  DB_URL = 'mongodb://localhost:27017/CRUD' : DB_URL = process.env.MONGO_URI;

process.env.DB_URL = DB_URL;