# 关于开发

> 本文档是为了帮助开发者更好的了解本项目开发思路和开发流程。
## 项目结构
```ts
--dist //打包后的文件
|
--example //存放示例
|
--src //开发目录
|
|--index.ts // 入口文件
|--option.ts // 一些函数
|--utils //工具函数文件夹
```

## index.ts主函数
这份文件是实现vite热更新的主要部分，调用vite的钩子函数，编译过程中的数据与项目文件进行交互，并实现热更新。

现就主要思想进行叙述：

调用函数，传入项目目录，从项目目录下的页面文件夹即views或者pages文件夹中读取页面文件，将文件夹名大写且该文件下的文件为index.tsx才生成路由。
```typescript
//__diername为项目文件夹的绝对路径
routes = [];
routes = getRoutes('views', '', __dirname, 'index')
```



## option.ts生成路由的函数
定义了一个函数可根据传入的文件夹，生成路由，该函数会递归调用自身，直到文件夹下没有文件夹为止。由于vite打包过程中产生的数据与项目进行交互传递的是字符串类型，所以在生成路由时，需要将路由转换为字符串，而不能传递函数类型，所以路由中的component字段填充为`componentPath`，在路由文件中使用时再对其进行转换。
```typescript
// route字段举例
{
path: '/home',
name: 'Home',
componentPath: `../Home`,
children: [],
parent: 'views'
}
```