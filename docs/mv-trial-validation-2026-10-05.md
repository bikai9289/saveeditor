# MV 官方试用项目存档验证

日期：2026-10-05。样本为 RPG Maker MV 1.6.1 官方试用安装包自带 `NewData` 模板，独立运行在官方 Windows NW.js 测试运行时中。未经过 MV 编辑器的交互式新建/测试按钮，而是复制官方新项目模板，通过游戏自身的 `DataManager.saveGame(1)` 生成磁盘存档。

## 样本与结果

本机目录：`C:\Users\liqin\Desktop\savefile\MV-validation`。

| 项目 | 结果 |
| --- | --- |
| 原档 | `original\file1.rpgsave`，7076 字节，金币 1234 |
| 本地编辑器 | 临时本地入口复用 `RpgMakerEditorShell`，金币改为 98765，下载编辑文件与原档备份 zip |
| 导出包 | `file1.rpgsave.edited-with-backup.zip` |
| 编辑档 | `export\file1.rpgsave`；亦放在 `project\save\file1.rpgsave` |
| 游戏读档 | 官方 MV 1.6.1 `DataManager.loadGame(1)` 返回 true；恢复地图后进入游戏菜单，显示 98765 G |
| 对照值 | 变量 1 = 42，开关 1 = true，物品 1 = 3，角色 1 等级 = 1，实例类型恢复为 `Game_Actor` |
| 结构完整性 | 解压后的 JSON 只有 `party._gold` 改变；JsonEx `@a`、`@c`、构造器与引用标记保持 |
| 备份完整性 | zip 内原档备份与输入原档逐字节一致 |
| 截图 | `editor-gold-98765.png`、`game-loaded-98765.png` |

## 问题与修复

首次真实 MV 输入未通过：编辑界面报 `actors._data.filter is not a function`。MV JsonEx 将数组编码为带 `@a` 的对象；原界面只处理普通数组。

修复角色数组显示与编辑路径，保留 `@a` 包装及参数数组元数据；遍历时保留原始数组下标，避免过滤空槽后写到错误角色。导出同时移除源文件中不存在的编辑器辅助字段，保留原档中实际存在的同名字段。

修复后完成本地编辑器导出及游戏读档。自动校验命令：

```powershell
npx tsx scripts/verify-rpgmaker-roundtrip.ts "C:\Users\liqin\Desktop\savefile\MV-validation\original\file1.rpgsave" "C:\Users\liqin\Desktop\savefile\Haven\save\file1.rmmzsave"
npm run verify:safety
npm run build
```

以上均通过：MV 与已有 Haven MZ 样本的无修改导出、仅金币修改导出，以及原生顶层字段与 JsonEx 元数据保留测试。MZ 页面继续拒绝 `.rpgsave`。临时 MV 页面和组件已删除。

证据口径：**MV 官方试用项目金币往返验证通过**。这不构成第三方真实 MV 游戏或插件兼容性验证，不升级公共页面的支持承诺。
