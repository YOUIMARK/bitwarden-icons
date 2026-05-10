# Bitwarden Icon Proxy

Bitwarden 默认通过 `icons.bitwarden.net` 获取保险库条目的网站图标，但官方图标服务器依赖直接抓取各网站的 favicon，经常出现图标缺失、加载失败的问题。

本项目利用 Cloudflare 将 Bitwarden 客户端的图标请求代理到 [logo.dev](https://www.logo.dev)，logo.dev 拥有数千万个品牌 Logo 的数据库，图标质量和覆盖率优于官方方案。

## 方案一：Cloudflare 重定向规则（推荐）

Cloudflare 原生支持的[单次重定向](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/)功能配合通配符模式，以更高效的方式达成相同效果。这样既不会消耗每日免费 Worker 配额，执行速度也远快于 Worker 中的 JavaScript 代码。

### 前置条件

- 一个 [Cloudflare](https://cloudflare.com) 账号，并托管一个域名
- 一个 [logo.dev](https://www.logo.dev) 账号和 API Token

### 步骤

1. 在 Cloudflare DNS 中为你的图标子域名添加一条 A 记录：

   | 类型 | 名称 | 内容 | 代理状态 |
   |------|------|------|------|
   | A | `icons` | `7.7.7.7` | 已代理（橙色云）|

   > IP 填 `7.7.7.7` 即可，请求会在到达源站前被规则拦截，不会真正访问该 IP。代理状态必须为橙色云。

2. 进入 Cloudflare Dashboard → 你的域名 → **Rules → Redirect Rules → Create rule**，选择**通配符模式**，填入：

   | 字段 | 值 |
   |------|------|
   | 请求 URL | `https://icons.你的域名/*/icon.png` |
   | 目标 URL | `https://img.logo.dev/${1}?token=你的Token&retina=true` |
   | 状态代码 | `302` |
   | 保留查询字符串 | 关闭 |

3. 点击**部署**。

4. 在 Bitwarden 客户端的图标服务器设置中填入：
   - 例如: `https://icons.你的域名`

---

## 方案二：Cloudflare Workers / Pages

如果你没有自己的域名，可以使用 Cloudflare Workers 或 Pages 实现相同效果。`_worker.js` 同时兼容两种部署方式。

> **注意**：`*.workers.dev` 在中国大陆无法访问，中国大陆用户，可使用 Pages 部署（`*.pages.dev` 可正常访问）。

### 前置条件

- 一个 [Cloudflare](https://cloudflare.com) 账号
- 一个 [logo.dev](https://www.logo.dev) 账号和 API Token

### Workers 部署

1. 登录 Cloudflare Dashboard，进入 **Workers & Pages**，点击 **Create** 新建一个 Worker

2. 将 `_worker.js` 的内容粘贴到编辑器中，保存并部署

3. 进入 Worker 的 **Settings → Variables**，添加环境变量：
   - 变量名：`LOGO_DEV_TOKEN`
   - 值：你的 logo.dev API Token

4. 在 Bitwarden 客户端的图标服务器设置中填入：
   - 例如: `https://你的worker名.workers.dev`

### Pages 部署

1. 将本仓库 Fork 到你的 GitHub 账号

2. 登录 Cloudflare Dashboard，进入 **Workers & Pages**，点击 **Create** → **Pages** → **Connect to Git**，选择 Fork 后的仓库，构建设置全部留空

3. 部署完成后，进入 Pages 的 **Settings → Environment variables**，添加环境变量：
   - 变量名：`LOGO_DEV_TOKEN`
   - 值：你的 logo.dev API Token

   > **注意**：Pages 的环境变量不会立即生效，需要重新触发一次部署才能生效。进入 **Deployments**，点击最新部署右侧的 **...** → **Retry deployment** 即可。

4. 在 Bitwarden 客户端的图标服务器设置中填入：
   - 例如: `https://你的pages名.pages.dev`

## 许可证

MIT
