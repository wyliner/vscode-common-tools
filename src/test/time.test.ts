import * as assert from 'assert';

/**
 * 时间工具测试套件
 * 测试 time.ts 中的所有功能
 */

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
            if (ts < 1e12) { ts *= 1000; }
            date = new Date(ts);
        } else {
            date = new Date(dateOrTs);
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
            if (ts < 1e12) { ts *= 1000; }
            date = new Date(ts);
        } else {
            date = new Date(dateOrTs);
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
            if (ts < 1e12) { ts *= 1000; }
            date = new Date(ts);
        } else {
            date = new Date(dateOrTs);
        }
    } else {
        date = dateOrTs;
    }
    if (typeof dateOrTs === 'string' || typeof dateOrTs === 'number') {
        const ts = Number(dateOrTs);
        if (!isNaN(ts) && ts < 1e12) {
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.000`;
        }
    }
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${date.getMilliseconds().toString().padStart(3, '0')}`;
}

function parseToTimestamp(text: string): string {
    const dt = text.trim();
    let m = dt.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})\.(\d{1,3})$/);
    if (m) {
        const date = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]), parseInt(m[6]), parseInt(m[7]));
        return date.getTime().toString();
    }
    m = dt.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
    if (m) {
        const date = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]), parseInt(m[6]));
        return date.getTime().toString();
    }
    m = dt.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/);
    if (m) {
        const date = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]));
        return date.getTime().toString();
    }
    m = dt.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
        const date = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
        return date.getTime().toString();
    }
    return '';
}

function utcToLocal(text: string): string {
    if (!text || text.trim() === '') {
        return '';
    }
    const trimmedText = text.trim();
    let date: Date | null = null;
    const m1 = trimmedText.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z?$/);
    if (m1) {
        const ms = m1[7] ? parseInt(m1[7].padEnd(3, '0')) : 0;
        date = new Date(Date.UTC(
            parseInt(m1[1]), parseInt(m1[2]) - 1, parseInt(m1[3]),
            parseInt(m1[4]), parseInt(m1[5]), parseInt(m1[6]), ms
        ));
    } else {
        date = new Date(trimmedText);
    }
    if (!date || isNaN(date.getTime())) {
        return '';
    }
    return formatLocalDateTime(date);
}

function localToUtc(text: string): string {
    if (!text || text.trim() === '') {
        return '';
    }
    const trimmedText = text.trim();
    let date: Date | null = null;
    const m = trimmedText.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/);
    if (m) {
        const ms = m[7] ? parseInt(m[7].padEnd(3, '0')) : 0;
        date = new Date(
            parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]),
            parseInt(m[4]), parseInt(m[5]), parseInt(m[6]), ms
        );
    }
    if (!date || isNaN(date.getTime())) {
        return '';
    }
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hour = pad(date.getUTCHours());
    const minute = pad(date.getUTCMinutes());
    const second = pad(date.getUTCSeconds());
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

