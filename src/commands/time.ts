
import * as vscode from 'vscode';

function pad(n: number) {
    return n.toString().padStart(2, '0');
}


function formatLocalDate(dateOrTs: Date | string | number): string {
    if (dateOrTs === undefined || dateOrTs === null || dateOrTs === '') {
        return '';
    }
    let date: Date;
    if (typeof dateOrTs === 'string' || typeof dateOrTs === 'number') {
        let ts = Number(dateOrTs);
        if (!isNaN(ts)) {
            if (ts < 1e12) {
                ts = ts * 1000;
            }
            date = new Date(ts);
        } else {
            return '';
        }
    } else {
        date = dateOrTs;
    }
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatLocalDateTime(dateOrTs: Date | string | number): string {
    let date: Date;
    if (typeof dateOrTs === 'string' || typeof dateOrTs === 'number') {
        let ts = Number(dateOrTs);
        if (!isNaN(ts)) {
            if (ts < 1e12) {
                ts = ts * 1000; // 10位转13位
            }
            date = new Date(ts);
        } else {
            date = new Date();
        }
    } else {
        date = dateOrTs;
    }
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatLocalDateTimeMs(dateOrTs: Date | string | number): string {
    let date: Date;
    if (typeof dateOrTs === 'string' || typeof dateOrTs === 'number') {
        let ts = Number(dateOrTs);
        if (!isNaN(ts)) {
            if (ts < 1e12) {
                ts = ts * 1000; // 10位转13位
            }
            date = new Date(ts);
        } else {
            date = new Date();
        }
    } else {
        date = dateOrTs;
    }
    // 如果原始是10位时间戳，毫秒恒为000
    if (typeof dateOrTs === 'string' || typeof dateOrTs === 'number') {
        const ts = Number(dateOrTs);
        if (!isNaN(ts) && ts < 1e12) {
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        }
    }
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${date.getMilliseconds().toString().padStart(3, '0')}`;
}

function parseToTimestamp(text: string): string {
    const dt = text.trim();
    // 支持 YYYY-MM-DD HH:mm:ss.SSS
    let m = dt.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})\.(\d{1,3})$/);
    if (m) {
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6]), Number(m[7].padEnd(3, '0')));
        return d.getTime().toString();
    }
    // 支持 YYYY-MM-DD HH:mm:ss
    m = dt.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
    if (m) {
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6]));
        return d.getTime().toString();
    }
    // 支持 YYYY-MM-DD HH:mm
    m = dt.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/);
    if (m) {
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]));
        return d.getTime().toString();
    }
    // 支持 YYYY-MM-DD
    m = dt.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
        return d.getTime().toString();
    }
    return '';
}

export function registerTimeToolsCommands(context: vscode.ExtensionContext) {
    const commands = [
        {
            command: 'common-tools.time.now-timestamp',
            title: '已插入当前时间戳',
            handler: () => Date.now().toString()
        },
        {
            command: 'common-tools.time.format.local-date',
            title: '已插入当前本地日期 (YYYY-MM-DD)',
            handler: (text?: string) => {
                if (text === undefined || text === null || text.trim() === '') {
                    return '';
                }
                return formatLocalDate(text.trim());
            }
        },
        {
            command: 'common-tools.time.format.local-datetime',
            title: '已插入当前本地日期时间 (YYYY-MM-DD HH:mm:ss)',
            handler: (text?: string) => {
                if (text === undefined || text === null || text.trim() === '') {
                    return '';
                }
                return formatLocalDateTime(text.trim());
            }
        },
        {
            command: 'common-tools.time.format.local-datetime-ms',
            title: '已插入当前本地日期时间 (YYYY-MM-DD HH:mm:ss.SSS)',
            handler: (text?: string) => {
                if (text === undefined || text === null || text.trim() === '') {
                    return '';
                }
                return formatLocalDateTimeMs(text.trim());
            }
        },
        {
            command: 'common-tools.time.parse-to-timestamp',
            title: '已解析为时间戳',
            handler: (text?: string) => parseToTimestamp(text || '')
        }
    ];

    for (const c of commands) {
        context.subscriptions.push(
            vscode.commands.registerCommand(c.command, async () => {
                const editor = vscode.window.activeTextEditor;
                let text = '';
                if (editor) {
                    text = editor.document.getText(editor.selection) || '';
                }
                let result = '';
                try {
                    result = c.handler(text.trim());
                } catch (e) {
                    vscode.window.showErrorMessage(c.title.replace('已插入', '失败') + ': ' + e);
                    return;
                }
                if (!editor) {
                    vscode.env.clipboard.writeText(result);
                    vscode.window.showInformationMessage('已复制：' + result);
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
                vscode.window.showInformationMessage(c.title);
            })
        );
    }
}
