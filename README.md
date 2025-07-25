# Common Tools (common-tools)

A VS Code e### UUID Tools
- **Generate UUID v4** (`common-tools.uuid.generate`)
  - Generates a random UUID and inserts it at the current cursor position or replaces the selected content
  - Automatically copies to clipboard when no editor is open
- **Generate UUID v4 without Hyphens** (`common-tools.uuid.generate-without-hyphens`)
  - Generates a random UUID without hyphens and inserts it at the current cursor position or replaces the selected content
  - Automatically copies to clipboard when no editor is open

### Random String Tool
- **Generate Random String** (`common-tools.random.generate`)
  - Generates a random string with customizable length and character sets
  - Supports combinations of numbers, lowercase letters, uppercase letters, and special symbols
  - Inserts at the current cursor position, or at the end of file if no cursor is present
  - Displays the generated random string when no editor is open

## Menu and Usage
1. Select the content you want to process, or don't select anything to process the entire file.
2. Right-click and select the "Common Tools" menu, then choose the corresponding feature by group.
3. Or press `Cmd+Shift+P` (Mac)/`Ctrl+Shift+P` (Windows) to open the command palette, type the command name (such as "lower case" or "timestamp"), and press Enter.

## Changelog
See [CHANGELOG.md](./CHANGELOG.md) for details.

## Contribution
Issues and PRs are welcome.ides common development tool commands, supporting right-click group menus and command palette operations.

[中文文档](./README.cn.md)

## Features

### JSON Tools
- **Format** (`common-tools.json.format`)
- **Minify** (`common-tools.json.minify`)
- **Format and Compress** (`common-tools.json.compress-one-line`)
- **Unescape** (`common-tools.json.unescape`)
- **Unescape and Format** (`common-tools.json.unescape-format`)
- **Deep Unescape** (`common-tools.json.deep-unescape`)
- **Deep Unescape and Format** (`common-tools.json.deep-unescape-format`)

> All JSON tools automatically trim the selected content and remove leading/trailing commas and spaces for robust processing.

### Time Tools
- **Get Current Timestamp** (`common-tools.time.now-timestamp`)
- **Format Local Date** (`common-tools.time.format.local-date`)
- **Format Local DateTime** (`common-tools.time.format.local-datetime`)
- **Format Local DateTime with Milliseconds** (`common-tools.time.format.local-datetime-ms`)
- **Parse String to Timestamp** (`common-tools.time.parse-to-timestamp`)
  - Supported formats: YYYY-MM-DD, YYYY-MM-DD HH:mm, YYYY-MM-DD HH:mm:ss, YYYY-MM-DD HH:mm:ss.SSS, HH:mm, HH:mm:ss
- **Format commands support 10/13 digit timestamps input. 10-digit timestamps are automatically converted without milliseconds, 13-digit timestamps preserve milliseconds. Returns an empty string when selection is empty.**

### String Format Conversion Tools
- **lower case** (`common-tools.string.lower-case`)
- **UPPER CASE** (`common-tools.string.upper-case`)
- **camelCase** (`common-tools.string.camel-case`)
- **PascalCase** (`common-tools.string.pascal-case`)
- **snake_case** (`common-tools.string.snake-case`)
- **SCREAMING_SNAKE_CASE** (`common-tools.string.screaming-snake-case`)
- **kebab-case** (`common-tools.string.kebab-case`)
- **dot.case** (`common-tools.string.dot-case`)
- **Capitalized_Snake_Case** (`common-tools.string.capitalized-snake-case`)
- **space separated** (`common-tools.string.space-separated`)

> String tool menu items are grouped for clarity, with common, case conversion, and special formats clearly organized.

### UUID Tools
- **Generate UUID v4** (`common-tools.uuid.generate`)
  - Generates a random UUID and inserts it at the current cursor position or replaces the selected content
  - Automatically copies to clipboard when no editor is open
- **Generate UUID v4 without Hyphens** (`common-tools.uuid.generate-without-hyphens`)
  - Generates a random UUID without hyphens and inserts it at the current cursor position or replaces the selected content
  - Automatically copies to clipboard when no editor is open

## 菜单与用法
1. 选中需要处理的内容，或不选中则处理全文。
2. 右键选择“Common Tools”菜单，按分组选择对应功能。
3. 或按 `Cmd+Shift+P`（Mac）/`Ctrl+Shift+P`（Windows）打开命令面板，输入命令名（如“lower case”或“时间戳”）并回车。

## 变更日志
详见 [CHANGELOG.md](./CHANGELOG.md)

## 贡献
欢迎提交 issue 或 PR。

---

Email: wyl19940929@163.com