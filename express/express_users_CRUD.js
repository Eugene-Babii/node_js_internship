import express from "express";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/auth.js";
import { logger } from "../winston.js";
import os from "os";
import cluster from "cluster";
import { createClient } from "redis";
import Queue from "bull";
import { connect_db, knex_database } from "../db/db_connection.js";

const __dirname = resolve();
const app = express();
const PORT = process.env.PORT ?? 3001;
const TOKEN_KEY = process.env.TOKEN_KEY;

//db for sql
const db = connect_db("users_db");

//db for knex
const knex_db = knex_database("users_db");

const redis = createClient();
redis.on("error", (err) => console.log("Redis Client Error", err));

const usersQueue = new Queue("users");

const settings = {
  guardInterval: 60000, // Poll interval for delayed jobs and added jobs.
};
const updateQueue = new Queue("update", { settings });

app.set("view engine", "hbs");
app.set("views", resolve(__dirname, "express", "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  if (cluster.isWorker)
    console.log(`Worker ${cluster.worker.id} handle request`);
  next();
});

// READ
app.get("/", function (req, res) {
  db.query("SELECT * FROM users", function (err, data) {
    if (err) return console.log(err);
    logger.info("Server Sent List Of Users");
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
  redis.set(name, age);
  usersQueue.add({ name, age });
});

// UPDATE
app.post("/edit", async function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const _job = JSON.parse(JSON.stringify(req.body));

  let progress = 5;
  updateQueue.add(_job, { delay: progress * 1000 });

  updateQueue.process(async (job) => {
    const { name, age, id } = job.data;

    db.query(
      "UPDATE users SET name=?, age=? WHERE id=?",
      [name, age, id],
      function (err, data) {
        if (err) return console.log(err);
        // console.log(`User ${name} updated`);
        logger.info(`User ${name} updated`);
        return res.redirect("/");
      }
    );
  });

  // updateQueue.on("completed", (job) => {
  //   console.log(`Job with id ${job.id} has been completed`);
  // });

  // updateQueue.on("progress", (job, progress) => {
  //   console.log(`User will update after: ${progress} seconds`);
  // });
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
      logger.error(
        `400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(400).send(`
      All input is required</br>
      <a href="/">Main page</a>
      `);
    }

    const oldUser = await knex_db("users").where("email", email);
    if (oldUser.length) {
      logger.error(
        `409 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(409).send(`
      User Already Exist. Please Login</br>
      <a href="/">Main page</a>      
      `);
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

    // res.status(201).json(user);
    return res.status(201).send(`
      Registered new user with id=${user}</br>
      <a href="/">Main page</a>      
      `);
  } catch (err) {
    console.log(err);
  }
});

//LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

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
    res.status(200).send(`Welcome! You have a token...`);
  } catch (err) {
    console.log(err);
  }
});

//clusters manage
if (cluster.isMaster) {
  let cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) cluster.fork();
  cluster.on("exit", (worker, code) => {
    console.log(`Worker ${worker.id} finished. Exit code: ${code}`);
    app.listen(PORT, () => console.log(`Worker ${cluster.worker.id} launched`));
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
    usersQueue.process(function (job) {
      console.log("User", job.data.name, "added to redis in queue");
      console.log("Job done by worker", cluster.worker.id, job.id);
    });
  });
}
