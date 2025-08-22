import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { CommonCommand, CommandOperationMode, InsertStrategy } from '../types/command';
import { CommandExecutor } from '../utils/commandExecutor';

/**
 * 生成 UUID (v4)
 */
function generateUuidV4(): string {
    return crypto.randomUUID();
}

/**
 * 生成不带连字符的 UUID (v4)
 */
function generateUuidV4WithoutHyphens(): string {
    return crypto.randomUUID().replace(/-/g, '');
}

/**
 * UUID 工具命令定义
 */
const uuidCases: CommonCommand[] = [
    {
        command: 'common-tools.uuid.generate',
        title: 'Generate UUID v4',
        message: 'Generated successfully',
        fn: generateUuidV4,
        operationMode: CommandOperationMode.GENERATE,
        insertStrategy: InsertStrategy.INSERT
    },
    {
        command: 'common-tools.uuid.generate-without-hyphens',
        title: 'Generate UUID v4 without Hyphens',
        message: 'Generated successfully',
        fn: generateUuidV4WithoutHyphens,
        operationMode: CommandOperationMode.GENERATE,
        insertStrategy: InsertStrategy.INSERT
    }
];

/**
 * 注册 UUID 相关命令
 */
export function registerUuidCommands(context: vscode.ExtensionContext) {
    for (const command of uuidCases) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command.command, async () => {
                // 使用通用命令执行器执行命令
                await CommandExecutor.execute(command);
            })
        );
    }
}
