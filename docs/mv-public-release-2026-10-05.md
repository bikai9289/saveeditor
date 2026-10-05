# MV 公开页发布验证

日期：2026-10-05。

## 改动

- 新增 `/editor/rpg-maker-mv/`，title 为 `RPG Maker MV Save Editor - Free .rpgsave Editor Online`，主词 `rpgsave editor`。
- 格式配置集中到 `PUBLIC_RPG_MAKER_EDITORS`。MV 页面只接受 `.rpgsave`，MZ 只接受 `.rmmzsave`；旧版 Ruby Marshal、LCF、压缩包和可执行文件在页面及解析层均拒绝。
- 首页按扩展名通过浏览器存储分流到 MV/MZ。将首页脚本改为 Astro 构建的 JavaScript 模块，确保生产构建可执行。
- 保留首页 MZ 正文内链，新增 MV 内链与导航、页脚链接。首页 keywords 不加入 `rpgsave`。
- 同步上传提示、引擎标签、FAQ、About、LLM 文档和索引 URL 列表。
- 证据仅表述为“官方 MV 1.6.1 试用项目金币 1234 → 98765，并在游戏内加载确认”。不表述为第三方 MV 游戏验证；其余字段仍标为候选。
- 包含上一轮由真 MV 输入发现的 JsonEx 数组兼容性和辅助字段导出修复。

## 发布前检查

| 检查 | 结果 |
| --- | --- |
| MV 页面、canonical、title | 200；canonical 为公开 MV URL；title 包含连续的 rpgsave editor |
| Sitemap | 10 条 URL；包含 MV 和 MZ |
| MV 官方试用原档 | 实际编辑界面识别金币 1234，改为 98765，成功下载 zip |
| 导出完整性 | MV 解压 JSON 只有 party._gold 改变；zip 备份逐字节一致 |
| MZ 回归 | Haven 原档成功解析、编辑与导出；备份逐字节一致 |
| 首页接力 | MV/MZ 分别跳转匹配页面，读取浏览器内缓存的原文件 |
| 错误扩展名 | MV 拒绝 .rxdata 和 .rmmzsave；MZ 拒绝 .rpgsave |
| 异常输入 | 两页均拒绝空档、损坏档、超过 10MB 的文件 |
| 隐私与运行 | 上传/编辑过程没有发送保存内容的 POST；页面无 JavaScript 错误 |
| 自动检查 | npm test、MV/MZ 无修改与仅金币往返检查、git diff --check 通过 |

本地浏览器检查运行在 `wrangler dev --local` 的生产构建，结果保存至本机 `C:\Users\liqin\Desktop\savefile\MV-validation\release-local\results.json`，不提交私有存档或官方游戏资产。

## 线上发布

现有 `savefiletool` Cloudflare Worker 已部署。版本：`f03e066a-3c70-4360-8238-2182e4bd49da`。

| 线上核查 | 结果 |
| --- | --- |
| https://savefiletool.com/editor/rpg-maker-mv/ | 200；正确 title、canonical 和官方试用项目证据 |
| https://savefiletool.com/sitemap-0.xml | 10 条 URL，包含 MV |
| MV/MZ 实际存档 | 页面成功读取、金币改为 98765、下载编辑档与原档备份 |
| 首页内链与接力 | MZ 原正文内链仍在；新增 MV 链接；两种格式均分流正确 |
| 浏览器运行与隐私 | 无页面 JavaScript 错误，无保存内容 POST |

线上发布检查记录在本机 `release-live\results.json`。MV 项目原始生成与游戏内读档证据见 [试用项目报告](mv-trial-validation-2026-10-05.md)。
