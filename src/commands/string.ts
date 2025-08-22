import * as vscode from 'vscode';
import { CommonCommand, CommandOperationMode, InsertStrategy } from '../types/command';
import { CommandExecutor } from '../utils/commandExecutor';

/**
 * 转换为驼峰命名法 (camelCase)
 */
function toCamelCase(text?: string): string {
    if (!text) {
        return '';
    }
    return text
        .replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, (m) => m.toLowerCase());
}

/**
 * 转换为下划线命名法 (snake_case)
 */
function toSnakeCase(text?: string): string {
    if (!text) {
        return '';
    }
    return text
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[-\s.]+/g, '_')
        .toLowerCase();
}

/**
 * 转换为连字符命名法 (kebab-case)
 */
function toKebabCase(text?: string): string {
    if (!text) {
        return '';
    }
    return text
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s.]+/g, '-')
        .toLowerCase();
}

/**
 * 转换为帕斯卡命名法 (PascalCase)
 */
function toPascalCase(text?: string): string {
    if (!text) {
        return '';
    }
    return text
        .replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, (m) => m.toUpperCase());
}

/**
 * 转换为大写下划线命名法 (SCREAMING_SNAKE_CASE)
 */
function toScreamingSnakeCase(text?: string): string {
    if (!text) {
        return '';
    }
    return toSnakeCase(text).toUpperCase();
}

/**
 * 转换为首字母大写下划线命名法 (Capitalized_Snake_Case)
 */
function toCapitalizedSnakeCase(text?: string): string {
    if (!text) {
        return '';
    }
    return toSnakeCase(text)
        .split('_')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join('_');
}

/**
 * 转换为小写
 */
function toLowerCase(text?: string): string {
    if (!text) {
        return '';
    }
    return text.toLowerCase();
}

/**
 * 转换为大写
 */
function toUpperCase(text?: string): string {
    if (!text) {
        return '';
    }
    return text.toUpperCase();
}

/**
 * 转换为空格分隔的文本
 */
function toSpaceSeparated(text?: string): string {
    if (!text) {
        return '';
    }
    return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[-_\.]+/g, ' ')
        .toLowerCase();
}

/**
 * 转换为点分隔命名法 (dot.case)
 */
function toDotCase(text?: string): string {
    if (!text) {
        return '';
    }
    return text
        .replace(/([a-z])([A-Z])/g, '$1.$2')
        .replace(/[-_\s]+/g, '.')
        .toLowerCase();
}

/**
 * 字符串转换命令定义
 */
const stringCases: CommonCommand[] = [
    {
        command: 'common-tools.string.lower-case',
        title: 'String: lower case',
        message: 'Converted to lower case',
        fn: toLowerCase,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.string.upper-case',
        title: 'String: UPPER CASE',
        message: 'Converted to UPPER CASE',
        fn: toUpperCase,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.string.camel-case',
        title: 'String: camelCase',
        message: 'Converted to camelCase',
        fn: toCamelCase,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.string.snake-case',
        title: 'String: snake_case',
        message: 'Converted to snake_case',
        fn: toSnakeCase,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.string.screaming-snake-case',
        title: 'String: SCREAMING_SNAKE_CASE',
        message: 'Converted to SCREAMING_SNAKE_CASE',
        fn: toScreamingSnakeCase,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.string.kebab-case',
        title: 'String: kebab-case',
        message: 'Converted to kebab-case',
        fn: toKebabCase,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.string.pascal-case',
        title: 'String: PascalCase',
        message: 'Converted to PascalCase',
        fn: toPascalCase,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.string.capitalized-snake-case',
        title: 'String: Capitalized_Snake_Case',
        message: 'Converted to Capitalized_Snake_Case',
        fn: toCapitalizedSnakeCase,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.string.space-separated',
        title: 'String: space separated',
        message: 'Converted to space separated',
        fn: toSpaceSeparated,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.string.dot-case',
        title: 'String: dot.case',
        message: 'Converted to dot.case',
        fn: toDotCase,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    }
];

/**
 * 注册字符串工具命令
 */
export function registerStringToolsCommands(context: vscode.ExtensionContext) {
    for (const command of stringCases) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command.command, async () => {
                // 使用通用命令执行器执行命令
                await CommandExecutor.execute(command);
            })
        );
    }
}
