import * as assert from 'assert';

/**
 * JSON 工具测试套件
 * 测试 json.ts 中的所有功能
 */

// 模拟 JSON 工具函数（从 json.ts 中提取核心逻辑）
function extractJson(text: string): string {
    if (!text) {
        return '';
    }
    
    text = text.trim();
    
    // 特殊情况：如果整个字符串被引号包裹，可能是一个转义的JSON字符串
    // 例如: "{\\"key\\":\\"value\\"}"
    if ((text.startsWith('"') && text.endsWith('"')) || 
        (text.startsWith("'") && text.endsWith("'"))) {
        // 先尝试作为JSON字符串解析
        try {
            const parsed = JSON.parse(text);
            if (typeof parsed === 'string') {
                // 成功解析为字符串，返回解析后的内容
                return parsed;
            }
        } catch {
            // 不是有效的JSON字符串，继续正常提取
        }
    }
    
    // 尝试找到JSON的起始位置（{ 或 [）
    const jsonStartChars = ['{', '['];
    let jsonStart = -1;
    
    for (const char of jsonStartChars) {
        const index = text.indexOf(char);
        if (index !== -1 && (jsonStart === -1 || index < jsonStart)) {
            jsonStart = index;
        }
    }
    
    // 如果找到了JSON起始符号，从该位置开始提取
    if (jsonStart > 0) {
        text = text.substring(jsonStart);
    } else if (jsonStart === -1) {
        // 没有找到JSON起始符号，返回原文本
        return text;
    }
    
    // 尝试找到JSON的结束位置（} 或 ]）
    // 需要匹配对应的括号
    if (text.startsWith('{')) {
        let depth = 0;
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"' && !escapeNext) {
                inString = !inString;
                continue;
            }
            
            if (!inString) {
                if (char === '{') {
                    depth++;
                } else if (char === '}') {
                    depth--;
                    if (depth === 0) {
                        text = text.substring(0, i + 1);
                        break;
                    }
                }
            }
        }
    } else if (text.startsWith('[')) {
        let depth = 0;
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"' && !escapeNext) {
                inString = !inString;
                continue;
            }
            
            if (!inString) {
                if (char === '[') {
                    depth++;
                } else if (char === ']') {
                    depth--;
                    if (depth === 0) {
                        text = text.substring(0, i + 1);
                        break;
                    }
                }
            }
        }
    }
    
    return text;
}

function preprocessEnhanced(text: string): string {
    if (!text) {
        return '';
    }
    
    // 首先提取JSON内容
    text = extractJson(text);
    
    text = text.trim();
    text = text.replace(/^[,\s]+|[,\s]+$/g, '');
    
    if ((text.startsWith('"') && text.endsWith('"')) || 
        (text.startsWith("'") && text.endsWith("'"))) {
        try {
            const parsed = JSON.parse(text);
            if (typeof parsed === 'string') {
                text = parsed;
            }
        } catch {
            text = text.slice(1, -1);
            text = text.replace(/\\"/g, '"')
                      .replace(/\\'/g, "'")
                      .replace(/\\\\/g, '\\')
                      .replace(/\\n/g, '\n')
                      .replace(/\\r/g, '\r')
                      .replace(/\\t/g, '\t');
        }
    }
    
    if (text.includes("'")) {
        text = text.replace(/'([^']+)':/g, '"$1":');
        text = text.replace(/:\s*'([^']*)'/g, ': "$1"');
        text = text.replace(/\[\s*'([^']*)'/g, '["$1"');
        text = text.replace(/,\s*'([^']*)'/g, ',"$1"');
    }
    
    return text.trim();
}

function deepFormat(obj: any): any {
    if (typeof obj === 'string') {
        try {
            const parsed = JSON.parse(obj);
            if (typeof parsed === 'object' && parsed !== null) {
                return deepFormat(parsed);
            }
            return parsed;
        } catch {
            return obj;
        }
    } else if (Array.isArray(obj)) {
        return obj.map(deepFormat);
    } else if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            result[key] = deepFormat(obj[key]);
        }
        return result;
    }
    return obj;
}

function formatJson(text: string): string {
    if (!text) {
        return '';
    }
    return JSON.stringify(JSON.parse(preprocessEnhanced(text)), null, 2);
}

function deepFormatJson(text: string): string {
    if (!text) {
        return '';
    }
    const obj = JSON.parse(preprocessEnhanced(text));
    const formatted = deepFormat(obj);
    return JSON.stringify(formatted, null, 4);
}

function compressJson(text: string): string {
    if (!text) {
        return '';
    }
    // 首先提取JSON内容，然后去除前后空白和逗号
    const extracted = extractJson(text);
    return JSON.stringify(JSON.parse(extracted.trim().replace(/^[,\s]+|[,\s]+$/g, '')));
}

