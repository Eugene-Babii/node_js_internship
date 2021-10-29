import { createConnection } from "mysql";

let connection = createConnection({
  host: "localhost",
  user: "root",
  password: "2homOBC5",
  database: "shop_db",
});

connection.connect(function (err) {
  if (err) {
    return console.error("error connection: " + err.message);
  }
  console.log("Connected to the MySQL server");

  //create table indexesTest
  //   let create_table = `create table if not exists indexesTest(
  //       id int primary key auto_increment,
  //       title varchar(255)not null,
  //       completed tinyint(1) not null default 0
  //   )`;

  //   connection.query(create_table, function (err, results, fields) {
  //     if (err) {
  //       console.log(err.message);
  //     }
  //   });

  //add index 1
  //   let index_1 = `CREATE INDEX index1 ON indexesTest (id);`;
  //   let index_1 = "ALTER TABLE indexesTest DROP INDEX `id`;";

  //   connection.query(index_1, function (err, results, fields) {
  //     if (err) {
  //       console.log(err.message);
  //     }
  //     console.log(results);
  //   });

  //add index 2
  //   let index_2 = `CREATE INDEX index2 ON indexesTest (id, title);`;
  //   connection.query(index_2, function (err, results, fields) {
  //     if (err) {
  //       console.log(err.message);
  //     }
  //     console.log(results);
  //   });

  //add index 3
  // let index_3 = `CREATE INDEX index3 ON indexesTest (title);`;
  // connection.query(index_3, function (err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //   }
  //   console.log(results);
  // });

  //   let sql = `SELECT * FROM todos WHERE completed = ?`;
  //   connection.query(sql, [true], function (err, results, fields) {
  //     if (err) {
  //       console.log(err.message);
  //     }
  //     console.log(results);
  //   });

  // let sql = `SELECT product_name FROM orders WHERE customer_id = ANY
  //   (SELECT customer_id FROM customers WHERE employee_id = 2)`;

  connection.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }
    console.log(results);
  });

  //end connection
  connection.end(function (err) {
    if (err) {
      return console.log(err.message);
    }
    console.log("Connection end");
  });
});
