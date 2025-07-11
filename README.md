# Common Tools (common-tools)

VS Code 扩展，提供常用开发工具命令。

## 功能列表

### JSON 工具
- **格式化** (`common-tools.json.format`)
- **压缩** (`common-tools.json.minify`)
- **去转义** (`common-tools.json.unescape`)
- **去转义后格式化** (`common-tools.json.unescape-format`)
- **深度去转义** (`common-tools.json.deep-unescape`)
- **深度去转义后格式化** (`common-tools.json.deep-unescape-format`)

### 时间工具
- **时间戳转格式化时间** (`common-tools.time.format-timestamp`)
  - 支持 10 位/13 位时间戳，自动识别，输出如 `2025-07-11 10:59:14` 或 `2025-07-11 10:59:14.123`
- **获取当前时间戳** (`common-tools.time.now-timestamp`)
  - 可插入或复制当前时间戳

### 字符串格式转换工具
- **小写** (`common-tools.string.lower-case`)
- **大写** (`common-tools.string.upper-case`)
- **camelCase** (`common-tools.string.camel-case`)
- **snake_case** (`common-tools.string.snake-case`)
- **SCREAMING_SNAKE_CASE** (`common-tools.string.screaming-snake-case`)
- **kebab-case** (`common-tools.string.kebab-case`)
- **PascalCase** (`common-tools.string.pascal-case`)
- **Capitalized_Snake_Case** (`common-tools.string.capitalized-snake-case`)
- **空格分隔** (`common-tools.string.space-separated`)
- **点分隔** (`common-tools.string.dot-case`)

## 菜单与用法
1. 选中需要处理的内容，或不选中则处理全文。
2. 右键选择“Common Tools”菜单，按分组选择对应功能。
3. 或按 `Cmd+Shift+P`（Mac）/`Ctrl+Shift+P`（Windows）打开命令面板，输入命令名（如“lower case”或“时间戳”）并回车。

## 贡献
欢迎提交 issue 或 PR。

---

Email: wyl19940929@163.com