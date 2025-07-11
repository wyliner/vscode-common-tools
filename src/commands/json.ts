// 递归去除所有字段中的转义字符串内容
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
import * as vscode from 'vscode';

export function registerJsonToolsCommands(context: vscode.ExtensionContext) {
    // 格式化 JSON
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.json.format', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) { return; }
            const text = editor.document.getText(editor.selection) || editor.document.getText();
            try {
                const formatted = JSON.stringify(JSON.parse(text), null, 2);
                await editor.edit(editBuilder => {
                    if (editor.selection.isEmpty) {
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(editor.document.getText().length)
                        );
                        editBuilder.replace(fullRange, formatted);
                    } else {
                        editBuilder.replace(editor.selection, formatted);
                    }
                });
                vscode.window.showInformationMessage('JSON 格式化成功');
            } catch (e) {
                vscode.window.showErrorMessage('JSON 格式化失败: ' + e);
            }
        })
    );

    // 压缩 JSON
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.json.minify', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) { return; }
            const text = editor.document.getText(editor.selection) || editor.document.getText();
            try {
                const minified = JSON.stringify(JSON.parse(text));
                await editor.edit(editBuilder => {
                    if (editor.selection.isEmpty) {
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(editor.document.getText().length)
                        );
                        editBuilder.replace(fullRange, minified);
                    } else {
                        editBuilder.replace(editor.selection, minified);
                    }
                });
                vscode.window.showInformationMessage('JSON 压缩成功');
            } catch (e) {
                vscode.window.showErrorMessage('JSON 压缩失败: ' + e);
            }
        })
    );
    // 去除转义字符
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.json.unescape', async () => {

            const editor = vscode.window.activeTextEditor;
            if (!editor) { return; }
            const text = editor.document.getText(editor.selection) || editor.document.getText();
            try {
                // 先解析为字符串再去除转义
                const unescaped = JSON.parse('"' + text.replace(/"/g, '\\"') + '"');
                await editor.edit(editBuilder => {
                    if (editor.selection.isEmpty) {
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(editor.document.getText().length)
                        );
                        editBuilder.replace(fullRange, unescaped);
                    } else {
                        editBuilder.replace(editor.selection, unescaped);
                    }
                });
                vscode.window.showInformationMessage('去除转义字符成功');
            } catch (e) {
                vscode.window.showErrorMessage('去除转义字符失败: ' + e);
            }
        })
    );
    // 转义字符串后格式化
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.json.unescapeFormat', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) { return; }
            const text = editor.document.getText(editor.selection) || editor.document.getText();
            try {
                // 先去除转义再格式化
                const unescaped = JSON.parse('"' + text.replace(/"/g, '\\"') + '"');
                const formatted = JSON.stringify(unescaped, null, 2);
                await editor.edit(editBuilder => {
                    if (editor.selection.isEmpty) {
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(editor.document.getText().length)
                        );
                        editBuilder.replace(fullRange, formatted);
                    } else {
                        editBuilder.replace(editor.selection, formatted);
                    }
                });
                vscode.window.showInformationMessage('转义后格式化成功');
            } catch (e) {
                vscode.window.showErrorMessage('转义后格式化失败: ' + e);
            }
        })
    );
    // 深度去除所转义字符
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.json.deepUnescape', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) { return; }
            const text = editor.document.getText(editor.selection) || editor.document.getText();
            try {
                const obj = JSON.parse(text);
                const unescaped = deepUnescape(obj);
                const formatted = JSON.stringify(unescaped, null, 2);
                await editor.edit(editBuilder => {
                    if (editor.selection.isEmpty) {
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(editor.document.getText().length)
                        );
                        editBuilder.replace(fullRange, formatted);
                    } else {
                        editBuilder.replace(editor.selection, formatted);
                    }
                });
                vscode.window.showInformationMessage('所有字段转义内容已去除');
            } catch (e) {
                vscode.window.showErrorMessage('深度去除转义失败: ' + e);
            }
        })
    );
    // 深度去除转义字符串后格式化
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.json.deepUnescapeFormat', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) { return; }
            const text = editor.document.getText(editor.selection) || editor.document.getText();
            try {
                const obj = JSON.parse(text);
                const unescaped = deepUnescape(obj);
                const formatted = JSON.stringify(unescaped, null, 2);
                await editor.edit(editBuilder => {
                    if (editor.selection.isEmpty) {
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(editor.document.getText().length)
                        );
                        editBuilder.replace(fullRange, formatted);
                    } else {
                        editBuilder.replace(editor.selection, formatted);
                    }
                });
                vscode.window.showInformationMessage('深度去除转义后格式化成功');
            } catch (e) {
                vscode.window.showErrorMessage('深度去除转义后格式化失败: ' + e);
            }
        })
    );
}
