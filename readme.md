# koishi-plugin-jmcomic-pdf

[![npm](https://img.shields.io/npm/v/koishi-plugin-jmcomic-pdf?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-jmcomic-pdf)


本项目包含两个核心部分：
1. **jm_img-to-pdf**：一个后端服务，用于从 JMComic 下载图片并生成 PDF 文件。
2. **koishi-plugin-jmcomic-pdf**：一个基于 Koishi 框架的插件，用于通过与 `jm_img-to-pdf` 服务交互，获取并发送 JMComic 的 PDF 文件给用户。

### 您当前正在浏览：koishi-plugin-jmcomic-pdf
点此前往 [jm_img-to-pdf](https://github.com/WaveYo/jm_img-to-pdf)


### 项目概述
`koishi-plugin-jmcomic-pdf` 是一个 Koishi 插件，用于通过 `jm_img-to-pdf` 服务获取 JMComic 的 PDF 文件并发送给用户。

### 项目结构
```
jmcomic-pdf     
├─ src          
│  ├─ temp      
│  └─ index.ts  
├─ package.json 
├─ readme.md    
└─ tsconfig.json
```

### 关键文件
- **`index.ts`**：插件核心代码，定义了命令和与 `jm_img-to-pdf` 服务的交互逻辑。
- **`package.json`**：插件元数据，包括依赖项和 Koishi 配置。

### 插件配置
通过 `Config` 对象可以自定义以下选项：
```typescript
export const Config: Schema<Config> = Schema.object({
  apiUrl: Schema.string().default('http://localhost:3502/download').description('后端 API 地址'),
  timeout: Schema.number().default(30000).description('请求超时时间（毫秒）'),
})
```
- `apiUrl`：指定 `jm_img-to-pdf` 服务的 API 地址（默认 `http://localhost:3502/download`）。
- `timeout`：设置请求超时时间（默认 `30000` 毫秒）。

### 插件功能
- 注册命令 `jm <id>`，用于下载并发送指定 ID 的 JMComic PDF 文件。
- 通过 `ctx.http.post` 向后端 API 发送请求，获取 PDF 文件的下载地址。
- 下载 PDF 文件并发送给用户。

### 运行方式
1. 确保 `jm_img-to-pdf` 服务已启动并正常运行。
2. 安装 Koishi 框架和插件依赖：
   ```bash
   npm install koishi-plugin-jmcomic-pdf
   ```
3. 在 Koishi 项目中启用插件：
   ```typescript
   import { App } from 'koishi'
   import jmcomicPdf from 'koishi-plugin-jmcomic-pdf'

   const app = new App()
   app.plugin(jmcomicPdf)
   app.start()
   ```

---

## 3. 项目关联关系

### 功能流程
1. 用户在 Koishi 聊天机器人中发送命令 `jm <id>`。
2. `koishi-plugin-jmcomic-pdf` 插件将 ID 发送到 `jm_img-to-pdf` 服务的 `/download` API。
3. `jm_img-to-pdf` 服务下载指定 ID 的 JMComic 图片并生成 PDF 文件。
4. `jm_img-to-pdf` 服务返回 PDF 文件的下载链接。
5. `koishi-plugin-jmcomic-pdf` 插件下载 PDF 文件并发送给用户。

### 配置关系
- `koishi-plugin-jmcomic-pdf` 的 `apiUrl` 必须与 `jm_img-to-pdf` 的 `web_config.yml` 中的 `server.host` 和 `server.port` 一致。
- 如果 `jm_img-to-pdf` 服务的域名或端口发生更改，需要同步修改 `koishi-plugin-jmcomic-pdf` 的 `apiUrl`。

---

## 4. 配置修改示例

### 修改 `jm_img-to-pdf` 配置
1. 修改 `web_config.yml` 中的 `port`：
   ```yaml
   server:
     port: 8080
   ```
2. 修改 `config.yml` 中的图片保存路径：
   ```yaml
   dir_rule:
     base_dir: /var/www/jmcomic/img/
   ```

### 修改 `koishi-plugin-jmcomic-pdf` 配置
1. 修改 `apiUrl` 以匹配 `jm_img-to-pdf` 的新配置：
   ```typescript
   apiUrl: 'http://localhost:8080/download'
   ```

---

## 5. 注意事项
1. 确保 `jm_img-to-pdf` 服务正常运行，且防火墙允许相关端口访问。
2. 如果 `jm_img-to-pdf` 服务部署在远程服务器上，需修改 `apiUrl` 为远程地址（如 `http://your-server-ip:3502/download`）。
3. 根据需要调整 `jm_img-to-pdf` 的线程数和缓存设置以优化性能。

---

通过以上配置和说明，您可以轻松使用 `koishi-plugin-jmcomic-pdf` 和 `jm_img-to-pdf` 下载并发送 JMComic 的 PDF 文件。