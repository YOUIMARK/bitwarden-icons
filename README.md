# Bitwarden Icon Proxy

Bitwarden 默认通过 `icons.bitwarden.net` 获取保险库条目的网站图标，但官方图标服务器依赖直接抓取各网站的 favicon，经常出现图标缺失、加载失败的问题。

本项目是一个 Cloudflare Worker，将 Bitwarden 客户端的图标请求代理到 [logo.dev](https://www.logo.dev)，logo.dev 拥有数千万个品牌 Logo 的数据库，图标质量和覆盖率远优于官方方案。

## 工作原理

Bitwarden 客户端请求图标时，会向图标服务器发送如下格式的请求：

```
GET /{domain}/icon.png
```

Worker 收到请求后，提取域名，转发至 logo.dev API，再将图片返回给客户端。

## 部署

### 前置条件

- 一个 [Cloudflare](https://cloudflare.com) 账号
- 一个 [logo.dev](https://www.logo.dev) 账号和 API Token

### 步骤

1. 登录 Cloudflare Dashboard，进入 **Workers & Pages**，点击 **Create** 新建一个 Worker

2. 将 `worker.js` 的内容粘贴到编辑器中，保存并部署

3. 进入 Worker 的 **Settings → Variables**，添加环境变量：
   - 变量名：`LOGO_DEV_TOKEN`
   - 值：你的 logo.dev API Token

4. 在 Bitwarden 客户端的图标服务器设置中填入你的 Worker 地址：
   - 登录时在自定义环境中图标服务器URL填写 **Icons** 地址

## 许可证

MIT
