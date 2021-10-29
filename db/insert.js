import { createConnection } from "mysql";

let config = {
  host: "localhost",
  user: "root",
  password: "2homOBC5",
  database: "shop_db",
};

let connection = createConnection(config);

let stmt = `INSERT INTO indexesTest(title,completed)  VALUES ?  `;
let rows = [];

for (let i = 0; i < 1000000; i++) {
  rows.push([`Row ${i + 1} at table indexesTest`, false]);
}

connection.query(stmt, [rows], (err, results, fields) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Row inserted:" + results.affectedRows);
});

// connection.query(stmt, [rows], (err, results, fields) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log("Row inserted:" + results.affectedRows);
// });

connection.end();
