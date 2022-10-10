require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query(`SELECT * FROM Users;`, (err, res) => {
  if (err) {
    console.log("Error - Failed to select all from Users");
    console.log(err);
  } else {
    console.log(res.rows);
  }
});
