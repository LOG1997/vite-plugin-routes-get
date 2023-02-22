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
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var routes = [];
var getRoutesArr = (dirName, parentItem, currentPath, defaultFile = "index") => {
  parentItem ? parentItem : parentItem = dirName;
  const folderPath = import_path.default.resolve(`${currentPath}/${dirName}`);
  const routesArr = import_fs.default.readdirSync(folderPath);
  routesArr.forEach((item) => {
    if (import_fs.default.statSync(`${folderPath}/${item}`)) {
      if (item === "components")
        return;
      if (!/^[A-Z]/.test(item))
        return;
      const pathItem = parentItem.toLowerCase() + "/" + item.toLowerCase();
      routes.push({
        path: pathItem.substring(pathItem.indexOf("/")),
        name: item,
        component: `() => import(@/${parentItem}/${item}/${defaultFile}.tsx)`,
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
  return arrayToTree(adp, dirName);
};
var writeRouteFile = (path3, routes2) => {
  import_fs.default.writeFileSync(path3, JSON.stringify(routes2));
};

// src/index.ts
var __dirname = import_path2.default.resolve();
function vitePluginRouteGet() {
  return {
    // 插件名称
    name: "vite-plugin-routes-get",
    // pre 会较于 post 先执行
    enforce: "pre",
    // post
    // 指明它们仅在 'build' 或 'serve' 模式时调用
    apply: "build",
    // apply 亦可以是一个函数
    config(config, { command }) {
      console.log("\u8FD9\u91CC\u662Fconfig\u94A9\u5B50");
    },
    // 5. 构建阶段的通用钩子：在服务器启动时被调用：每次开始构建时调用
    buildStart(options) {
      console.log("\u{1F615}options:", __dirname);
      const currentPath = import_path2.default.resolve(__dirname, "./src");
      const routerPath = import_path2.default.resolve(__dirname, "./src/router/routes_config.txt");
      let routesRes = [];
      routesRes = getRoutes("views", "", currentPath, "index");
      writeRouteFile(routerPath, routesRes);
      console.log("\u{1F60B}routesRes:", routesRes);
    },
    configResolved(resolvedConfig) {
      console.log("\u8FD9\u91CC\u662FconfigResolved\u94A9\u5B50");
    },
    configureServer(server) {
      console.log("\u8FD9\u91CC\u662FconfigureServer\u94A9\u5B50");
    },
    transformIndexHtml(html) {
      console.log("\u8FD9\u91CC\u662FtransformIndexHtml\u94A9\u5B50");
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
