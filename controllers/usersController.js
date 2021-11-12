import { logger } from "../winston.js";
import knex from "knex";
import { connect_db, knex_database } from "../db/db_connection.js";
import { createClient } from "redis";
import Queue from "bull";
import { Model } from "objection";
import { User } from "../models/User.js";

const db = connect_db("users_db");

const redis = createClient();
redis.on("error", (err) => console.log("Redis Client Error", err));

const usersQueue = new Queue("users");
const settings = {
  guardInterval: 60000, // Poll interval for delayed jobs and added jobs.
};
const updateQueue = new Queue("update", { settings });

const knex_users = knex_database("users_db");
Model.knex(knex_users);

// READ
export const getAllUsers = async (req, res) => {
  try {
    //
    //version without model
    //

    // db.query("SELECT * FROM users", function (err, data) {
    //   if (err) return console.log(err);
    //   logger.info("Server Sent List Of Users");
    //   console.log("from READ: ", req.tokenIsDecoded);
    //   res.render("content.hbs", {
    //     users: data,
    //     tokenIsDecoded: (req.tokenIsDecoded = undefined
    //       ? false
    //       : req.tokenIsDecoded),
    //     name: req.body.userName,
    //   });
    // });

    //
    //version with model
    //

    const _users = await User.query();
    logger.info("Server Sent List Of Users");
    res.render("content.hbs", {
      users: _users,
      tokenIsDecoded: (req.tokenIsDecoded = undefined
        ? false
        : req.tokenIsDecoded),
      name: req.body.userName,
    });
  } catch (e) {
    res.status(500).json({ message: "Something wrong. Try again..." });
  }
};

// CREATE
export const createUser = async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const age = req.body.age;

    //
    //version without model
    //

    // db.query(
    //   "INSERT INTO users (name, age) VALUES (?,?)",
    //   [name, age],
    //   function (err, data) {
    //     if (err) return console.log(err);
    //     res.redirect("/api/users");
    //   }
    // );

    //
    //version with model
    //

    await User.query().insert({ name, age });
    res.redirect("/api/users");

    redis.set(name, age);
    usersQueue.add({ name, age });
  } catch (e) {
    res.status(500).json({ message: "Something wrong. Try again..." });
  }
};

// UPDATE
export const editUser = async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);
    const _job = JSON.parse(JSON.stringify(req.body));

    let seconds = 5;
    updateQueue.add(_job, { delay: seconds * 1000 });

    updateQueue.process(async (job) => {
      const { name, age, id } = job.data;

      //
      //version without model
      //

      // db.query(
      //   "UPDATE users SET name=?, age=? WHERE id=?",
      //   [name, age, id],
      //   function (err, data) {
      //     if (err) return console.log(err);
      //     // console.log(`User ${name} updated`);
      //     logger.info(`User ${name} updated`);
      //     return res.redirect("/api/users");
      //   }
      // );

      //
      //version with model
      //

      await User.query().findById(id).patch({ name, age });
      logger.info(`User ${name} updated`);
      res.redirect("/api/users");
    });

    // updateQueue.on("completed", (job) => {
    //   console.log(`Job with id ${job.id} has been completed`);
    // });

    // updateQueue.on("progress", (job, progress) => {
    //   console.log(`User will update after: ${progress} seconds`);
    // });
  } catch (e) {
    res.status(500).json({ message: "Something wrong. Try again..." });
  }
};

// DELETE
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    //
    //version without model
    //

    // db.query("DELETE FROM users WHERE id=?", [id], function (err, data) {
    //   if (err) return console.log(err);
    //   res.redirect("/api/users");
    // });

    //
    //version with model
    //
    await User.query().findById(id).delete();
    res.redirect("/api/users");
  } catch (e) {
    res.status(500).json({ message: "Something wrong. Try again..." });
  }
};
