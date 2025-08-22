
import * as vscode from 'vscode';
import { recordCommandExecution } from './last';

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

// 获取当前时间戳
function getNowTimestamp(_text?: string): string {
    return Date.now().toString();
}

// 转换为日期格式 YYYY-MM-DD
function toLocalDate(text?: string): string {
    if (!text || text.trim() === '') {
        return formatLocalDate(new Date());
    }
    return formatLocalDate(text.trim());
}

// 转换为日期时间格式 YYYY-MM-DD HH:mm:ss
function toLocalDateTime(text?: string): string {
    if (!text || text.trim() === '') {
        return formatLocalDateTime(new Date());
    }
    return formatLocalDateTime(text.trim());
}

// 转换为日期时间(毫秒)格式 YYYY-MM-DD HH:mm:ss.SSS
function toLocalDateTimeMs(text?: string): string {
    if (!text || text.trim() === '') {
        return formatLocalDateTimeMs(new Date());
    }
    return formatLocalDateTimeMs(text.trim());
}

// 字符串转时间戳
function toTimestamp(text?: string): string {
    if (!text || text.trim() === '') {
        return '';
    }
    return parseToTimestamp(text.trim());
}

export function registerTimeToolsCommands(context: vscode.ExtensionContext) {
    // 定义所有命令，参考string.ts的结构
    const commands = [
        { command: 'common-tools.time.now-timestamp', fn: getNowTimestamp, title: 'Time: Current timestamp', insertAtCursor: true },
        { command: 'common-tools.time.format.local-date', fn: toLocalDate, title: 'Time: Formatted YYYY-MM-DD' },
        { command: 'common-tools.time.format.local-datetime', fn: toLocalDateTime, title: 'Time: Formatted YYYY-MM-DD HH:mm:ss' },
        { command: 'common-tools.time.format.local-datetime-ms', fn: toLocalDateTimeMs, title: 'Time: Formatted YYYY-MM-DD HH:mm:ss.SSS' },
        { command: 'common-tools.time.parse-to-timestamp', fn: toTimestamp, title: 'Time: Parsed to timestamp' }
    ];
    
    // 注册所有命令
    for (const cmd of commands) {
        context.subscriptions.push(
            vscode.commands.registerCommand(cmd.command, async () => {
                // 记录命令执行
                recordCommandExecution(cmd.command, cmd.title);
                
                const editor = vscode.window.activeTextEditor;
                
                // 如果没有编辑器打开
                if (!editor) {
                    const result = cmd.fn();
                    if (result) {
                        vscode.env.clipboard.writeText(result);
                        vscode.window.showInformationMessage(`Copied to clipboard: ${result}`);
                    } else {
                        vscode.window.showInformationMessage('No result to copy');
                    }
                    return;
                }
                
                // 获取选中的文本或整个文档
                const text = editor.document.getText(editor.selection) || '';
                let result;
                
                try {
                    // 执行处理函数
                    result = cmd.fn(text);
                } catch (e) {
                    vscode.window.showErrorMessage(`Error: ${e instanceof Error ? e.message : String(e)}`);
                    return;
                }
                
                // 处理结果
                await editor.edit(editBuilder => {
                    if (cmd.insertAtCursor) {
                        // 使用光标插入模式
                        const position = editor.selection.active || 
                            new vscode.Position(
                                editor.document.lineCount - 1, 
                                editor.document.lineAt(editor.document.lineCount - 1).text.length
                            );
                        
                        editBuilder.insert(position, result);
                    } else {
                        // 替换模式
                        if (editor.selection.isEmpty) {
                            const fullRange = new vscode.Range(
                                editor.document.positionAt(0),
                                editor.document.positionAt(editor.document.getText().length)
                            );
                            editBuilder.replace(fullRange, result);
                        } else {
                            editBuilder.replace(editor.selection, result);
                        }
                    }
                });
                
                vscode.window.showInformationMessage(cmd.title);
            })
        );
    }
}
