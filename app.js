import moment from "moment";
import _ from "lodash";

//moment
// const now = moment().format("DD MMMM YYYY");
const now = moment().format("HH:mm:ss:SSS");

console.log("time: ", now);

//lodash
var array = [1, 2, 3];
_.reverse(array);
console.log(array);

const zippedArrey = _.zip(
  ["a", "b", "c", "d"],
  [1, 2, 3, 4],
  [true, false, true, false],
  ["*", "*", "*", "*"]
);
const unZippedArray = _.unzip(zippedArrey);
console.log("zippedArrey: ", zippedArrey);
console.log("unZippedArray: ", unZippedArray);
console.log(_.now());
