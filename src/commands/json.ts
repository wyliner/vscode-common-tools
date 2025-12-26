import * as vscode from 'vscode';
import { CommonCommand, CommandOperationMode, InsertStrategy } from '../types/command';
import { CommandExecutor } from '../utils/commandExecutor';

/**
 * 递归格式化所有字段中的 JSON 字符串
 * @param obj 要处理的对象
 * @returns 处理后的对象
 */
function deepFormat(obj: any): any {
    if (typeof obj === 'string') {
        // 尝试解析字符串为 JSON
        try {
            const parsed = JSON.parse(obj);
            // 如果解析后是对象或数组，递归处理
            if (typeof parsed === 'object' && parsed !== null) {
                return deepFormat(parsed);
            }
            return parsed;
        } catch {
            return obj;
        }
    } else if (Array.isArray(obj)) {
        return obj.map(deepFormat);
    } else if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            result[key] = deepFormat(obj[key]);
        }
        return result;
    }
    return obj;
}

/**
 * 提取文本中的 JSON 内容
 * 支持处理包含前缀文本的格式，如 "API Response Data: {...}"
 * @param text 可能包含非JSON前缀的文本
 * @returns 提取出的纯JSON文本
 */
const extractJson = (text: string): string => {
    if (!text) {
        return '';
    }
    
    text = text.trim();
    
    // 特殊情况：如果整个字符串被引号包裹，可能是一个转义的JSON字符串
    // 例如: "{\\"key\\":\\"value\\"}"
    if ((text.startsWith('"') && text.endsWith('"')) || 
        (text.startsWith("'") && text.endsWith("'"))) {
        // 先尝试作为JSON字符串解析
        try {
            const parsed = JSON.parse(text);
            if (typeof parsed === 'string') {
                // 成功解析为字符串，返回解析后的内容
                return parsed;
            }
        } catch {
            // 不是有效的JSON字符串，继续正常提取
        }
    }
    
    // 尝试找到JSON的起始位置（{ 或 [）
    const jsonStartChars = ['{', '['];
    let jsonStart = -1;
    
    for (const char of jsonStartChars) {
        const index = text.indexOf(char);
        if (index !== -1 && (jsonStart === -1 || index < jsonStart)) {
            jsonStart = index;
        }
    }
    
    // 如果找到了JSON起始符号，从该位置开始提取
    if (jsonStart > 0) {
        text = text.substring(jsonStart);
    } else if (jsonStart === -1) {
        // 没有找到JSON起始符号，返回原文本
        return text;
    }
    
    // 尝试找到JSON的结束位置（} 或 ]）
    // 需要匹配对应的括号
    if (text.startsWith('{')) {
        let depth = 0;
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"' && !escapeNext) {
                inString = !inString;
                continue;
            }
            
            if (!inString) {
                if (char === '{') {
                    depth++;
                } else if (char === '}') {
                    depth--;
                    if (depth === 0) {
                        text = text.substring(0, i + 1);
                        break;
                    }
                }
            }
        }
    } else if (text.startsWith('[')) {
        let depth = 0;
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"' && !escapeNext) {
                inString = !inString;
                continue;
            }
            
            if (!inString) {
                if (char === '[') {
                    depth++;
                } else if (char === ']') {
                    depth--;
                    if (depth === 0) {
                        text = text.substring(0, i + 1);
                        break;
                    }
                }
            }
        }
    }
    
    return text;
};

/**
 * 增强的预处理函数：
 * 1. 提取文本中的 JSON 内容（忽略前后非JSON文本）
 * 2. 去除前后空白
 * 3. 去除首尾的引号（单引号或双引号）
 * 4. 去除转义字符
 * 5. 将单引号 JSON 转换为标准双引号 JSON
 * @param text JSON 文本
 * @returns 处理后的 JSON 文本
 */
