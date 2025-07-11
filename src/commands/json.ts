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

type JsonCase = {
    command: string;
    title: string;
    handler: (text: string) => string;
};

const jsonCases: JsonCase[] = [
    {
        command: 'common-tools.json.format',
        title: 'JSON 格式化成功',
        handler: (text: string) => JSON.stringify(JSON.parse(text), null, 2)
    },
    {
        command: 'common-tools.json.minify',
        title: 'JSON 压缩成功',
        handler: (text: string) => JSON.stringify(JSON.parse(text))
    },
    {
        command: 'common-tools.json.unescape',
        title: '去除转义字符成功',
        handler: (text: string) => JSON.parse('"' + text.replace(/"/g, '\\"') + '"')
    },
    {
        command: 'common-tools.json.unescape-format',
        title: '转义后格式化成功',
        handler: (text: string) => {
            const unescaped = JSON.parse('"' + text.replace(/"/g, '\\"') + '"');
            return JSON.stringify(unescaped, null, 2);
        }
    },
    {
        command: 'common-tools.json.deep-unescape',
        title: '所有字段转义内容已去除',
        handler: (text: string) => {
            const obj = JSON.parse(text);
            const unescaped = deepUnescape(obj);
            return JSON.stringify(unescaped, null, 2);
        }
    },
    {
        command: 'common-tools.json.deep-unescape-format',
        title: '深度去除转义后格式化成功',
        handler: (text: string) => {
            const obj = JSON.parse(text);
            const unescaped = deepUnescape(obj);
            return JSON.stringify(unescaped, null, 2);
        }
    }
];

export function registerJsonToolsCommands(context: vscode.ExtensionContext) {
    for (const c of jsonCases) {
        context.subscriptions.push(
            vscode.commands.registerCommand(c.command, async () => {
                const editor = vscode.window.activeTextEditor;
                if (!editor) { return; }
                const text = editor.document.getText(editor.selection) || editor.document.getText();
                try {
                    const result = c.handler(text.trim());
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
                    vscode.window.showInformationMessage(c.title);
                } catch (e) {
                    vscode.window.showErrorMessage(c.title.replace('成功', '失败') + ': ' + e);
                }
            })
        );
    }
}
