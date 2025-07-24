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

const preprocess = (text: string) => text.trim().replace(/^[,\s]+|[,\s]+$/g, '');

const jsonCases: JsonCase[] = [
    {
        command: 'common-tools.json.format',
        title: 'JSON formatted successfully',
        handler: (text: string) => JSON.stringify(JSON.parse(preprocess(text)), null, 4)
    },
    {
        command: 'common-tools.json.minify',
        title: 'JSON minified successfully',
        handler: (text: string) => JSON.stringify(JSON.parse(preprocess(text)))
    },
    {
        command: 'common-tools.json.compress-one-line',
        title: 'JSON formatted and compressed',
        handler: (text: string) => {
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
    },
    {
        command: 'common-tools.json.unescape',
        title: 'Escape characters removed',
        handler: (text: string) => JSON.parse('"' + preprocess(text).replace(/"/g, '\"') + '"')
    },
    {
        command: 'common-tools.json.unescape-format',
        title: 'Unescaped and formatted successfully',
        handler: (text: string) => {
            const unescaped = JSON.parse('"' + preprocess(text).replace(/"/g, '\"') + '"');
            return JSON.stringify(unescaped, null, 4);
        }
    },
    {
        command: 'common-tools.json.deep-unescape',
        title: 'All field escape content removed',
        handler: (text: string) => {
            const obj = JSON.parse(preprocess(text));
            const unescaped = deepUnescape(obj);
            return JSON.stringify(unescaped, null, 4);
        }
    },
    {
        command: 'common-tools.json.deep-unescape-format',
        title: 'Deep unescaped and formatted successfully',
        handler: (text: string) => {
            const obj = JSON.parse(preprocess(text));
            const unescaped = deepUnescape(obj);
            return JSON.stringify(unescaped, null, 4);
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
                    vscode.window.showErrorMessage('Error: ' + e);
                }
            })
        );
    }
}