suite('JSON Tools Test Suite', () => {
    
    suite('formatJson', () => {
        test('应该格式化普通 JSON 对象', () => {
            const input = '{"state":{"desired":{"pendingActions":[{"action":"bRemoveAllUsers","id":"dRmFNDw98jLcH9","ts":1757485379}]},"reported":null},"version":101}';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.version, 101);
            assert.strictEqual(parsed.state.desired.pendingActions[0].action, 'bRemoveAllUsers');
        });

        test('应该处理带引号的转义 JSON 字符串', () => {
            const input = '"{\\\"state\\\":{\\\"desired\\\":{\\\"pendingActions\\\":[{\\\"action\\\":\\\"bRemoveAllUsers\\\",\\\"id\\\":\\\"dRmFNDw98jLcH9\\\",\\\"ts\\\":1757485379}]},\\\"reported\\\":null},\\\"version\\\":101}"';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.version, 101);
            assert.strictEqual(parsed.state.desired.pendingActions[0].action, 'bRemoveAllUsers');
        });

        test('应该去除前后空白', () => {
            const input = '  {"name":"test"}  ';
            const result = formatJson(input);
            assert.ok(result.includes('"name"'));
        });

        test('应该处理空字符串', () => {
            const result = formatJson('');
            assert.strictEqual(result, '');
        });

        test('应该处理单引号 JSON', () => {
            const input = "{'name':'test','value':123}";
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.name, 'test');
            assert.strictEqual(parsed.value, 123);
        });
    });

    suite('deepFormatJson', () => {
        test('应该深度格式化嵌套的 JSON 字符串', () => {
            const input = '{"state":{"reported":"{\\"state\\":{\\"desired\\":{\\"pendingActions\\":[{\\"action\\":\\"bRemoveAllUsers\\",\\"id\\":\\"dRmFNDw98jLcH9\\",\\"ts\\":1757485379}]},\\"reported\\":null},\\"version\\":101}"},"version":101}';
            const result = deepFormatJson(input);
            const parsed = JSON.parse(result);
            
            // 验证外层结构
            assert.strictEqual(parsed.version, 101);
            
            // 验证内层已经被解析
            assert.strictEqual(typeof parsed.state.reported, 'object');
            assert.strictEqual(parsed.state.reported.version, 101);
            assert.strictEqual(parsed.state.reported.state.desired.pendingActions[0].action, 'bRemoveAllUsers');
        });

        test('应该处理数组中的 JSON 字符串', () => {
            const input = '{"items":["{\\"id\\":1}","{\\"id\\":2}"]}';
            const result = deepFormatJson(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.items[0], 'object');
            assert.strictEqual(parsed.items[0].id, 1);
            assert.strictEqual(parsed.items[1].id, 2);
        });

        test('应该保留非 JSON 字符串不变', () => {
            const input = '{"text":"plain text","number":42}';
            const result = deepFormatJson(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(parsed.text, 'plain text');
            assert.strictEqual(parsed.number, 42);
        });

        test('应该处理多层嵌套', () => {
            const input = '{"level1":"{\\"level2\\":\\"{\\\\\\"level3\\\\\\":\\\\\\"value\\\\\\"}\\"}"}';
            const result = deepFormatJson(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.level1, 'object');
            assert.strictEqual(typeof parsed.level1.level2, 'object');
            assert.strictEqual(parsed.level1.level2.level3, 'value');
        });
    });

    suite('compressJson', () => {
        test('应该压缩格式化的 JSON', () => {
            const input = `{
                "name": "test",
                "value": 123
            }`;
            const result = compressJson(input);
            assert.strictEqual(result, '{"name":"test","value":123}');
        });

        test('应该处理数组', () => {
            const input = `[
                1,
                2,
                3
            ]`;
            const result = compressJson(input);
            assert.strictEqual(result, '[1,2,3]');
        });

        test('应该处理复杂嵌套结构', () => {
            const input = `{
                "data": {
                    "items": [1, 2, 3]
                }
            }`;
            const result = compressJson(input);
            assert.strictEqual(result, '{"data":{"items":[1,2,3]}}');
        });
    });

    suite('preprocessEnhanced', () => {
        test('应该去除前后空白和逗号', () => {
            const input = '  ,{"name":"test"},  ';
            const result = preprocessEnhanced(input);
            assert.strictEqual(result, '{"name":"test"}');
        });

        test('应该处理转义字符', () => {
            const input = '"{\\\"key\\\":\\\"value\\\"}"';
            const result = preprocessEnhanced(input);
            assert.strictEqual(result, '{"key":"value"}');
        });

        test('应该转换单引号为双引号', () => {
            const input = "{'key':'value'}";
            const result = preprocessEnhanced(input);
            assert.ok(result.includes('"key"'));
            assert.ok(result.includes('"value"'));
        });

        test('应该处理反斜杠转义', () => {
            const input = '"line1\\nline2"';
            const result = preprocessEnhanced(input);
            assert.ok(result.includes('\n'));
        });
    });

    suite('deepFormat', () => {
        test('应该递归解析对象中的 JSON 字符串', () => {
            const input = {
                data: '{"nested":"value"}',
                number: 42
            };
            const result = deepFormat(input);
            
            assert.strictEqual(typeof result.data, 'object');
            assert.strictEqual(result.data.nested, 'value');
            assert.strictEqual(result.number, 42);
        });

        test('应该处理数组', () => {
            const input = ['{"id":1}', '{"id":2}', 'plain'];
            const result = deepFormat(input);
            
            assert.strictEqual(typeof result[0], 'object');
            assert.strictEqual(result[0].id, 1);
            assert.strictEqual(result[1].id, 2);
            assert.strictEqual(result[2], 'plain');
        });

        test('应该保留原始类型', () => {
            const input = {
                string: 'text',
                number: 123,
                boolean: true,
                null: null,
                array: [1, 2, 3]
            };
            const result = deepFormat(input);
            
            assert.strictEqual(result.string, 'text');
            assert.strictEqual(result.number, 123);
            assert.strictEqual(result.boolean, true);
            assert.strictEqual(result.null, null);
            assert.deepStrictEqual(result.array, [1, 2, 3]);
        });
    });

    suite('边界情况', () => {
        test('应该处理空对象', () => {
            const input = '{}';
            const result = formatJson(input);
            assert.strictEqual(result, '{}');
        });

        test('应该处理空数组', () => {
            const input = '[]';
            const result = formatJson(input);
            assert.strictEqual(result, '[]');
        });

        test('应该处理包含特殊字符的字符串', () => {
            const input = '{"text":"Hello\\nWorld\\t!"}';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.ok(parsed.text.includes('\n'));
            assert.ok(parsed.text.includes('\t'));
        });

        test('应该处理 Unicode 字符', () => {
            const input = '{"chinese":"你好","emoji":"😀"}';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.chinese, '你好');
            assert.strictEqual(parsed.emoji, '😀');
        });

        test('应该处理大数字', () => {
            const input = '{"timestamp":1757485379000}';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.timestamp, 1757485379000);
        });
    });

    suite('前缀文本处理', () => {
        test('应该忽略前缀文本，只格式化JSON部分', () => {
            const input = 'API Response Data: {"status":200,"user_id":"USER_12345"}';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.status, 200);
            assert.strictEqual(parsed.user_id, 'USER_12345');
        });

        test('应该处理复杂前缀文本和嵌套JSON', () => {
            const input = 'API Response Data: {"status":200,"user_id":"USER_12345","user_name":"John Doe","profile":{"email":"john@example.com","preferences":{"notifications":[{"type":"email","enabled":true,"frequency":"daily"}]},"created_at":1765873821}}';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.status, 200);
            assert.strictEqual(parsed.user_name, 'John Doe');
            assert.strictEqual(parsed.profile.email, 'john@example.com');
            assert.ok(parsed.profile);
            assert.ok(Array.isArray(parsed.profile.preferences.notifications));
            assert.strictEqual(parsed.profile.preferences.notifications[0].type, 'email');
        });

        test('应该处理后缀文本', () => {
            const input = '{"status":"ok"} - Response received';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.status, 'ok');
        });

        test('应该处理前后都有非JSON文本', () => {
            const input = 'Log entry: {"level":"info","message":"test"} at 2025-12-16';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.level, 'info');
            assert.strictEqual(parsed.message, 'test');
        });

        test('应该处理数组格式的JSON带前缀', () => {
            const input = 'Array data: [1, 2, 3, {"key": "value"}]';
            const result = formatJson(input);
            const parsed = JSON.parse(result);
            assert.ok(Array.isArray(parsed));
            assert.strictEqual(parsed.length, 4);
            assert.strictEqual(parsed[3].key, 'value');
        });

        test('深度格式化应该也支持前缀文本', () => {
            const input = 'Data: {"nested":"{\\"inner\\":\\"value\\"}"}';
            const result = deepFormatJson(input);
            const parsed = JSON.parse(result);
            assert.ok(parsed.nested);
            assert.strictEqual(parsed.nested.inner, 'value');
        });

        test('压缩格式应该也支持前缀文本', () => {
            const input = 'Request: {"a": 1, "b": 2}';
            const result = compressJson(input);
            assert.strictEqual(result, '{"a":1,"b":2}');
        });
    });
});

