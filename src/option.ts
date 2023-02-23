import fs from "fs"
import path from "path"
// console.log("__dirnamepackage:", __dirname)
// const currentPath = path.resolve(__dirname, "..")
const routes: object[] = []
const getRoutesArr = (
    dirName: string,
    parentItem: string,
    currentPath: string,
    defaultFile = "index",
) => {
    parentItem ? parentItem : (parentItem = dirName)
    // 引入的文件夹
    const folderPath = path.resolve(`${currentPath}/${dirName}`)
    // 读取该文件夹内容
    const routesArr = fs.readdirSync(folderPath)
    // console.log('😅routesArr:', routesArr)
    routesArr.forEach((item: string) => {
        // 判断该路径是文件还是目录
        if (fs.statSync(`${folderPath}/${item}`)) {
            if (item === "components") return
            // 文件夹首字母未大写，不是页面，跳出
            if (!/^[A-Z]/.test(item)) return
            // 文件夹首字母大写，是页面，继续读取
            const pathItem = parentItem.toLowerCase() + "/" + item.toLowerCase()
            // console.log('😆pathItem:', pathItem)
            routes.push({
                path: pathItem.substring(pathItem.indexOf("/")),
                name: item,
                componentPath: `../${parentItem}/${item}`,
                children: [],
                parent: dirName,
            })
            const goParentItem = parentItem + "/" + item

            return getRoutesArr(item, goParentItem, folderPath, defaultFile)
        }
        else {
            console.log('not folder')
        }

    })
    return routes
}
// 将arr转变成树形结构
const arrayToTree = (arr: any[], parent: string) => {
    const tree: any[] = []
    arr.forEach((item) => {
        if (item.parent === parent) {
            const children = arrayToTree(arr, item.name)
            if (children.length) {
                item.children = children
            }
            tree.push(item)
        }
    })
    return tree
}
export const getRoutes = (
    dirName: string,
    parentItem: string,
    currentPath: string,
    defaultFile = "index",
) => {
    const adp = getRoutesArr(
        dirName,
        parentItem,
        currentPath,
        defaultFile,
    );
    return arrayToTree(adp, dirName)
}

// 写入文件


export const writeRouteFile = (path: string, routes: any[]) => {
    fs.writeFileSync(path, JSON.stringify(routes));
}
