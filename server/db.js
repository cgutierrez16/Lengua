const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "seal20017040",
    host: "localhost",
    port: 5432,
    database: "songs"
})

module.exports = pool;