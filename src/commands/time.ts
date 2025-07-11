/**
 * 获取当前时间戳（毫秒）
 */
export function getNowTimestamp(): string {
    return Date.now().toString();
}

import * as vscode from 'vscode';

/**
 * 将时间戳（10位或13位）转换为格式化时间字符串
 * @param timestamp number|string 时间戳
 * @returns string 2025-07-11 10:59:14 或 2025-07-11 10:59:14.123
 */
export function formatTimestamp(timestamp: number | string): string {
    let ts = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
    if (isNaN(ts)) {
        return '';
    }
    // 10位秒，13位毫秒
    if (ts < 1e12) {
        ts = ts * 1000;
    }
    const date = new Date(ts);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());
    const ms = date.getMilliseconds();
    return ms > 0
        ? `${y}-${m}-${d} ${h}:${min}:${s}.${ms.toString().padStart(3, '0')}`
        : `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export function registerTimeToolsCommands(context: vscode.ExtensionContext) {
    // 获取当前时间戳
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.time.now-timestamp', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.env.clipboard.writeText(getNowTimestamp());
                vscode.window.showInformationMessage('当前时间戳已复制到剪贴板');
                return;
            }
            const ts = getNowTimestamp();
            await editor.edit(editBuilder => {
                if (editor.selection.isEmpty) {
                    const fullRange = new vscode.Range(
                        editor.document.positionAt(0),
                        editor.document.positionAt(editor.document.getText().length)
                    );
                    editBuilder.replace(fullRange, ts);
                } else {
                    editBuilder.replace(editor.selection, ts);
                }
            });
            vscode.window.showInformationMessage('当前时间戳已插入');
        })
    );
    // 选中文本或全部文本，转换为格式化时间
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.time.format-timestamp', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }
            const text = editor.document.getText(editor.selection) || editor.document.getText();
            const result = formatTimestamp(text.trim());
            if (!result) {
                vscode.window.showErrorMessage('无法识别的时间戳');
                return;
            }
            await editor.edit(editBuilder => {
                if (editor.selection.isEmpty) {
                    const fullRange = new vscode.Range(
                        editor.document.positionAt(0),
                        editor.document.positionAt(editor.document.getText().length)
                    );
                    editBuilder.replace(fullRange, result);
                } else {
                    editBuilder.replace(editor.selection, result);
                }
            });
            vscode.window.showInformationMessage('时间戳已转换为格式化时间');
        })
    );
}
