import express from "express";
import { resolve } from "path";
import os from "os";
import cluster from "cluster";
import { createClient } from "redis";
import Queue from "bull";
import hbs from "hbs";
import expressHbs from "express-handlebars";
import session from "express-session";
import redisStorage from "connect-redis";

import usersRoutes from "../routes/usersRouter.js";
import authRoutes from "../routes/authRouter.js";

const app = express();
const PORT = process.env.PORT ?? 3001;
const __dirname = resolve();

const storage = redisStorage(session);
const redis = createClient();
redis.on("error", (err) => console.log("Redis Client Error", err));

const usersQueue = new Queue("users");

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "express/views/layouts",
    defaultLayout: "layout",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", resolve(__dirname, "express", "views"));
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    store: new storage({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      client: redis,
    }),
    secret: "you secret key",
    saveUninitialized: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  if (cluster.isWorker)
    console.log(`Worker ${cluster.worker.id} handle request`);
  next();
});

app.get("/", (req, res) => {
  res.redirect("/api/users");
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
