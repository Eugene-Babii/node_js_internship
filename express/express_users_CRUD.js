import express from "express";
import { resolve } from "path";
import { createConnection } from "mysql";
import knex from "knex";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __dirname = resolve();
const PORT = process.env.PORT ?? 3000;
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

// REGISTER
app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { name, age, email, password } = req.body;

    // Validate user input
    if (!(email && password && name && age)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await knex_db("users").where({ email: email });
    console.log("oldUser: ", oldUser);

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 8);

    // Create user in our database
    const user = await knex_db("users").insert({
      name,
      age,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    console.log("user: ", user);

    // Create token
    const token = jwt.sign({ user_id: user.id, email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    console.log("token: ", token);

    // save user token
    user.token = token;
    console.log("user: ", user);

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
        expiresIn: "2h",
      });

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// const auth = require("./middleware/auth");

// app.post("/welcome", auth, (req, res) => {
//   res.status(200).send("Welcome 🙌 ");
// });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
