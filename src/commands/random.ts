import * as vscode from 'vscode';

/**
 * 字符集定义
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

/**
 * 生成随机字符串
 * @param options 随机字符串生成选项
 * @returns 随机字符串
 */
function generateRandomString(options: RandomOptions): string {
    // 构建字符集
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
    
    // 如果没有选择任何字符集，默认使用数字
    if (charset === '') {
        charset = charSets.numbers;
    }
    
    // 生成随机字符串
    let result = '';
    const charsetLength = charset.length;
    for (let i = 0; i < options.length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength);
        result += charset[randomIndex];
    }
    return result;
}

/**
 * 获取用户自定义的随机字符串选项
 */
async function getRandomOptions(): Promise<RandomOptions | undefined> {
    // 默认选项
    const options: RandomOptions = {
        length: 16,
        useNumbers: true,
        useLowercase: true,
        useUppercase: true,
        useSymbols: true
    };

    // 询问长度
    const lengthInput = await vscode.window.showInputBox({
        prompt: 'Enter the length of random string',
        value: '16',
        validateInput: (value) => {
            const num = parseInt(value);
            return (!isNaN(num) && num > 0) ? null : 'Please enter a positive number';
        }
    });

    if (lengthInput === undefined) {
        return undefined; // 用户取消
    }
    
    options.length = parseInt(lengthInput);
    
    // 询问字符集
    const charsetSelection = await vscode.window.showQuickPick([
        { label: 'All Character Sets', picked: true, value: 'all' },
        { label: 'Custom Character Sets', value: 'custom' }
    ]);
    
    if (!charsetSelection) {
        return undefined; // 用户取消
    }
    
    if (charsetSelection.value === 'custom') {
        // 选择自定义字符集
        const selections = await vscode.window.showQuickPick([
            { label: 'Numbers (0-9)', picked: true, value: 'numbers' },
            { label: 'Lowercase Letters (a-z)', picked: true, value: 'lowercase' },
            { label: 'Uppercase Letters (A-Z)', picked: true, value: 'uppercase' },
            { label: 'Symbols (~!@#$%^&*()_+)', picked: true, value: 'symbols' }
        ], {
            canPickMany: true
        });
        
        if (!selections || selections.length === 0) {
            return undefined; // 用户取消或未选择任何选项
        }
        
        // 更新选项
        options.useNumbers = selections.some(item => item.value === 'numbers');
        options.useLowercase = selections.some(item => item.value === 'lowercase');
        options.useUppercase = selections.some(item => item.value === 'uppercase');
        options.useSymbols = selections.some(item => item.value === 'symbols');
    }
    
    return options;
}

/**
 * 注册随机数工具命令
 */
export function registerRandomToolsCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.random.generate', async () => {
            const editor = vscode.window.activeTextEditor;
            
            // 获取用户自定义选项
            const options = await getRandomOptions();
            if (!options) {
                return; // 用户取消操作
            }
            
            // 生成随机字符串
            const randomString = generateRandomString(options);

            // 如果没有编辑器打开，显示消息并返回
            if (!editor) {
                vscode.window.showInformationMessage(`Random string generated: ${randomString}`);
                return;
            }

            // 获取插入位置：光标位置或文档末尾
            const position = editor.selection.active || 
                             new vscode.Position(editor.document.lineCount - 1, 
                                               editor.document.lineAt(editor.document.lineCount - 1).text.length);
            
            // 插入随机字符串到指定位置
            await editor.edit(editBuilder => {
                editBuilder.insert(position, randomString);
            });
            
            vscode.window.showInformationMessage(`Random string inserted: ${randomString}`);
        })
    );
}
