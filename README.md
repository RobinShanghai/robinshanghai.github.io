# My Life Lab｜人生实验室

这是一个面向零基础学习者的**纯静态个人网站**。网站文件不包含私人记录。

## 1. 这四个文件分别做什么？

- `index.html`：内容和网页结构（HTML）
- `style.css`：排版、字体、颜色和移动端适配（CSS）
- `script.js`：深色模式、日志筛选等交互（JavaScript）
- `.nojekyll`：告诉 GitHub Pages 不必用 Jekyll 处理这些文件

## 2. 不装软件，先把网站上传到 GitHub

1. 登录 GitHub，确认你的用户名，例如 `exampleuser`。
2. 新建公开仓库，名称必须是 **`exampleuser.github.io`**，其中 `exampleuser` 换成你的真实用户名。
3. 在仓库 Code 标签页，点击 **Add file → Upload files**。
4. 将**本文件夹内** `index.html`、`style.css`、`script.js`、`.nojekyll` 和 `README.md` 上传；不是把 zip 压缩包直接上传到仓库。
5. 点击底部 **Commit changes**，相当于保存一次代码版本。
6. 打开 **Settings → Pages → Build and deployment → Source: Deploy from a branch**，选择 **Branch: main、Folder: /(root)**，点击 Save。
7. 打开 `https://exampleuser.github.io`；首次部署可能需要几分钟。

详细官方文档：https://docs.github.com/en/pages/quickstart

> 一定要在上传前审核公开仓库中的文字、照片和文件：GitHub Pages 的网站是公开可访问的。

## 3. 第一次练习：自己改一句话

进入 GitHub 仓库，点击 `index.html` → 铅笔图标（Edit），找到：

```html
<h1 id="heroTitle">把人生，<br /><em>慢慢写成作品。</em></h1>
```

改成喜欢的话，点击 **Commit changes**；刷新网站即可看到变化（部署有延迟）。

## 4. 第一次练习：修改颜色

编辑 `style.css`，找到：

```css
--accent: #465d49;
```

`#465d49` 是颜色的十六进制编码。改成 `#4b5e91`，页面按钮和装饰色就会变蓝。

## 5. 第一次练习：理解 JavaScript

网站有深色模式按钮。其行为写在 `script.js`：

```js
themeButton.addEventListener('click', () => { ... });
```

意思是“当按钮被点击，就执行其中的代码”。

## 6. 追加公开日志

打开 `index.html`，找到 `journal-grid`。复制任意一个 `<article class="journal-card" ...>` 到其 `</article>`，修改标题、简介、分类。**新增内容会被公开发布，务必检查隐私。**

## 7. 不要放什么？

- 密码、API Key、银行账号、住址、证件、病历等私人信息。
- 私人日记和私人仓库的文件。
- 不确定是否有版权的图片或他人作品。

私密记录请使用另一个 Private 仓库；高敏感内容更适合离线加密笔记，不推荐放 GitHub。

## 8. 下一阶段

- 学习 GitHub Desktop，在 Mac 上本地改代码、提交、上传。
- 把日志从页面里独立出来，支持更多文章。
- 再开发真正安全的私人网页登录系统（需要后端和认证服务）。
