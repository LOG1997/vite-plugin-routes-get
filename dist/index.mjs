// src/index.ts
import path2 from "path";

// src/option.ts
import fs from "fs";
import path from "path";
var routes = [];
var getRoutesArr = (dirName, parentItem, currentPath, defaultFile = "index") => {
  parentItem ? parentItem : parentItem = dirName;
  const folderPath = path.resolve(`${currentPath}/${dirName}`);
  const routesArr = fs.readdirSync(folderPath);
  routesArr.forEach((item) => {
    if (fs.statSync(`${folderPath}/${item}`)) {
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
  fs.writeFileSync(path3, JSON.stringify(routes2));
};

// src/index.ts
var __dirname = path2.resolve();
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
      const currentPath = path2.resolve(__dirname, "./src");
      const routerPath = path2.resolve(__dirname, "./src/router/routes_config.txt");
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
export {
  vitePluginRouteGet as default
};
