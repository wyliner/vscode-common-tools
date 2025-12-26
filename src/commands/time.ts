
import * as vscode from 'vscode';
import { CommonCommand, CommandOperationMode, InsertStrategy } from '../types/command';
import { CommandExecutor } from '../utils/commandExecutor';

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

// 对时间字符串进行时区偏移（加减小时数）
async function applyTimezoneOffset(text?: string): Promise<string> {
    if (!text || text.trim() === '') {
        vscode.window.showErrorMessage('Please select or provide a datetime string');
        return '';
    }

    const trimmedText = text.trim();
    
    // 尝试解析输入的时间字符串
    let date: Date | null = null;
    
    // 尝试解析 ISO 格式或常见格式
    const isoMatch = trimmedText.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(?:Z|([+-]\d{2}):?(\d{2}))?$/);
    if (isoMatch) {
        date = new Date(trimmedText);
    } else {
        // 尝试简单格式
        const m = trimmedText.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
        if (m) {
            date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6]));
        }
    }
    
    if (!date || isNaN(date.getTime())) {
        vscode.window.showErrorMessage('Invalid datetime format. Expected format: YYYY-MM-DD HH:mm:ss');
        return '';
    }

    // 提示用户输入时区偏移量
    const offsetInput = await vscode.window.showInputBox({
        prompt: 'Enter timezone offset in hours (e.g., +8, -5, 3)',
        placeHolder: 'Enter a number between -12 and +14',
        validateInput: (value) => {
            const num = Number(value);
            if (isNaN(num)) {
                return 'Please enter a valid number';
            }
            if (num < -12 || num > 14) {
                return 'Timezone offset must be between -12 and +14';
            }
            return null;
        }
    });

    if (offsetInput === undefined) {
        return ''; // 用户取消
    }

    const offset = Number(offsetInput);
    
    // 应用时区偏移
    const resultDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
    
    return formatLocalDateTime(resultDate);
}

// UTC时间转本地时间
function utcToLocal(text?: string): string {
    if (!text || text.trim() === '') {
        return '';
    }

    const trimmedText = text.trim();
    let date: Date | null = null;

    // 解析UTC时间字符串
    // 支持格式: YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DDTHH:mm:ssZ
    const m1 = trimmedText.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z?$/);
    if (m1) {
        // 将输入视为UTC时间
        const utcDate = new Date(Date.UTC(
            Number(m1[1]), 
            Number(m1[2]) - 1, 
            Number(m1[3]), 
            Number(m1[4]), 
            Number(m1[5]), 
            Number(m1[6]),
            m1[7] ? Number(m1[7].padEnd(3, '0')) : 0
        ));
        date = utcDate;
    } else {
        // 尝试直接解析
        const parsedDate = new Date(trimmedText);
        if (!isNaN(parsedDate.getTime())) {
            date = parsedDate;
        }
    }

    if (!date || isNaN(date.getTime())) {
        return '';
    }

    // 转换为本地时间格式
    return formatLocalDateTime(date);
}

// 本地时间转UTC时间
function localToUtc(text?: string): string {
    if (!text || text.trim() === '') {
        return '';
    }

    const trimmedText = text.trim();
    let date: Date | null = null;

    // 解析本地时间字符串
    const m = trimmedText.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/);
    if (m) {
        // 将输入视为本地时间
        date = new Date(
            Number(m[1]), 
            Number(m[2]) - 1, 
            Number(m[3]), 
            Number(m[4]), 
            Number(m[5]), 
            Number(m[6]),
            m[7] ? Number(m[7].padEnd(3, '0')) : 0
        );
    }

    if (!date || isNaN(date.getTime())) {
        return '';
    }

    // 转换为UTC时间格式
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hour = pad(date.getUTCHours());
    const minute = pad(date.getUTCMinutes());
    const second = pad(date.getUTCSeconds());
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/**
 * 时间工具命令定义
 */
const timeCases: CommonCommand[] = [
    {
        command: 'common-tools.time.now-timestamp',
        title: 'Time: Current timestamp',
        message: 'Current timestamp generated',
        fn: getNowTimestamp,
        operationMode: CommandOperationMode.GENERATE,
        insertStrategy: InsertStrategy.INSERT
    },
    {
        command: 'common-tools.time.format.local-date',
        title: 'Time: Formatted YYYY-MM-DD',
        message: 'Date formatted successfully',
        fn: toLocalDate,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.time.format.local-datetime',
        title: 'Time: Formatted YYYY-MM-DD HH:mm:ss',
        message: 'Datetime formatted successfully',
        fn: toLocalDateTime,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.time.format.local-datetime-ms',
        title: 'Time: Formatted YYYY-MM-DD HH:mm:ss.SSS',
        message: 'Datetime (ms) formatted successfully',
        fn: toLocalDateTimeMs,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.time.parse-to-timestamp',
        title: 'Time: Parsed to timestamp',
        message: 'Parsed to timestamp',
        fn: toTimestamp,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.time.timezone-offset',
        title: 'Time: Apply timezone offset',
        message: 'Timezone offset applied',
        fn: applyTimezoneOffset,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.time.utc-to-local',
        title: 'Time: UTC to local time',
        message: 'Converted UTC to local time',
        fn: utcToLocal,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    },
    {
        command: 'common-tools.time.local-to-utc',
        title: 'Time: Local to UTC time',
        message: 'Converted local to UTC time',
        fn: localToUtc,
        operationMode: CommandOperationMode.TRANSFORM,
        insertStrategy: InsertStrategy.SMART
    }
];

/**
 * 注册时间工具命令
 */
export function registerTimeToolsCommands(context: vscode.ExtensionContext) {
    for (const command of timeCases) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command.command, async () => {
                try {
                    await CommandExecutor.execute(command);
                } catch (e) {
                    vscode.window.showErrorMessage(`Error: ${e instanceof Error ? e.message : String(e)}`);
                }
            })
        );
    }
}
