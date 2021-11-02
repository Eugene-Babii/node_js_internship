import express from "express";
import { resolve } from "path";
import { createConnection } from "mysql";

const __dirname = resolve();
const PORT = process.env.PORT ?? 3000;
const app = express();
const db = createConnection({
  host: "localhost",
  user: "root",
  password: "2homOBC5",
  database: "users_db",
});

app.set("view engine", "hbs");
app.set("views", resolve(__dirname, "express", "views"));
app.use(express.urlencoded({ extended: false }));

// READ
app.get("/", function (req, res) {
  db.query("SELECT * FROM users", function (err, data) {
    if (err) return console.log(err);
    console.log("db:", data);
    res.render("index.hbs", {
      users: data,
    });
  });
});

// CREATE
app.post("/create", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const age = req.body.age;
  db.query(
    "INSERT INTO users (name, age) VALUES (?,?)",
    [name, age],
    function (err, data) {
      if (err) return console.log(err);
      res.redirect("/");
    }
  );
});

// UPDATE
app.post("/edit", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const age = req.body.age;
  const id = req.body.id;

  db.query(
    "UPDATE users SET name=?, age=? WHERE id=?",
    [name, age, id],
    function (err, data) {
      if (err) return console.log(err);
      res.redirect("/");
    }
  );
});

// DELETE
app.post("/delete/:id", function (req, res) {
  const id = req.params.id;
  db.query("DELETE FROM users WHERE id=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
