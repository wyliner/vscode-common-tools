# Change Log

## 0.0.6 - 2025-07-25

### 随机字符串工具
- **优化**: 取消选择操作选项，简化为直接插入光标位置
- **增强**: 支持自定义字符集（数字、小写字母、大写字母、符号）和长度
- **界面**: 添加到右键菜单，提高可访问性

### UUID 工具
- **新增**: 标准 UUID v4 生成器
- **新增**: 无连字符 UUID v4 生成器

### 时间工具
- **优化**: 支持任意长度时间戳的智能转换
- **优化**: 自适应时间组件显示，零值部分自动隐藏

## 0.0.5 - 2025-07-14
 - 缩减icon大小

## 0.0.4 - 2025-07-14
 - 新增icon

## 0.0.3 - 2025-07-14
- 优化 time 工具，parse 支持所有格式字符串，format 支持时间戳输入，10/13位自动识别毫秒
- string 菜单命令分组显示
- JSON compress-one-line 格式优化，结构更美观
- JSON/STRING 工具健壮性增强，所有 handler 预处理 trim/逗号/空格

## 0.0.2 - 2025-07-11
- 新增 string 工具，支持多种字符串格式转换
- 添加右键菜单功能，支持分组三级菜单
- 命令风格统一为 kebab-case
- 优化 JSON 工具注册方式
- 新增获取当前时间戳命令

## 0.0.1 - 2025-07-10
- 新增 json 工具
- 新增 time 工具