const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    user: process.env.username,
    host: process.env.db_host,
    database: process.env.database,
    password: process.env.password,
    port: 5432, // default PostgreSQL port
    ssl: true
  });
  
  pool.on('error', (err, client) => {
    console.error('Error occurred:', err);
  });


  module.exports = {pool,};