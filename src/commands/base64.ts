import * as vscode from 'vscode';
import { CommonCommand, CommandOperationMode, InsertStrategy } from '../types/command';
import { CommandExecutor } from '../utils/commandExecutor';

/**
 * Base64 编码
 * @param text 要编码的文本
 * @returns Base64 编码后的字符串
 */
export function encodeBase64(text?: string): string {
    if (!text) {
        return '';
    }
    return Buffer.from(text, 'utf-8').toString('base64');
}

/**
 * Base64 解码
 * @param text Base64 编码的文本
 * @returns 解码后的字符串
 */
export function decodeBase64(text?: string): string {
    if (!text) {
        return '';
    }
    try {
        const buf = Buffer.from(text.trim(), 'base64');
        // 检查是否为有效 base64：重新编码后应一致（忽略 padding）
        const normalized = buf.toString('base64').replace(/=+$/, '');
        const inputNorm = text.trim().replace(/=+$/, '').replace(/\s+/g, '');
        if (normalized !== inputNorm) {
            throw new Error('Invalid Base64 string');
        }
        return buf.toString('utf-8');
    } catch (e) {
        throw new Error('Invalid Base64 string');
    }
}

/**
 * Base64 URL Safe 编码
 * 将 + 替换为 -, / 替换为 _, 并移除尾部的 =
 * @param text 要编码的文本
 * @returns Base64 URL Safe 编码后的字符串
 */
export function encodeBase64UrlSafe(text?: string): string {
    if (!text) {
        return '';
    }
    return Buffer.from(text, 'utf-8')
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Base64 URL Safe 解码
 * 将 - 替换为 +, _ 替换为 /, 并补全尾部的 =
 * @param text Base64 URL Safe 编码的文本
 * @returns 解码后的字符串
 */
export function decodeBase64UrlSafe(text?: string): string {
    if (!text) {
        return '';
    }
    try {
        let base64 = text.trim().replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }
        const buf = Buffer.from(base64, 'base64');
        // 校验有效性
        const normalized = buf.toString('base64').replace(/=+$/, '');
        const inputNorm = base64.replace(/=+$/, '').replace(/\s+/g, '');
        if (normalized !== inputNorm) {
            throw new Error('Invalid Base64 URL Safe string');
        }
        return buf.toString('utf-8');
    } catch (e) {
        throw new Error('Invalid Base64 URL Safe string');
    }
}

/**
 * Base64 工具命令定义
 */
const base64Cases: CommonCommand[] = [
    {
        command: 'common-tools.base64.encode',
        title: 'Base64: Encode',
        message: 'Base64 encoded successfully',
        fn: encodeBase64,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.base64.decode',
        title: 'Base64: Decode',
        message: 'Base64 decoded successfully',
        fn: decodeBase64,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.base64.encode-url-safe',
        title: 'Base64: Encode URL Safe',
        message: 'Base64 URL Safe encoded successfully',
        fn: encodeBase64UrlSafe,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.base64.decode-url-safe',
        title: 'Base64: Decode URL Safe',
        message: 'Base64 URL Safe decoded successfully',
        fn: decodeBase64UrlSafe,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    }
];

/**
 * 注册 Base64 工具命令
 */
export function registerBase64ToolsCommands(context: vscode.ExtensionContext) {
    for (const command of base64Cases) {
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
