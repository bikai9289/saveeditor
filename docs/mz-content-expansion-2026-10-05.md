# MZ 正文扩写与发布验证

日期：2026-10-05。

新增独立的 `RpgMakerMzGuide.astro`，只在 MZ 页面渲染。覆盖 .rmmzsave editor 用途、桌面目录与手动存档选择、浏览器存储、备份和恢复、真实游戏读档案例、MZ/MV 格式差异、插件兼容、隐私、10 MB 限制和 5 条 MZ 专属 FAQ。文字重新撰写，未复制 MV 指南。

## 证据核对

- 游戏包标题和 System.json 均为 **Haven: Secret of Caledria**，currencyUnit 为 **Gems**。
- 本机保存的 `haven-restarted.png` 显示重启后的游戏菜单：**Gems 999,999**，地点 **Olund Fort**。Olund Fort 是地点，不是游戏名。
- 本机原始 `file1.before-editor.rmmzsave` 与已有 `file1.rmmzsave` 分别记录 party._gold 为 0、999999。历史编辑档还含有一个额外顶层 items 辅助字段，故不据此宣称历史编辑档逐字段或逐字节完全不变。
- 当前导出实现已在前一轮修复辅助字段清理；本轮再次使用 Haven 原始档和已有编辑档分别跑无修改、仅金币导出回归，全部通过。正文区分解码数据保留与原档备份逐字节一致。
- 未将私有存档、完整游戏数据或截图上传至公开站点或仓库。

## 本地生产构建与线上检查

| 检查 | 结果 |
| --- | --- |
| 正文词数 | 1639；按 main.innerText 空白分词，不含导航和页脚 |
| MZ 页面状态 | 200 |
| TDK、H1、canonical、JSON-LD | 与部署前线上快照完全一致 |
| 视口 | 1280px 桌面、390px 手机；无横向溢出 |
| 真实存档读取 | 两种视口均成功解析 Haven，金币 999999 |
| MZ FAQ | 5 条，独立于 MV |
| Start Editing | 桌面、移动目标仍指向 MZ |
| MV 正文 | 与部署前快照一致；未渲染 MZ 指南 |
| Sitemap | 仍为 10 条 URL |
| 检查命令 | npm test、verify-rpgmaker-roundtrip、git diff --check 通过 |
| 页面错误 | 无 JavaScript 错误 |

Cloudflare Worker 部署版本：`bef84307-b648-46b7-9759-7afb3caa9619`。

本机浏览器检查结果和截图保存在 `C:\Users\liqin\Desktop\savefile\MV-validation\mz-content-local` 和 `mz-content-live`，元信息快照为同级 `mz-content-baseline.json`。

本次未使用用户此前的第三方页面体检服务，不报告新的百分制评分。可确认原正文过短的问题已通过线上 1639 词检查消除；第三方评分须用相同服务另行复测。
