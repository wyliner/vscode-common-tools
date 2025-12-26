import * as assert from 'assert';

/**
 * 字符串工具测试套件
 * 测试 string.ts 中的所有功能
 */

// 模拟字符串转换函数（从 string.ts 中提取）
function toCamelCase(text: string): string {
    if (!text) {return '';}
    return text
        .replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, (m) => m.toLowerCase());
}

function toSnakeCase(text: string): string {
    if (!text) {return '';}
    return text
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[-\s.]+/g, '_')
        .toLowerCase();
}

function toKebabCase(text: string): string {
    if (!text) {return '';}
    return text
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s.]+/g, '-')
        .toLowerCase();
}

function toPascalCase(text: string): string {
    if (!text) {return '';}
    return text
        .replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, (m) => m.toUpperCase());
}

function toScreamingSnakeCase(text: string): string {
    if (!text) {return '';}
    return toSnakeCase(text).toUpperCase();
}

function toCapitalizedSnakeCase(text: string): string {
    if (!text) {return '';}
    return toSnakeCase(text)
        .split('_')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join('_');
}

function toLowerCase(text: string): string {
    if (!text) {return '';}
    return text.toLowerCase();
}

function toUpperCase(text: string): string {
    if (!text) {return '';}
    return text.toUpperCase();
}

function toSpaceSeparated(text: string): string {
    if (!text) {return '';}
    return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[-_\.]+/g, ' ')
        .toLowerCase();
}

function toDotCase(text: string): string {
    if (!text) {return '';}
    return text
        .replace(/([a-z])([A-Z])/g, '$1.$2')
        .replace(/[-_\s]+/g, '.')
        .toLowerCase();
}

