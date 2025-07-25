# Common Tools (common-tools)

VS Code 扩展，提供常用开发工具命令，支持右键分组菜单和命令面板操作。

## 功能列表

### JSON 工具
- **格式化** (`common-tools.json.format`)
- **压缩** (`common-tools.json.minify`)
- **格式化压缩（美观一行）** (`common-tools.json.compress-one-line`)
- **去转义** (`common-tools.json.unescape`)
- **去转义后格式化** (`common-tools.json.unescape-format`)
- **深度去转义** (`common-tools.json.deep-unescape`)
- **深度去转义后格式化** (`common-tools.json.deep-unescape-format`)

> 所有 JSON 工具自动 trim 选中内容并去除首尾逗号、空格，健壮处理。

### 时间工具
- **获取当前时间戳** (`common-tools.time.now-timestamp`)
- **格式化本地日期** (`common-tools.time.format.local-date`)
- **格式化本地日期时间** (`common-tools.time.format.local-datetime`)
- **格式化本地日期时间（带毫秒）** (`common-tools.time.format.local-datetime-ms`)
- **字符串转时间戳** (`common-tools.time.parse-to-timestamp`)
  - 支持格式：YYYY-MM-DD、YYYY-MM-DD HH:mm、YYYY-MM-DD HH:mm:ss、YYYY-MM-DD HH:mm:ss.SSS、HH:mm、HH:mm:ss
- **格式化命令支持输入 10/13 位时间戳，10位自动去毫秒，13位保留毫秒。选中为空返回空字符串。**

### 字符串格式转换工具
- **小写** (`common-tools.string.lower-case`)
- **大写** (`common-tools.string.upper-case`)
- **camelCase** (`common-tools.string.camel-case`)
- **PascalCase** (`common-tools.string.pascal-case`)
- **snake_case** (`common-tools.string.snake-case`)
- **SCREAMING_SNAKE_CASE** (`common-tools.string.screaming-snake-case`)
- **kebab-case** (`common-tools.string.kebab-case`)
- **dot.case** (`common-tools.string.dot-case`)
- **Capitalized_Snake_Case** (`common-tools.string.capitalized-snake-case`)
- **空格分隔** (`common-tools.string.space-separated`)

> 字符串工具菜单已分组，常用、大小写、特殊格式一目了然。

### UUID 工具
- **生成 UUID v4** (`common-tools.uuid.generate`)
  - 生成随机 UUID 并插入当前光标位置或替换选中内容
  - 无编辑器打开时自动复制到剪贴板
- **生成无连字符 UUID v4** (`common-tools.uuid.generate-without-hyphens`)
  - 生成不含连字符的随机 UUID 并插入当前光标位置或替换选中内容
  - 无编辑器打开时自动复制到剪贴板

### 随机字符串工具
- **生成随机字符串** (`common-tools.random.generate`)
  - 生成自定义长度和字符集的随机字符串
  - 支持选择数字、小写字母、大写字母和特殊符号组合
  - 插入当前光标位置，如无光标则插入文件末尾
  - 无编辑器打开时显示生成的随机字符串

## 菜单与用法
1. 选中需要处理的内容，或不选中则处理全文。
2. 右键选择"Common Tools"菜单，按分组选择对应功能。
3. 或按 `Cmd+Shift+P`（Mac）/`Ctrl+Shift+P`（Windows）打开命令面板，输入命令名（如"lower case"或"时间戳"）并回车。

## 变更日志
详见 [CHANGELOG.md](./CHANGELOG.md)

## 贡献
欢迎提交 issue 或 PR。

---

Email: wyl19940929@163.com
