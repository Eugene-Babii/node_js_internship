import { readdirSync, stat } from "fs";
import { join, basename } from "path";

const tree = new Object();

const createDirTree = (rootPath, maxDepth = 1, tree) => {
  console.log("*************************************************");
  // console.log("###");
  // console.log("tree: ", tree);
  // console.log("###");

  //добавить проверку является ли путь папкой

  maxDepth--;

  //выход из рекурсии
  if (maxDepth < 0) return;

  console.log("rootPath:", rootPath);

  const nodeName = basename(rootPath);
  console.log("nodeName: ", nodeName);
  // console.log("tree.nodeName", tree[nodeName]);

  const currentNode = (tree[nodeName] = {});
  console.log("currentNode: ", currentNode);

  let current = readdirSync(rootPath, { withFileTypes: true });
  console.log("current: ", current);

  //add last dirs names
  // if ((maxDepth = 1)) {
  // current.forEach((item) => {
  //   if (item.isFile()) {
  //     const newFile = (currentNode[item.name] = "file");
  //   }
  //   if (item.isDirectory()) {
  //     const newDir = (currentNode[item.name] = {});
  //   }
  // });
  // }

  // const innerFiles = [];
  // const innerDirs = [];
  // let current = readdirSync(rootPath, { withFileTypes: true });
  // console.log("current: ", current);

  // const nodeName = basename(rootPath);
  // console.log("nodeName: ", nodeName);

  // {...tree, }
  // tree={...tree, tree[nodeName]}
  // console.log("tree[nodeName]: ", tree[nodeName]);

  // const currentNode = (tree[nodeName] = {});
  // console.log("currentNode: ", currentNode);

  // tree[nodeName] = {};
  // console.log("tree[nodeName]: ", tree[nodeName]);

  // current.forEach((item) => {
  //   stat(join(rootPath, item.name), (err, stats) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //     console.log(stats);
  //   });
  // });

  current.forEach((item) => {
    if (item.isFile()) {
      // tree[item.name] = "file";
      // innerFiles.push(item.name);
      const newFile = (currentNode[item.name] = "file");
      // const newFile = (tree[nodeName][item.name] = "file");

      // tree = { ...tree, newFile };
    }
    if (item.isDirectory()) {
      // console.log(
      //   readdirSync(join(rootPath, item.name), { withFileTypes: true })
      // );
      // tree[item.name] = "directory";
      // innerDirs.push(item);
      // let newDir = (currentNode[item.name] = {});
      currentNode[item.name] = {};

      // tree = { ...tree, newDir };

      createDirTree(join(rootPath, item.name), maxDepth, currentNode);
    }
  });

  // for (let i = 0; i < current.length; i++) {
  //   stat(current[i], (err, stats) => {
  //     console.log(stats.isDirectory());
  //     console.log(stats);
  //   });
  // }

  // for (const item of Object.entries(tree)) {
  //   // console.log(item);

  //   if (item[1] == "directory") {
  //     console.log(item[0]);

  //     let dirPath = join(rootPath, item[0]);
  //     console.log(dirPath);

  //     // createDirTree(dirPath, maxDepth, tree);
  //   }
  // }
};

createDirTree("/home/developer/Projects", 2, tree);

console.log("======");
console.log("tree: ", tree);
