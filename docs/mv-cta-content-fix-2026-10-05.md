# MV 按钮与正文修复

日期：2026-10-05。

问题：共享页头的 Start Editing 写死指向 MZ。MV 访问者点击后会进入不接受 `.rpgsave` 的页面。页头现在按当前编辑器路径选择目标；桌面按钮和新增的移动菜单 Start Editing 使用相同目标。首页默认目标仍为 MZ。

新增独立的 `RpgMakerMvGuide.astro`，仅在 MV 页渲染。内容覆盖 .rpgsave editor 的用途、桌面存档位置、浏览器存储区别、金币修改及恢复步骤、官方试用项目证据、MV/MZ 格式差异、插件兼容、隐私与大小限制，以及 MV 专属 FAQ。压缩格式说明已与本机官方 MV 1.6.1 和现有 MZ 游戏运行时代码核对。

H1、title、keywords、canonical 保持原值；正文增加 `What is an .rpgsave editor?` H2。正文词数按文件选择界面加载后 `main.innerText` 的空白分词统计为 **1598**，不计导航和页脚。

| 本地生产构建与线上检查 | 结果 |
| --- | --- |
| MV 页面状态 | 200 |
| 桌面 1280px 的 Start Editing | 点击后仍在 `/editor/rpg-maker-mv/` |
| 手机 390px 的 Start Editing | 打开移动菜单后点击，同样进入 MV |
| 点击按钮后的实际输入 | 官方 MV 原档解析成功，金币显示 1234 |
| 首页、MZ 页按钮 | 桌面与移动目标均为 MZ |
| 正文长度 | 两个视口均为 1598 词 |
| 内容隔离 | MV 指南仅出现在 MV 页面 |
| 元信息 | 原 H1、包含 rpgsave editor 的 title、指向自身的 canonical 正确 |
| 页面运行 | 无 JavaScript 错误；两种视口无横向溢出 |
| 构建与格式回归 | npm test、git diff --check 通过 |

已部署到既有 `savefiletool` Cloudflare Worker，版本 `7b021915-a328-46cd-a56e-86efe1f54c03`，并完成上述线上点击与实际文件读取检查。

本机证据：`C:\Users\liqin\Desktop\savefile\MV-validation\content-local\results.json` 和 `content-live\results.json`，同目录保留桌面、移动截图。私有存档和官方项目资产未提交到仓库。
