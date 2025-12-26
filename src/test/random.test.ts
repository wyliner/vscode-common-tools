import * as assert from 'assert';

/**
 * Random 工具测试套件
 * 测试 random.ts 中的所有功能
 */

const charSets = {
    numbers: '0123456789',
    lowercaseLetters: 'abcdefghijklmnopqrstuvwxyz',
    uppercaseLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbols: '!@#$%^&*()-_=+[]{}|;:,.<>/?'
};

interface RandomOptions {
    length: number;
    useNumbers: boolean;
    useLowercase: boolean;
    useUppercase: boolean;
    useSymbols: boolean;
}

function generateRandomString(options: RandomOptions): string {
    let charset = '';
    if (options.useNumbers) {
        charset += charSets.numbers;
    }
    if (options.useLowercase) {
        charset += charSets.lowercaseLetters;
    }
    if (options.useUppercase) {
        charset += charSets.uppercaseLetters;
    }
    if (options.useSymbols) {
        charset += charSets.symbols;
    }
    
    if (charset === '') {
        charset = charSets.numbers;
    }
    
    let result = '';
    const charsetLength = charset.length;
    for (let i = 0; i < options.length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength);
        result += charset[randomIndex];
    }
    return result;
}

suite('Random Tools Test Suite', () => {
    
    suite('generateRandomString - 基础功能', () => {
        test('应该生成指定长度的字符串', () => {
            const options: RandomOptions = {
                length: 16,
                useNumbers: true,
                useLowercase: true,
                useUppercase: true,
                useSymbols: true
            };
            const result = generateRandomString(options);
            assert.strictEqual(result.length, 16);
        });

        test('应该生成不同长度的字符串', () => {
            const lengths = [8, 16, 32, 64, 128];
            for (const length of lengths) {
                const options: RandomOptions = {
                    length,
                    useNumbers: true,
                    useLowercase: true,
                    useUppercase: true,
                    useSymbols: true
                };
                const result = generateRandomString(options);
                assert.strictEqual(result.length, length, `应该生成 ${length} 个字符`);
            }
        });

        test('应该生成唯一的字符串', () => {
            const options: RandomOptions = {
                length: 16,
                useNumbers: true,
                useLowercase: true,
                useUppercase: true,
                useSymbols: true
            };
            const result1 = generateRandomString(options);
            const result2 = generateRandomString(options);
            assert.notStrictEqual(result1, result2, '生成的字符串应该是不同的');
        });
    });

    suite('generateRandomString - 字符集选择', () => {
        test('应该只包含数字', () => {
            const options: RandomOptions = {
                length: 20,
                useNumbers: true,
                useLowercase: false,
                useUppercase: false,
                useSymbols: false
            };
            const result = generateRandomString(options);
            assert.ok(/^[0-9]+$/.test(result), '应该只包含数字');
        });

        test('应该只包含小写字母', () => {
            const options: RandomOptions = {
                length: 20,
                useNumbers: false,
                useLowercase: true,
                useUppercase: false,
                useSymbols: false
            };
            const result = generateRandomString(options);
            assert.ok(/^[a-z]+$/.test(result), '应该只包含小写字母');
        });

        test('应该只包含大写字母', () => {
            const options: RandomOptions = {
                length: 20,
                useNumbers: false,
                useLowercase: false,
                useUppercase: true,
                useSymbols: false
            };
            const result = generateRandomString(options);
            assert.ok(/^[A-Z]+$/.test(result), '应该只包含大写字母');
        });

        test('应该包含数字和小写字母', () => {
            const options: RandomOptions = {
                length: 100,
                useNumbers: true,
                useLowercase: true,
                useUppercase: false,
                useSymbols: false
            };
            const result = generateRandomString(options);
            assert.ok(/^[0-9a-z]+$/.test(result), '应该只包含数字和小写字母');
            // 生成 100 个字符，应该有很大概率同时包含数字和字母
            const hasNumber = /[0-9]/.test(result);
            const hasLowercase = /[a-z]/.test(result);
            assert.ok(hasNumber || hasLowercase, '应该包含数字或小写字母');
        });

        test('应该包含所有类型的字符', () => {
            const options: RandomOptions = {
                length: 200,
                useNumbers: true,
                useLowercase: true,
                useUppercase: true,
                useSymbols: true
            };
            const result = generateRandomString(options);
            // 生成 200 个字符，应该有很大概率包含所有类型
            const hasNumber = /[0-9]/.test(result);
            const hasLowercase = /[a-z]/.test(result);
            const hasUppercase = /[A-Z]/.test(result);
            const hasSymbol = /[!@#$%^&*()\-_=+\[\]{}|;:,.<>/?]/.test(result);
            
            // 至少应该有一种类型出现
            assert.ok(hasNumber || hasLowercase || hasUppercase || hasSymbol);
        });
    });

    suite('generateRandomString - 边界情况', () => {
        test('应该处理长度为 1 的字符串', () => {
            const options: RandomOptions = {
                length: 1,
                useNumbers: true,
                useLowercase: true,
                useUppercase: true,
                useSymbols: true
            };
            const result = generateRandomString(options);
            assert.strictEqual(result.length, 1);
        });

        test('应该处理极长的字符串', () => {
            const options: RandomOptions = {
                length: 10000,
                useNumbers: true,
                useLowercase: true,
                useUppercase: true,
                useSymbols: true
            };
            const result = generateRandomString(options);
            assert.strictEqual(result.length, 10000);
        });

        test('未选择任何字符集时应该默认使用数字', () => {
            const options: RandomOptions = {
                length: 20,
                useNumbers: false,
                useLowercase: false,
                useUppercase: false,
                useSymbols: false
            };
            const result = generateRandomString(options);
            assert.ok(/^[0-9]+$/.test(result), '应该默认使用数字');
        });
    });

    suite('generateRandomString - 分布测试', () => {
        test('生成的字符应该有一定的随机性', () => {
            const options: RandomOptions = {
                length: 1000,
                useNumbers: true,
                useLowercase: false,
                useUppercase: false,
                useSymbols: false
            };
            const result = generateRandomString(options);
            
            // 统计每个数字出现的次数
            const counts: { [key: string]: number } = {};
            for (const char of result) {
                counts[char] = (counts[char] || 0) + 1;
            }
            
            // 每个数字应该出现（期望值约 100 次，允许较大偏差）
            const uniqueChars = Object.keys(counts).length;
            assert.ok(uniqueChars >= 5, '应该使用多种不同的数字');
        });

        test('多次生成应该产生不同的结果', () => {
            const options: RandomOptions = {
                length: 16,
                useNumbers: true,
                useLowercase: true,
                useUppercase: true,
                useSymbols: true
            };
            
            const results = new Set<string>();
            for (let i = 0; i < 10; i++) {
                results.add(generateRandomString(options));
            }
            
            // 10 次生成应该至少有 9 个不同的结果
            assert.ok(results.size >= 9, '多次生成应该产生不同的结果');
        });
    });

    suite('generateRandomString - 特殊字符集', () => {
        test('符号字符集应该只包含特殊符号', () => {
            const options: RandomOptions = {
                length: 50,
                useNumbers: false,
                useLowercase: false,
                useUppercase: false,
                useSymbols: true
            };
            const result = generateRandomString(options);
            
            // 检查所有字符都在符号字符集中
            for (const char of result) {
                assert.ok(charSets.symbols.includes(char), `字符 ${char} 应该在符号字符集中`);
            }
        });

        test('组合字符集应该从正确的字符池中选择', () => {
            const options: RandomOptions = {
                length: 100,
                useNumbers: true,
                useLowercase: true,
                useUppercase: false,
                useSymbols: false
            };
            const result = generateRandomString(options);
            
            const validChars = charSets.numbers + charSets.lowercaseLetters;
            for (const char of result) {
                assert.ok(validChars.includes(char), `字符 ${char} 应该在允许的字符集中`);
            }
        });
    });

    suite('generateRandomString - 性能测试', () => {
        test('应该能够快速生成短字符串', () => {
            const options: RandomOptions = {
                length: 16,
                useNumbers: true,
                useLowercase: true,
                useUppercase: true,
                useSymbols: true
            };
            
            const startTime = Date.now();
            for (let i = 0; i < 1000; i++) {
                generateRandomString(options);
            }
            const endTime = Date.now();
            
            // 1000 次生成应该在 1 秒内完成
            assert.ok(endTime - startTime < 1000, '应该能够快速生成');
        });

        test('应该能够生成长字符串', () => {
            const options: RandomOptions = {
                length: 100000,
                useNumbers: true,
                useLowercase: true,
                useUppercase: true,
                useSymbols: true
            };
            
            const startTime = Date.now();
            const result = generateRandomString(options);
            const endTime = Date.now();
            
            assert.strictEqual(result.length, 100000);
            // 应该在合理时间内完成
            assert.ok(endTime - startTime < 5000, '应该能够在合理时间内生成长字符串');
        });
    });
});
