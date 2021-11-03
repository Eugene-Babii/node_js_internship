import express from "express";
import { resolve } from "path";
import { createConnection } from "mysql";
import knex from "knex";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/auth.js";

const __dirname = resolve();
const PORT = process.env.PORT ?? 3001;
const app = express();
const TOKEN_KEY = ";jhf987r4nh;2kjnl;xn;/*21";
const db = createConnection({
  host: "localhost",
  user: "root",
  password: "2homOBC5",
  database: "users_db",
});
const knex_db = knex({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "2homOBC5",
    database: "users_db",
  },
});

app.set("view engine", "hbs");
app.set("views", resolve(__dirname, "express", "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// READ
app.get("/", function (req, res) {
  db.query("SELECT * FROM users", function (err, data) {
    if (err) return console.log(err);
    // console.log("db:", data);
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

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    if (!(email && password && name && age)) {
      return res.status(400).send(`
      All input is required</br>
      <a href="/">Main page</a>
      `);
    }

    const oldUser = await knex_db("users").where("email", email);
    if (oldUser.length) {
      return res.status(409).send(`
      User Already Exist. Please Login</br>
      <a href="/">Main page</a>      
      `);
      document
        .getElementById("#logInForm")
        .addEventListener("submit", async function (event) {});
    }

    const encryptedPassword = await bcrypt.hash(password, 8);

    const user = await knex_db("users").insert({
      name,
      age,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign({ user_id: user.id, email }, TOKEN_KEY, {
      expiresIn: "2h",
    });

    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

//LOGIN
app.post("/login", async (req, res) => {
  // console.log("req login");
  try {
    // console.log("req.body", req.body);

    const { email, password } = req.body;
    // console.log("email", email);
    // console.log("password", password);

    if (!(email && password)) {
      return res.status(400).send(`
        All input is required</br>
        <a href="/">Main page</a>
        `);
    }

    const user = await knex_db("users").where("email", email).select();

    if (user && (await bcrypt.compare(password, user[0].password))) {
      const token = jwt.sign({ user_id: user[0].id, email }, TOKEN_KEY, {
        expiresIn: "2h",
      });

      user[0].token = token;

      // res.status(200).json(token);
      res.status(200).json(user[0]);
    } else res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.post("/welcome", verifyToken, (req, res) => {
  try {
    const { userName } = req.body;
    console.log("name /welcome:", userName);
    res.status(200).send(`Welcome!`);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
