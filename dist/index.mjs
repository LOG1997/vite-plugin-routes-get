// src/index.ts
import path2 from "path";

// src/option.ts
import fs2 from "fs";
import path from "path";

// src/utils/node.ts
import fs from "fs";
function isFile(filepath) {
  const stat = fs.statSync(filepath);
  return stat.isFile();
}
function isDir(filepath) {
  const stat = fs.statSync(filepath);
  return stat.isDirectory();
}
function getFiles(filePath) {
  const file = fs.readdirSync(filePath, { encoding: "utf8", withFileTypes: true });
  return file;
}

// src/option.ts
var fileCount = 0;
var routes = [];
var getRoutesArr = (dirName, parentItem, currentPath, defaultFile = "index") => {
  parentItem ? parentItem : parentItem = dirName;
  const folderPath = path.resolve(`${currentPath}/${dirName}`);
  const routesArr = fs2.readdirSync(folderPath);
  routesArr.forEach((item) => {
    if (fs2.statSync(`${folderPath}/${item}`)) {
      if (item === "components")
        return;
      if (!/^[A-Z]/.test(item))
        return;
      const pathItem = parentItem.toLowerCase() + "/" + item.toLowerCase();
      routes.push({
        path: pathItem.substring(pathItem.indexOf("/")),
        name: item,
        componentPath: `../${parentItem}/${item}`,
        children: [],
        parent: dirName
      });
      const goParentItem = parentItem + "/" + item;
      return getRoutesArr(item, goParentItem, folderPath, defaultFile);
    } else {
      console.log("not folder");
    }
  });
  return routes;
};
var arrayToTree = (arr, parent) => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent === parent) {
      const children = arrayToTree(arr, item.name);
      if (children.length) {
        item.children = children;
      }
      tree.push(item);
    }
  });
  return tree;
};
var getRoutes = (dirName, parentItem, currentPath, defaultFile = "index") => {
  const adp = getRoutesArr(
    dirName,
    parentItem,
    currentPath,
    defaultFile
  );
  routes = [];
  return arrayToTree(adp, dirName);
};
var countFile = (dir) => {
  const filesArr = getFiles(dir);
  filesArr.forEach((item) => {
    if (isDir(dir + "\\" + item.name)) {
      countFile(dir + "\\" + item.name + "/");
    } else if (isFile(dir + "\\" + item.name) && item.name.includes(".tsx")) {
      fileCount++;
    } else {
      return;
    }
  });
  return fileCount;
};
var initFileCount = () => {
  fileCount = 0;
};

// src/index.ts
var __dirname = path2.resolve("src");
var fileCountPre = 0;
var routes2 = [];
function vitePluginRouteGet() {
  const virtualModuleId = "virtual:routes-get";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  return {
    name: "vite-plugin-route-get",
    // 指明它们仅在 'build' 或 'serve' 模式时调用
    // apply: 'serve', // apply 亦可以是一个函数
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        routes2 = [];
        routes2 = getRoutes("views", "", __dirname, "index");
        return `export const routeGet = ${JSON.stringify(routes2)}`;
      }
    },
    handleHotUpdate(ctx) {
      const { server } = ctx;
      const relationModule = [...server.moduleGraph.getModulesByFile("\0virtual:routes-get")][0];
      const fileCountNow = countFile(__dirname + "/views");
      if (fileCountNow !== fileCountPre) {
        fileCountPre = fileCountNow;
        server.ws.send({
          type: "update",
          updates: [
            {
              type: "js-update",
              path: relationModule.file,
              acceptedPath: relationModule.file,
              timestamp: (/* @__PURE__ */ new Date()).getTime()
            }
          ]
        });
        initFileCount();
        return [relationModule];
      }
      initFileCount();
      return [];
    }
  };
}
export {
  vitePluginRouteGet as default
};
