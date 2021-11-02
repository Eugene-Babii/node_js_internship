import express from "express";

const PORT = process.env.PORT ?? 3000;

const app = express();

//test in postman:

app.get("/", function (req, res) {
  res.send("Hello Express!");
});

app.post("/", function (req, res) {
  res.send("Got a POST request");
});

app.put("/user", function (req, res) {
  res.send("Got a PUT request at /user");
});

app.delete("/user", function (req, res) {
  res.send("Got a DELETE request at /user");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
