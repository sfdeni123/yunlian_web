windows 安装node
官网直接安装下载node：https://nodejs.org/zh-cn/download windows安装包直接下载解压安装；

1. 新建一个json-server目录, cd /json-server

2. 打开编辑器，快捷键（Ctrl + ~） 唤起vscode自带终端，输入npm init自动创建package.json（项目依赖管理）

3. 继续在终端输入 npm install json-server -D 安装json-server

4. 新建db.json文件，json文件内容。

{
    对象1，
    对象2，
}

5. 配置package.json

"start": "json-server --watch db.json"
--watch：只要db.json有改动，自动重启当前服务。


6. 终端运行npm start

7. 这是可以在postman里调用http://localhost:3000/users