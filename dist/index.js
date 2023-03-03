"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => vitePluginRouteGet
});
module.exports = __toCommonJS(src_exports);
var import_path2 = __toESM(require("path"));

// src/option.ts
var import_fs2 = __toESM(require("fs"));
var import_path = __toESM(require("path"));

// src/utils/node.ts
var import_fs = __toESM(require("fs"));
function isFile(filepath) {
  const stat = import_fs.default.statSync(filepath);
  return stat.isFile();
}
function isDir(filepath) {
  const stat = import_fs.default.statSync(filepath);
  return stat.isDirectory();
}
function getFiles(filePath) {
  const file = import_fs.default.readdirSync(filePath, { encoding: "utf8", withFileTypes: true });
  return file;
}

// src/option.ts
var fileCount = 0;
var routes = [];
var getRoutesArr = (dirName, parentItem, currentPath, defaultFile = "index", objectType) => {
  parentItem ? parentItem : parentItem = dirName;
  const folderPath = import_path.default.resolve(`${currentPath}/${dirName}`);
  const routesArr = import_fs2.default.readdirSync(folderPath);
  routesArr.forEach((item) => {
    if (import_fs2.default.statSync(`${folderPath}/${item}`)) {
      if (item === "components")
        return;
      if (!/^[A-Z]/.test(item))
        return;
      const pathItem = parentItem.toLowerCase() + "/" + item.toLowerCase();
      routes.push({
        path: pathItem.substring(pathItem.indexOf("/")),
        name: item,
        componentPath: `/src/${parentItem}/${item}/${objectType == "vue" ? defaultFile + ".vue" : ""}`,
        children: [],
        parent: dirName
      });
      const goParentItem = parentItem + "/" + item;
      return getRoutesArr(item, goParentItem, folderPath, defaultFile, objectType);
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
var getRoutes = (dirName, parentItem, currentPath, defaultFile = "index", objectType) => {
  const adp = getRoutesArr(
    dirName,
    parentItem,
    currentPath,
    defaultFile,
    objectType
  );
  routes = [];
  return arrayToTree(adp, dirName);
};
var countFile = (dir) => {
  const filesArr = getFiles(dir);
  filesArr.forEach((item) => {
    if (isDir(dir + "\\" + item.name)) {
      countFile(dir + "\\" + item.name + "/");
    } else if (isFile(dir + "\\" + item.name) && (item.name.includes(".tsx") || item.name.includes(".vue"))) {
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
var __dirname = import_path2.default.resolve("src");
var fileCountPre = 0;
var routes2 = [];
var defaultOptions = {
  dirname: "views",
  defaultFile: "index",
  type: ""
};
function vitePluginRouteGet(userOptions = defaultOptions) {
  const virtualModuleId = "virtual:routes-get";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  return {
    name: "vite-plugin-route-get",
    // 指明它们仅在 'build' 或 'serve' 模式时调用
    // apply: 'serve', // apply 亦可以是一个函数
    resolveId(id) {
      if (userOptions.type == "") {
        throw Error("\u8BF7\u4F20\u5165\u9879\u76EE\u7C7B\u578Bvue\u6216\u8005react");
      }
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      const { dirname, defaultFile, type } = userOptions;
      if (!type || type != "vue" && type != "react") {
        throw Error("\u8BF7\u8F93\u5165\u9879\u76EE\u7C7B\u578Bvue\u6216\u8005react\uFF0C\u683C\u5F0F\u5982 plugins: [react(), vitePluginRouteGet({type: 'vue'})]");
      } else if (id === resolvedVirtualModuleId) {
        routes2 = [];
        routes2 = getRoutes(dirname, "", __dirname, defaultFile, type);
        return `export const routeGet = ${JSON.stringify(routes2)}`;
      }
    },
    handleHotUpdate(ctx) {
      const { server } = ctx;
      const relationModule = [...server.moduleGraph.getModulesByFile("\0virtual:routes-get")][0];
      const fileCountNow = countFile(__dirname + "/" + userOptions.dirname);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