const preprocessEnhanced = (text: string): string => {
    if (!text) {
        return '';
    }
    
    // 首先提取JSON内容
    text = extractJson(text);
    
    // 去除前后空白
    text = text.trim();
    
    // 去除前后多余的逗号
    text = text.replace(/^[,\s]+|[,\s]+$/g, '');
    
    // 去除首尾的引号（单引号或双引号）- 只有当整个字符串被引号包裹时
    if ((text.startsWith('"') && text.endsWith('"')) || 
        (text.startsWith("'") && text.endsWith("'"))) {
        // 检查这是否是一个转义的 JSON 字符串
        try {
            // 尝试将整个字符串作为 JSON 字符串解析
            const parsed = JSON.parse(text);
            if (typeof parsed === 'string') {
                // 这是一个转义的 JSON 字符串，使用解析后的内容
                text = parsed;
            }
        } catch {
            // 如果解析失败，简单去除首尾引号
            text = text.slice(1, -1);
            
            // 尝试手动去除转义字符
            text = text.replace(/\\"/g, '"')
                      .replace(/\\'/g, "'")
                      .replace(/\\\\/g, '\\')
                      .replace(/\\n/g, '\n')
                      .replace(/\\r/g, '\r')
                      .replace(/\\t/g, '\t');
        }
    }
    
    // 将单引号 JSON 转换为标准双引号 JSON
    // 这是一个简单的实现，假设单引号用于 JSON 的键和字符串值
    if (text.includes("'")) {
        // 替换对象键的单引号为双引号
        text = text.replace(/'([^']+)':/g, '"$1":');
        // 替换字符串值的单引号为双引号（简化处理）
        text = text.replace(/:\s*'([^']*)'/g, ': "$1"');
        // 处理数组中的单引号字符串
        text = text.replace(/\[\s*'([^']*)'/g, '["$1"');
        text = text.replace(/,\s*'([^']*)'/g, ',"$1"');
    }
    
    return text.trim();
};

/**
 * 基础预处理 JSON 文本，去除前后多余的逗号和空白
 * 同时支持提取JSON内容，忽略前后非JSON文本
 * @param text JSON 文本
 * @returns 处理后的 JSON 文本
 */
const preprocess = (text: string): string => {
    if (!text) {
        return '';
    }
    // 首先提取JSON内容
    text = extractJson(text);
    return text.trim().replace(/^[,\s]+|[,\s]+$/g, '');
};

/**
 * 格式化 JSON 文本
 * 具备以下能力：
 * 1. 去除转义字符串
 * 2. 移除首尾的引号或双引号
 * 3. 如果是单引号的 JSON 格式，全部改为标准的双引号 JSON
 */
function formatJson(text?: string): string {
    if (!text) {
        return '';
    }
    return JSON.stringify(JSON.parse(preprocessEnhanced(text)), null, 2);
}

/**
 * 深度格式化 JSON 文本
 * 如果 JSON 字段里面是 JSON，则也递归格式化
 * 同样具备 formatJson 的所有增强能力
 */
function deepFormatJson(text?: string): string {
    if (!text) {
        return '';
    }
    const obj = JSON.parse(preprocessEnhanced(text));
    const formatted = deepFormat(obj);
    return JSON.stringify(formatted, null, 4);
}

/**
 * 压缩 JSON 文本为一行
 */
function compressJson(text?: string): string {
    if (!text) {
        return '';
    }
    return JSON.stringify(JSON.parse(preprocess(text)));
}

/**
 * 压缩 JSON 并增加适当空格，使其易读
 */
function compressJsonOneLine(text?: string): string {
    if (!text) {
        return '';
    }
    const obj = JSON.parse(preprocess(text));
    // 先标准一行
    let str = JSON.stringify(obj);
    // 大括号和中括号内侧加空格
    str = str.replace(/^{/, '{ ').replace(/}$/, ' }');
    str = str.replace(/^\[/, '[ ').replace(/\]$/, ' ]');
    // 逗号后加空格
    str = str.replace(/,/g, ', ');
    // 冒号后加空格
    str = str.replace(/:/g, ': ');
    // 多余空格合并
    str = str.replace(/\s{2,}/g, ' ');
    return str.trim();
}

/**
 * JSON 工具命令定义
 */
const jsonCases: CommonCommand[] = [
    {
        command: 'common-tools.json.format',
        title: 'JSON: Format',
        message: 'JSON formatted successfully',
        fn: formatJson,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.json.deep-format',
        title: 'JSON: Deep Format',
        message: 'JSON deep formatted successfully',
        fn: deepFormatJson,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.json.compress',
        title: 'JSON: Compress',
        message: 'JSON compressed successfully',
        fn: compressJson,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.json.compress-one-line',
        title: 'JSON: Compress One Line',
        message: 'JSON formatted and compressed',
        fn: compressJsonOneLine,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    }
];

/**
 * 注册 JSON 工具命令
 */
export function registerJsonToolsCommands(context: vscode.ExtensionContext) {
    for (const command of jsonCases) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command.command, async () => {
                try {
                    // 使用通用命令执行器执行命令
                    await CommandExecutor.execute(command);
                } catch (e) {
                    vscode.window.showErrorMessage(`Error: ${e instanceof Error ? e.message : String(e)}`);
                }
            })
        );
    }
}
