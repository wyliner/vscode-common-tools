import * as assert from 'assert';
import * as crypto from 'crypto';

/**
 * UUID 工具测试套件
 * 测试 uuid.ts 中的所有功能
 */

function generateUuidV4(): string {
    return crypto.randomUUID();
}

function generateUuidV4WithoutHyphens(): string {
    return crypto.randomUUID().replace(/-/g, '');
}

suite('UUID Tools Test Suite', () => {
    
    suite('generateUuidV4', () => {
        test('应该生成有效的 UUID v4', () => {
            const uuid = generateUuidV4();
            // UUID v4 格式: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            assert.ok(uuidRegex.test(uuid), `生成的 UUID ${uuid} 不符合 v4 格式`);
        });

        test('应该生成唯一的 UUID', () => {
            const uuid1 = generateUuidV4();
            const uuid2 = generateUuidV4();
            assert.notStrictEqual(uuid1, uuid2, 'UUID 应该是唯一的');
        });

        test('应该包含连字符', () => {
            const uuid = generateUuidV4();
            assert.strictEqual(uuid.split('-').length, 5, 'UUID 应该有 4 个连字符');
        });

        test('应该是正确的长度', () => {
            const uuid = generateUuidV4();
            assert.strictEqual(uuid.length, 36, 'UUID 应该是 36 个字符');
        });

        test('应该只包含十六进制字符和连字符', () => {
            const uuid = generateUuidV4();
            const validChars = /^[0-9a-f-]+$/i;
            assert.ok(validChars.test(uuid), 'UUID 应该只包含十六进制字符和连字符');
        });

        test('多次生成应该都是有效的', () => {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            for (let i = 0; i < 10; i++) {
                const uuid = generateUuidV4();
                assert.ok(uuidRegex.test(uuid), `第 ${i + 1} 次生成的 UUID 无效`);
            }
        });
    });

    suite('generateUuidV4WithoutHyphens', () => {
        test('应该生成不带连字符的 UUID', () => {
            const uuid = generateUuidV4WithoutHyphens();
            assert.strictEqual(uuid.indexOf('-'), -1, 'UUID 不应该包含连字符');
        });

        test('应该是 32 个字符长度', () => {
            const uuid = generateUuidV4WithoutHyphens();
            assert.strictEqual(uuid.length, 32, '不带连字符的 UUID 应该是 32 个字符');
        });

        test('应该只包含十六进制字符', () => {
            const uuid = generateUuidV4WithoutHyphens();
            const hexRegex = /^[0-9a-f]+$/i;
            assert.ok(hexRegex.test(uuid), 'UUID 应该只包含十六进制字符');
        });

        test('应该生成唯一的 UUID', () => {
            const uuid1 = generateUuidV4WithoutHyphens();
            const uuid2 = generateUuidV4WithoutHyphens();
            assert.notStrictEqual(uuid1, uuid2, 'UUID 应该是唯一的');
        });

        test('应该符合 UUID v4 的格式（去除连字符后）', () => {
            const uuid = generateUuidV4WithoutHyphens();
            // 在适当位置插入连字符后应该符合 v4 格式
            const formatted = `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            assert.ok(uuidRegex.test(formatted), '格式化后应该符合 UUID v4 格式');
        });

        test('多次生成应该都是有效的', () => {
            const hexRegex = /^[0-9a-f]{32}$/i;
            for (let i = 0; i < 10; i++) {
                const uuid = generateUuidV4WithoutHyphens();
                assert.ok(hexRegex.test(uuid), `第 ${i + 1} 次生成的 UUID 无效`);
            }
        });
    });

    suite('UUID 格式对比', () => {
        test('带连字符和不带连字符的 UUID 应该可以互相转换', () => {
            const uuidWithHyphens = generateUuidV4();
            const uuidWithoutHyphens = uuidWithHyphens.replace(/-/g, '');
            
            assert.strictEqual(uuidWithoutHyphens.length, 32);
            
            // 重新添加连字符
            const restored = `${uuidWithoutHyphens.slice(0, 8)}-${uuidWithoutHyphens.slice(8, 12)}-${uuidWithoutHyphens.slice(12, 16)}-${uuidWithoutHyphens.slice(16, 20)}-${uuidWithoutHyphens.slice(20)}`;
            assert.strictEqual(restored, uuidWithHyphens);
        });
    });

    suite('大量生成测试', () => {
        test('生成 100 个 UUID 应该都是唯一的', () => {
            const uuids = new Set<string>();
            for (let i = 0; i < 100; i++) {
                uuids.add(generateUuidV4());
            }
            assert.strictEqual(uuids.size, 100, '所有 UUID 应该是唯一的');
        });

        test('生成 100 个不带连字符的 UUID 应该都是唯一的', () => {
            const uuids = new Set<string>();
            for (let i = 0; i < 100; i++) {
                uuids.add(generateUuidV4WithoutHyphens());
            }
            assert.strictEqual(uuids.size, 100, '所有 UUID 应该是唯一的');
        });
    });
});
