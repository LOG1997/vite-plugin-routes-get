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
  return arrayToTree(adp, dirName);
};

// src/index.ts
var __dirname = path2.resolve("src");
console.log("\u{1F601}__dirname:", __dirname);
function vitePluginRouteGet() {
  const virtualModuleId = "virtual:routes-get";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  return {
    name: "vite-plugin-route-get",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const routes2 = getRoutes("views", "", __dirname, "index");
        return `export const routeGet = ${JSON.stringify(routes2)}`;
      }
    }
  };
}
export {
  vitePluginRouteGet as default
};