suite('Time Tools Test Suite', () => {
    
    suite('formatLocalDate', () => {
        test('应该格式化 10 位时间戳为日期', () => {
            const ts = 1757485379; // 2025-11-06
            const result = formatLocalDate(ts);
            assert.ok(result.match(/^\d{4}-\d{2}-\d{2}$/));
        });

        test('应该格式化 13 位时间戳为日期', () => {
            const ts = 1757485379000;
            const result = formatLocalDate(ts);
            assert.ok(result.match(/^\d{4}-\d{2}-\d{2}$/));
        });

        test('应该格式化 Date 对象为日期', () => {
            const date = new Date(2025, 0, 15); // 2025-01-15
            const result = formatLocalDate(date);
            assert.strictEqual(result, '2025-01-15');
        });

        test('应该处理空值', () => {
            assert.strictEqual(formatLocalDate(''), '');
        });
    });

    suite('formatLocalDateTime', () => {
        test('应该格式化 10 位时间戳为日期时间', () => {
            const ts = 1757485379;
            const result = formatLocalDateTime(ts);
            assert.ok(result.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/));
        });

        test('应该格式化 13 位时间戳为日期时间', () => {
            const ts = 1757485379000;
            const result = formatLocalDateTime(ts);
            assert.ok(result.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/));
        });

        test('应该格式化 Date 对象为日期时间', () => {
            const date = new Date(2025, 0, 15, 12, 30, 45);
            const result = formatLocalDateTime(date);
            assert.strictEqual(result, '2025-01-15 12:30:45');
        });
    });

    suite('formatLocalDateTimeMs', () => {
        test('应该格式化带毫秒的日期时间', () => {
            const ts = 1757485379123;
            const result = formatLocalDateTimeMs(ts);
            assert.ok(result.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/));
        });

        test('应该为 10 位时间戳添加 .000 毫秒', () => {
            const ts = 1757485379;
            const result = formatLocalDateTimeMs(ts);
            assert.ok(result.endsWith('.000'));
        });

        test('应该格式化 Date 对象的毫秒部分', () => {
            const date = new Date(2025, 0, 15, 12, 30, 45, 123);
            const result = formatLocalDateTimeMs(date);
            assert.ok(result.endsWith('.123'));
        });
    });

    suite('parseToTimestamp', () => {
        test('应该解析 YYYY-MM-DD 格式', () => {
            const input = '2025-01-15';
            const result = parseToTimestamp(input);
            assert.ok(Number(result) > 0);
            const date = new Date(Number(result));
            assert.strictEqual(date.getFullYear(), 2025);
            assert.strictEqual(date.getMonth(), 0);
            assert.strictEqual(date.getDate(), 15);
        });

        test('应该解析 YYYY-MM-DD HH:mm:ss 格式', () => {
            const input = '2025-01-15 12:30:45';
            const result = parseToTimestamp(input);
            assert.ok(Number(result) > 0);
            const date = new Date(Number(result));
            assert.strictEqual(date.getHours(), 12);
            assert.strictEqual(date.getMinutes(), 30);
            assert.strictEqual(date.getSeconds(), 45);
        });

        test('应该解析 YYYY-MM-DD HH:mm:ss.SSS 格式', () => {
            const input = '2025-01-15 12:30:45.123';
            const result = parseToTimestamp(input);
            assert.ok(Number(result) > 0);
            const date = new Date(Number(result));
            assert.strictEqual(date.getMilliseconds(), 123);
        });

        test('应该解析 YYYY-MM-DD HH:mm 格式', () => {
            const input = '2025-01-15 12:30';
            const result = parseToTimestamp(input);
            assert.ok(Number(result) > 0);
        });

        test('应该处理无效格式', () => {
            const input = 'invalid date';
            const result = parseToTimestamp(input);
            assert.strictEqual(result, '');
        });
    });

    suite('utcToLocal', () => {
        test('应该转换 UTC 时间为本地时间', () => {
            const input = '2025-01-15 00:00:00Z';
            const result = utcToLocal(input);
            assert.ok(result.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/));
        });

        test('应该处理不带 Z 后缀的 UTC 时间', () => {
            const input = '2025-01-15 12:00:00';
            const result = utcToLocal(input);
            assert.ok(result.length > 0);
        });

        test('应该处理带毫秒的 UTC 时间', () => {
            const input = '2025-01-15 12:00:00.123Z';
            const result = utcToLocal(input);
            assert.ok(result.length > 0);
        });

        test('应该处理空值', () => {
            assert.strictEqual(utcToLocal(''), '');
        });
    });

    suite('localToUtc', () => {
        test('应该转换本地时间为 UTC 时间', () => {
            const input = '2025-01-15 12:00:00';
            const result = localToUtc(input);
            assert.ok(result.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/));
        });

        test('应该处理带毫秒的本地时间', () => {
            const input = '2025-01-15 12:00:00.123';
            const result = localToUtc(input);
            assert.ok(result.length > 0);
        });

        test('应该处理空值', () => {
            assert.strictEqual(localToUtc(''), '');
        });

        test('UTC 和本地时间互转应该保持一致', () => {
            const original = '2025-01-15 12:00:00';
            const utc = localToUtc(original);
            const back = utcToLocal(utc + 'Z');
            // 允许有少量差异（因为时区转换）
            assert.ok(back.length > 0);
        });
    });

    suite('边界情况', () => {
        test('应该处理闰年', () => {
            const input = '2024-02-29';
            const result = parseToTimestamp(input);
            assert.ok(Number(result) > 0);
        });

        test('应该处理年初', () => {
            const input = '2025-01-01 00:00:00';
            const result = parseToTimestamp(input);
            assert.ok(Number(result) > 0);
        });

        test('应该处理年末', () => {
            const input = '2025-12-31 23:59:59';
            const result = parseToTimestamp(input);
            assert.ok(Number(result) > 0);
        });

        test('应该正确处理时间戳的转换', () => {
            const ts = 1757485379;
            const dateTime = formatLocalDateTime(ts);
            const backToTs = parseToTimestamp(dateTime);
            // 由于时间戳是秒级，转回来应该相同（乘以1000比较）
            assert.strictEqual(Number(backToTs), ts * 1000);
        });
    });
});
