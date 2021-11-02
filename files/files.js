import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
  createReadStream,
  openSync,
  read,
} from "fs";
import lineReader from "line-reader";
import readline from "readline";
import faker from "faker";
import fetch from "node-fetch";
const { helpers } = faker;

const __dirname = dirname(fileURLToPath(import.meta.url));
const fileRead = join(__dirname, "text.txt");
const fileWrite = join(__dirname, "text2.txt");

//==
//
// async read
//
//==

// readFile(fileRead, "utf8", function (error, data) {
//   console.log("Async reading: ");
//   if (error) throw error;
//   console.log(data);
// });

//==
//
// sync read
//
//==

// console.log("Sync reading: ");
// let fileContent = readFileSync(fileRead, "utf8");
// console.log(fileContent);

const content = "Some content!";

//==
//
//async write
//
//==

// writeFile(fileWrite, content, (err) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log("file written successfully");
// });

//==
//
//sync write
//
//==

// try {
//   const data = writeFileSync(fileWrite, content);
//   console.log("file written successfully");
// } catch (err) {
//   console.error(err);
// }

//==
//
//read by line ("line-reader")
//
//==

// console.log("Reading by line-reader: ");
// lineReader.eachLine(fileRead, (line, last) => {
//   console.log(":line-reader: ", line);
// });

//==
//
//read by line v.2 ("readline")
//
//==

// console.log("Reading by readline: ");
// const rl = readline.createInterface({
//   input: createReadStream(fileRead),
//   output: process.stdout,
//   terminal: false,
// });

// rl.on("line", (line) => {
//   console.log(":readline: ", line);
// });

//==
//
//read by characters
//
//==

// const N_CHAR = 30;
// const fd = openSync(fileRead, "r");

// function readOneCharFromFile(position) {
//   let buf = Buffer.alloc(1);
//   read(fd, buf, 0, 1, position, function (err, bytesRead, buffer) {
//     console.log("character", position + 1, ":", String(buffer));
//   });
// }

// for (let i = 0; i < N_CHAR; i++) {
//   if (true) {
//     readOneCharFromFile(i);
//   }
// }

//==
//
// write javascript object to file as JSON
//
//==

// write JSON object to file
// const user = helpers.userCard();
// const data = JSON.stringify(user, null, 4);

// writeFile("files/user.json", data, (err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("JSON data is saved.");
// });

// read JSON object from file
// readFile("files/user.json", "utf-8", (err, data) => {
//   if (err) {
//     throw err;
//   }
//   const user = JSON.parse(data.toString());
//   console.log(user);
// });

//==
//
//Request remote open API, save response to the file
//
//==

// const URL = "https://jsonplaceholder.typicode.com/todos";

// fetch(URL)
//   .then((response) => response.json())
//   .then((json) => JSON.stringify(json, null, 4))
//   .then((data) => {
//     writeFile("files/todos.json", data, (err) => {
//       if (err) {
//         throw err;
//       }
//       console.log("Data from API is saved to file todos.json");
//     });
//   });
