// Port
process.env.PORT = process.env.PORT || 3000;

// Enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database
let DB_URL;

process.env.NODE_ENV === 'dev' ?  DB_URL = 'mongodb://localhost:27017/CRUD' : DB_URL = 'mongodb+srv://Ian:TZMYcrN4uroG8BNV@cluster0-nsp2p.mongodb.net/CRUD';

process.env.DB_URL = DB_URL;