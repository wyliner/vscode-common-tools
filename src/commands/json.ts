import * as vscode from 'vscode';
import { CommonCommand, CommandOperationMode, InsertStrategy } from '../types/command';
import { CommandExecutor } from '../utils/commandExecutor';

/**
 * 递归去除所有字段中的转义字符串内容
 * @param obj 要处理的对象
 * @returns 处理后的对象
 */
function deepUnescape(obj: any): any {
    if (typeof obj === 'string') {
        // 尝试解析字符串为 JSON
        try {
            const parsed = JSON.parse(obj);
            // 如果解析后是对象或数组，递归处理
            if (typeof parsed === 'object' && parsed !== null) {
                return deepUnescape(parsed);
            }
            return parsed;
        } catch {
            return obj;
        }
    } else if (Array.isArray(obj)) {
        return obj.map(deepUnescape);
    } else if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            result[key] = deepUnescape(obj[key]);
        }
        return result;
    }
    return obj;
}

/**
 * 预处理 JSON 文本，去除前后多余的逗号和空白
 * @param text JSON 文本
 * @returns 处理后的 JSON 文本
 */
const preprocess = (text: string): string => {
    if (!text) {
        return '';
    }
    return text.trim().replace(/^[,\s]+|[,\s]+$/g, '');
};

/**
 * 格式化 JSON 文本
 */
function formatJson(text?: string): string {
    if (!text) {
        return '';
    }
    return JSON.stringify(JSON.parse(preprocess(text)), null, 4);
}

/**
 * 压缩 JSON 文本为一行
 */
function minifyJson(text?: string): string {
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
 * 去除字符串中的转义字符
 */
function unescapeJson(text?: string): string {
    if (!text) {
        return '';
    }
    return JSON.parse('"' + preprocess(text).replace(/"/g, '\"') + '"');
}

/**
 * 去除字符串中的转义字符并格式化
 */
function unescapeFormatJson(text?: string): string {
    if (!text) {
        return '';
    }
    const unescaped = JSON.parse('"' + preprocess(text).replace(/"/g, '\"') + '"');
    return JSON.stringify(unescaped, null, 2);
}

/**
 * 递归去除所有字段中的转义字符
 */
function deepUnescapeJson(text?: string): string {
    if (!text) {
        return '';
    }
    const obj = JSON.parse(preprocess(text));
    const unescaped = deepUnescape(obj);
    return JSON.stringify(unescaped, null, 2);
}

/**
 * 递归去除所有字段中的转义字符并格式化
 */
function deepUnescapeFormatJson(text?: string): string {
    if (!text) {
        return '';
    }
    const obj = JSON.parse(preprocess(text));
    const unescaped = deepUnescape(obj);
    return JSON.stringify(unescaped, null, 2);
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
        command: 'common-tools.json.minify',
        title: 'JSON: Minify',
        message: 'JSON minified successfully',
        fn: minifyJson,
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
    },
    {
        command: 'common-tools.json.unescape',
        title: 'JSON: Unescape',
        message: 'Escape characters removed',
        fn: unescapeJson,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.json.unescape-format',
        title: 'JSON: Unescape & Format',
        message: 'Unescaped and formatted successfully',
        fn: unescapeFormatJson,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.json.deep-unescape',
        title: 'JSON: Deep Unescape',
        message: 'All field escape content removed',
        fn: deepUnescapeJson,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.json.deep-unescape-format',
        title: 'JSON: Deep Unescape & Format',
        message: 'Deep unescaped and formatted successfully',
        fn: deepUnescapeFormatJson,
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
