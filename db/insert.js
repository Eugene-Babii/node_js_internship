import { connect_db } from "./db_connection.js";
const connection_shop_db = connect_db("shop_db");

let stmt = `INSERT INTO indexesTest(title,completed)  VALUES ?  `;
let rows = [];

for (let i = 0; i < 1000000; i++) {
  rows.push([`Row ${i + 1} at table indexesTest`, false]);
}

connection_shop_db.query(stmt, [rows], (err, results, fields) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Row inserted:" + results.affectedRows);
});

// connection_shop_db.query(stmt, [rows], (err, results, fields) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log("Row inserted:" + results.affectedRows);
// });

connection_shop_db.end();
