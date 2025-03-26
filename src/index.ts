import { Context, Schema, h } from 'koishi'
import { } from '@koishijs/plugin-http'
import fs from 'fs'
import path from 'path'

export const name = 'jmcomic-pdf'

export interface Config {
  apiUrl: string
  timeout: number
}

export const Config: Schema<Config> = Schema.object({
  apiUrl: Schema.string().default('http://localhost:3502/download').description('后端 API 地址'),
  timeout: Schema.number().default(30000).description('请求超时时间（毫秒）'),
})

export function apply(ctx: Context, config: Config) {

  ctx.on('ready', () => {
    ctx.logger('jmcomic-pdf').info('插件已加载')
  })

  ctx.command('jm <id>', '下载并发送指定 ID 的本子 PDF')
    .action(async ({ session }, id) => {
      if (!id) return '请输入本子 ID。'

      try {
        // 发送请求到后端 API
        const response = await ctx.http.post(config.apiUrl, { id }, { timeout: config.timeout })

        if (response.error) {
          return `请求失败：${response.error}`
        }

        const { download_url, pdf_path } = response

        // 创建临时目录
        const tempDir = path.join(__dirname, 'temp')
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true })
        }

        // 下载 PDF 文件
        const pdfFileName = `${id}.pdf`
        const pdfFilePath = path.join(tempDir, pdfFileName)
        const pdfResponse = await ctx.http.get(download_url, { responseType: 'arraybuffer', timeout: config.timeout })

        // 将 ArrayBuffer 转换为 Buffer
        const pdfBuffer = Buffer.from(pdfResponse)

        // 保存 PDF 文件
        fs.writeFileSync(pdfFilePath, pdfBuffer)

        // 将 PDF 文件发送给用户
        if (!session) return '该命令需要在会话上下文中使用'
        await session.send(h('file', { type: 'file', url: `file://${pdfFilePath}`, name: pdfFileName }))

        // // 删除 PDF 文件
        // fs.unlinkSync(pdfFilePath)

        return 'PDF 文件已发送。'
      } catch (error) {
        const message = error instanceof Error ? error.message : '未知错误'
        return `处理失败：${message}`
      }
    })
}