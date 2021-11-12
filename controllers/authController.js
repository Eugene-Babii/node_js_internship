import { logger } from "../winston.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "redis";
import Queue from "bull";
import { knex_database } from "../db/db_connection.js";

const knex_db = knex_database("users_db");
const TOKEN_KEY = process.env.TOKEN_KEY;

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    if (!(email && password && name && age)) {
      logger.error(
        `400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(400).send(`
      All input is required</br>
      <a href="/api/users">Main page</a>
      `);
    }

    const oldUser = await knex_db("users").where("email", email);

    if (oldUser.length) {
      logger.error(
        `409 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(409).send(`
      User Already Exist. Please Login</br>
      <a href="/api/users">Main page</a>      
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
      <a href="/api/users">Main page</a>      
      `);
  } catch (e) {
    logger.error(
      `500 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    res.status(500).json({ message: "Something wrong. Try again..." });
  }
};

//LOGIN
export const loginUser = async (req, res) => {
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

      if (!req.session.key) req.session.key = req.sessionID;

      req.session.key[req.sessionID].showAd = req.body.showAd;

      // res.status(200).json(token);
      res.status(200).json(user[0]);
    } else res.status(400).send("Invalid Credentials");
  } catch (e) {
    res.status(500).json({ message: "Something wrong. Try again..." });
  }
};
