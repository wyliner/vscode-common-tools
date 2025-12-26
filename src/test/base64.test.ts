import * as assert from 'assert';
import { encodeBase64, decodeBase64, encodeBase64UrlSafe, decodeBase64UrlSafe } from '../commands/base64';

suite('Base64 工具测试套件', () => {
    suite('标准 Base64', () => {
        test('应该正确编码和解码中文英文混合', () => {
            const raw = 'hello world! 你好，世界！123';
            const encoded = encodeBase64(raw);
            const decoded = decodeBase64(encoded);
            assert.strictEqual(encoded, Buffer.from(raw, 'utf-8').toString('base64'));
            assert.strictEqual(decoded, raw);
        });

        test('应该处理空字符串', () => {
            assert.strictEqual(encodeBase64(''), '');
            assert.strictEqual(decodeBase64(''), '');
        });

        test('应该抛出非法 base64 字符串异常', () => {
            assert.throws(() => decodeBase64('!@#$%^'), /Invalid Base64/);
        });

        test('应该正确处理特殊字符', () => {
            const raw = '\0\n\r\t\u2603';
            const encoded = encodeBase64(raw);
            const decoded = decodeBase64(encoded);
            assert.strictEqual(decoded, raw);
        });
    });

    suite('Base64 URL Safe', () => {
        test('应该正确编码和解码（无 =、无 +/）', () => {
            const raw = 'hello world! 你好，世界！123';
            const encoded = encodeBase64UrlSafe(raw);
            const decoded = decodeBase64UrlSafe(encoded);
            assert.ok(!encoded.includes('+'));
            assert.ok(!encoded.includes('/'));
            assert.ok(!encoded.endsWith('='));
            assert.strictEqual(decoded, raw);
        });

        test('应该处理空字符串', () => {
            assert.strictEqual(encodeBase64UrlSafe(''), '');
            assert.strictEqual(decodeBase64UrlSafe(''), '');
        });

        test('应该抛出非法 base64 url safe 字符串异常', () => {
            assert.throws(() => decodeBase64UrlSafe('!@#$%^'), /Invalid Base64/);
        });

        test('应该正确处理特殊字符', () => {
            const raw = '\0\n\r\t\u2603';
            const encoded = encodeBase64UrlSafe(raw);
            const decoded = decodeBase64UrlSafe(encoded);
            assert.strictEqual(decoded, raw);
        });
    });

    suite('边界情况', () => {
        test('解码带多余 padding 的 base64', () => {
            const raw = 'test';
            const encoded = encodeBase64(raw) + '===';
            assert.strictEqual(decodeBase64(encoded), raw);
        });
        test('URL Safe 解码缺失 padding', () => {
            const raw = 'test';
            const encoded = encodeBase64UrlSafe(raw).replace(/=+$/, '');
            assert.strictEqual(decodeBase64UrlSafe(encoded), raw);
        });
        test('URL Safe 解码带 -_ 替换', () => {
            const raw = 'foo+/bar';
            const encoded = encodeBase64UrlSafe(raw);
            assert.ok(!encoded.includes('+'));
            assert.ok(!encoded.includes('/'));
            assert.strictEqual(decodeBase64UrlSafe(encoded), raw);
        });
    });
});
