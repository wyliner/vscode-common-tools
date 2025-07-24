import * as vscode from 'vscode';
import * as crypto from 'crypto';

/**
 * UUID 工具类型定义
 */
type UuidCase = {
    command: string;
    title: string;
    successMessage: string;
    generator: () => string;
};

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
const uuidCases: UuidCase[] = [
    {
        command: 'common-tools.uuid.generate',
        title: 'Generate UUID v4',
        successMessage: 'UUID inserted',
        generator: generateUuidV4
    },
    {
        command: 'common-tools.uuid.generate-without-hyphens',
        title: 'Generate UUID v4 without Hyphens',
        successMessage: 'UUID without hyphens inserted',
        generator: generateUuidV4WithoutHyphens
    }
];

/**
 * 注册 UUID 相关命令
 */
export function registerUuidCommands(context: vscode.ExtensionContext) {
    for (const c of uuidCases) {
        context.subscriptions.push(
            vscode.commands.registerCommand(c.command, async () => {
                const uuid = c.generator();
                const editor = vscode.window.activeTextEditor;
                
                if (!editor) {
                    vscode.env.clipboard.writeText(uuid);
                    vscode.window.showInformationMessage(`UUID copied to clipboard: ${uuid}`);
                    return;
                }

                await editor.edit(editBuilder => {
                    if (editor.selection.isEmpty) {
                        const position = editor.selection.active;
                        editBuilder.insert(position, uuid);
                    } else {
                        editBuilder.replace(editor.selection, uuid);
                    }
                });
                vscode.window.showInformationMessage(c.successMessage);
            })
        );
    }
}