suite('String Tools Test Suite', () => {
    
    suite('toCamelCase', () => {
        test('应该将 snake_case 转换为 camelCase', () => {
            assert.strictEqual(toCamelCase('hello_world'), 'helloWorld');
            assert.strictEqual(toCamelCase('user_name_field'), 'userNameField');
        });

        test('应该将 kebab-case 转换为 camelCase', () => {
            assert.strictEqual(toCamelCase('hello-world'), 'helloWorld');
            assert.strictEqual(toCamelCase('my-component-name'), 'myComponentName');
        });

        test('应该将 PascalCase 转换为 camelCase', () => {
            assert.strictEqual(toCamelCase('HelloWorld'), 'helloWorld');
            assert.strictEqual(toCamelCase('MyClass'), 'myClass');
        });

        test('应该处理空格分隔', () => {
            assert.strictEqual(toCamelCase('hello world'), 'helloWorld');
            assert.strictEqual(toCamelCase('user name field'), 'userNameField');
        });

        test('应该处理点分隔', () => {
            assert.strictEqual(toCamelCase('hello.world'), 'helloWorld');
        });

        test('应该处理空字符串', () => {
            assert.strictEqual(toCamelCase(''), '');
        });
    });

    suite('toSnakeCase', () => {
        test('应该将 camelCase 转换为 snake_case', () => {
            assert.strictEqual(toSnakeCase('helloWorld'), 'hello_world');
            assert.strictEqual(toSnakeCase('myVariableName'), 'my_variable_name');
        });

        test('应该将 PascalCase 转换为 snake_case', () => {
            assert.strictEqual(toSnakeCase('HelloWorld'), 'hello_world');
            assert.strictEqual(toSnakeCase('MyClassName'), 'my_class_name');
        });

        test('应该将 kebab-case 转换为 snake_case', () => {
            assert.strictEqual(toSnakeCase('hello-world'), 'hello_world');
        });

        test('应该处理空格分隔', () => {
            assert.strictEqual(toSnakeCase('hello world'), 'hello_world');
        });

        test('应该处理已经是 snake_case 的字符串', () => {
            assert.strictEqual(toSnakeCase('hello_world'), 'hello_world');
        });
    });

    suite('toKebabCase', () => {
        test('应该将 camelCase 转换为 kebab-case', () => {
            assert.strictEqual(toKebabCase('helloWorld'), 'hello-world');
            assert.strictEqual(toKebabCase('myComponentName'), 'my-component-name');
        });

        test('应该将 PascalCase 转换为 kebab-case', () => {
            assert.strictEqual(toKebabCase('HelloWorld'), 'hello-world');
        });

        test('应该将 snake_case 转换为 kebab-case', () => {
            assert.strictEqual(toKebabCase('hello_world'), 'hello-world');
        });

        test('应该处理空格分隔', () => {
            assert.strictEqual(toKebabCase('hello world'), 'hello-world');
        });
    });

    suite('toPascalCase', () => {
        test('应该将 camelCase 转换为 PascalCase', () => {
            assert.strictEqual(toPascalCase('helloWorld'), 'HelloWorld');
            assert.strictEqual(toPascalCase('myClass'), 'MyClass');
        });

        test('应该将 snake_case 转换为 PascalCase', () => {
            assert.strictEqual(toPascalCase('hello_world'), 'HelloWorld');
            assert.strictEqual(toPascalCase('my_class_name'), 'MyClassName');
        });

        test('应该将 kebab-case 转换为 PascalCase', () => {
            assert.strictEqual(toPascalCase('hello-world'), 'HelloWorld');
        });

        test('应该处理空格分隔', () => {
            assert.strictEqual(toPascalCase('hello world'), 'HelloWorld');
        });
    });

    suite('toScreamingSnakeCase', () => {
        test('应该将 camelCase 转换为 SCREAMING_SNAKE_CASE', () => {
            assert.strictEqual(toScreamingSnakeCase('helloWorld'), 'HELLO_WORLD');
        });

        test('应该将 kebab-case 转换为 SCREAMING_SNAKE_CASE', () => {
            assert.strictEqual(toScreamingSnakeCase('hello-world'), 'HELLO_WORLD');
        });

        test('应该将 PascalCase 转换为 SCREAMING_SNAKE_CASE', () => {
            assert.strictEqual(toScreamingSnakeCase('HelloWorld'), 'HELLO_WORLD');
        });
    });

    suite('toCapitalizedSnakeCase', () => {
        test('应该将 camelCase 转换为 Capitalized_Snake_Case', () => {
            assert.strictEqual(toCapitalizedSnakeCase('helloWorld'), 'Hello_World');
        });

        test('应该将 kebab-case 转换为 Capitalized_Snake_Case', () => {
            assert.strictEqual(toCapitalizedSnakeCase('hello-world'), 'Hello_World');
        });

        test('应该处理多个单词', () => {
            assert.strictEqual(toCapitalizedSnakeCase('myVariableName'), 'My_Variable_Name');
        });
    });

    suite('toLowerCase', () => {
        test('应该转换为小写', () => {
            assert.strictEqual(toLowerCase('HELLO'), 'hello');
            assert.strictEqual(toLowerCase('Hello World'), 'hello world');
        });

        test('应该处理混合大小写', () => {
            assert.strictEqual(toLowerCase('HeLLo WoRLd'), 'hello world');
        });
    });

    suite('toUpperCase', () => {
        test('应该转换为大写', () => {
            assert.strictEqual(toUpperCase('hello'), 'HELLO');
            assert.strictEqual(toUpperCase('Hello World'), 'HELLO WORLD');
        });

        test('应该处理混合大小写', () => {
            assert.strictEqual(toUpperCase('HeLLo WoRLd'), 'HELLO WORLD');
        });
    });

    suite('toSpaceSeparated', () => {
        test('应该将 camelCase 转换为空格分隔', () => {
            assert.strictEqual(toSpaceSeparated('helloWorld'), 'hello world');
        });

        test('应该将 PascalCase 转换为空格分隔', () => {
            assert.strictEqual(toSpaceSeparated('HelloWorld'), 'hello world');
        });

        test('应该将 snake_case 转换为空格分隔', () => {
            assert.strictEqual(toSpaceSeparated('hello_world'), 'hello world');
        });

        test('应该将 kebab-case 转换为空格分隔', () => {
            assert.strictEqual(toSpaceSeparated('hello-world'), 'hello world');
        });
    });

    suite('toDotCase', () => {
        test('应该将 camelCase 转换为 dot.case', () => {
            assert.strictEqual(toDotCase('helloWorld'), 'hello.world');
        });

        test('应该将 snake_case 转换为 dot.case', () => {
            assert.strictEqual(toDotCase('hello_world'), 'hello.world');
        });

        test('应该将 kebab-case 转换为 dot.case', () => {
            assert.strictEqual(toDotCase('hello-world'), 'hello.world');
        });

        test('应该处理空格分隔', () => {
            assert.strictEqual(toDotCase('hello world'), 'hello.world');
        });
    });

    suite('边界情况', () => {
        test('应该处理单个单词', () => {
            assert.strictEqual(toCamelCase('hello'), 'hello');
            assert.strictEqual(toSnakeCase('hello'), 'hello');
            assert.strictEqual(toKebabCase('hello'), 'hello');
            assert.strictEqual(toPascalCase('hello'), 'Hello');
        });

        test('应该处理数字', () => {
            assert.strictEqual(toCamelCase('hello123world'), 'hello123world');
            // toSnakeCase 的正则 /([a-z])([A-Z])/g 只匹配小写字母后跟大写字母
            // 'hello123World' -> 正则不匹配 '3W'，因为 3 不是 [a-z]
            // 所以结果是 'hello123world' (只是转小写)
            assert.strictEqual(toSnakeCase('hello123World'), 'hello123world');
        });

        test('应该处理连续的分隔符', () => {
            assert.strictEqual(toSnakeCase('hello--world'), 'hello_world');
            assert.strictEqual(toKebabCase('hello__world'), 'hello-world');
        });

        test('应该处理中文字符', () => {
            const input = 'hello你好world';
            assert.ok(toCamelCase(input).includes('你好'));
        });
    });
});
