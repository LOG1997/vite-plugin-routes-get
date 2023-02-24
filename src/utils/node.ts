import fs from 'fs'
// 判断是否是文件夹
/**
 * 
 * @param filepath 文件或者文件夹路径
 * @returns boolean 是文件夹则返回true，否则返回false
 */
export function isFile(filepath) {  //判断是否是文件 Boolean
    const stat = fs.statSync(filepath)
    return stat.isFile()
}
// 判断是否是文件
/**
 * 
 * @param filepath 文件或者文件夹路径
 * @returns 是文件则返回true，否则返回false
 */
export function isDir(filepath) {  //判断是否是文件夹 Boolean
    const stat = fs.statSync(filepath)
    return stat.isDirectory()
}
// 获取文件夹下的文件

export function getFiles(filePath) {
    const file = fs.readdirSync(filePath, { encoding: 'utf8', withFileTypes: true })
    return file
}