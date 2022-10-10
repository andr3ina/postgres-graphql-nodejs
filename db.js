const { Pool } = require("pg");
const pool = new Pool({
  connectionString:
    "postgres://hdkjjtbmuljjxc:e030addfa084a2baf53b7593117f01072155ce21a431db49b339edc19e0456b2@ec2-44-209-24-62.compute-1.amazonaws.com:5432/d8jg0id5i3n04d",
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
