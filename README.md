# Common Tools (common-tools)

A VS Code extension that provides common development tool commands, supporting right-click group menus and command palette operations.

[中文文档](./README.cn.md)

## Features

### JSON Tools
- **Format** (`common-tools.json.format`)
  - Formats JSON with proper indentation
  - **Enhanced**: Automatically removes outer quotes and escape characters
  - **Enhanced**: Supports single-quote JSON conversion to standard double-quote format
  - **Enhanced**: Automatically extracts JSON from text with prefixes (e.g., "API Response Data: {...}")
  - Example: `"{\"key\":\"value\"}"` → properly formatted JSON
  - Example: `API Response Data: {"status":200}` → formatted JSON (ignoring prefix)
  
- **Deep Format** (`common-tools.json.deep-format`)
  - Recursively parses and formats nested JSON strings within JSON objects
  - Perfect for handling JSON fields that contain escaped JSON strings
  - **Enhanced**: Also supports text with prefixes
  - Example: `{"data":"{\"nested\":\"value\"}"}` → fully expanded and formatted
  
- **Compress** (`common-tools.json.compress`)
  - Minifies JSON to a single line without spaces
  - **Enhanced**: Supports text with prefixes
  
- **Compress One Line** (`common-tools.json.compress-one-line`)
  - Compresses JSON with minimal spacing for readability
  - Adds spaces after colons and commas

> **Enhanced Processing**: All JSON tools now feature:
> - Automatic trimming and comma/space removal
> - Smart escape character handling
> - Single-quote to double-quote conversion
> - Support for deeply nested JSON strings
> - **Automatic extraction of JSON from text with prefixes or suffixes**
> - Handles formats like: "Log: {...}", "Response: {...} - received", etc.

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

### Random String Tool
- **Generate Random String** (`common-tools.random.generate`)
  - Generates a random string with customizable length and character sets
  - Supports combinations of numbers, lowercase letters, uppercase letters, and special symbols
  - Inserts at the current cursor position, or at the end of file if no cursor is present
  - Displays the generated random string when no editor is open

### Base64 Tools
- **Base64 Encode** (`common-tools.base64.encode`)
  - Encodes selected text or entire file content to Base64 format
  - Supports UTF-8 encoding
- **Base64 Decode** (`common-tools.base64.decode`)
  - Decodes Base64 encoded text back to plain text
  - Automatically validates Base64 format
- **Base64 URL Safe Encode** (`common-tools.base64.encode-url-safe`)
  - Encodes text to Base64 URL Safe format (replaces + with -, / with _, removes padding =)
  - Perfect for use in URLs and filenames
- **Base64 URL Safe Decode** (`common-tools.base64.decode-url-safe`)
  - Decodes Base64 URL Safe encoded text
  - Automatically handles missing padding

## Menu and Usage
1. Select the content you want to process, or don't select anything to process the entire file.
2. Right-click and select the "Common Tools" menu, then choose the corresponding feature by group.
3. Or press `Cmd+Shift+P` (Mac)/`Ctrl+Shift+P` (Windows) to open the command palette, type the command name (such as "base64 encode" or "timestamp"), and press Enter.

## Changelog
See [CHANGELOG.md](./CHANGELOG.md) for details.

## Contribution
Issues and PRs are welcome.

---

Email: wyl19940929@163.com
