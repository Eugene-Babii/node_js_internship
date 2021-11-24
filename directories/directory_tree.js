import { readdirSync, stat } from "fs";
import { join, basename } from "path";

const folders_tree = new Object();

const createDirTree = (rootPath, maxDepth, tree) => {
  //добавить проверку является ли путь папкой...

  //получить имя папки или файла
  const nodeName = basename(rootPath);

  //создать в дереве новый узел с именем
  const currentNode = (tree[nodeName] = {});

  //выйти из рекурсии когда уровни закончились
  if (maxDepth == 0) return;

  //сканировать структуру папки
  let innerStructure = readdirSync(rootPath, { withFileTypes: true });

  //перебрать все элементы в отсканированной папке
  innerStructure.forEach((item) => {
    //если элемент является файлом, добавить ему маркер "file"
    if (item.isFile()) {
      currentNode[item.name] = "file";
    }
    //если элемент является папкой добавить к результату вложенный объект с именем папки
    if (item.isDirectory()) {
      const dir = item.name;
      currentNode[dir] = {};

      //создать показатель глубины для каждой итерации
      let _maxDepth = maxDepth;
      _maxDepth--;

      //вызвать функцию для подуровня
      createDirTree(join(rootPath, item.name), _maxDepth, currentNode);
    }
  });
};

createDirTree("/home/developer/Projects", 2, folders_tree);

// вывести результат в консоль
console.log(JSON.stringify(folders_tree, null, 4));
