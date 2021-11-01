import { readdirSync, stat } from "fs";
import { join, basename } from "path";

const folders_tree = new Object();

const createDirTree = (rootPath, maxDepth, tree) => {
  //добавить проверку является ли путь папкой...

  maxDepth--;

  //выход из рекурсии
  if (maxDepth < 0) return;

  // const levelCount = maxDepth;
  console.log("*************************************************");
  console.log("tree: ", tree);

  console.log("rootPath:", rootPath);

  const nodeName = basename(rootPath);
  console.log("nodeName: ", nodeName);

  const currentNode = (tree[nodeName] = {});
  console.log("### tree: ", tree);

  console.log("currentNode: ", currentNode);

  let innerStructure = readdirSync(rootPath, { withFileTypes: true });
  console.log("innerStructure: ", innerStructure);

  innerStructure.forEach((item) => {
    if (item.isFile()) {
      currentNode[item.name] = "file";
    }
    if (item.isDirectory()) {
      const dir = item.name;
      currentNode[dir] = {};
      console.log("dir:", dir);
      console.log("currentNode:", currentNode);

      // tree = { ...tree, newDir };
      let _maxDepth = maxDepth;
      _maxDepth--;

      createDirTree(join(rootPath, item.name), _maxDepth, currentNode);
    }
  });
};

createDirTree("/home/developer/Projects", 4, folders_tree);

console.log("======");
console.log("folders_tree: ", folders_tree);
