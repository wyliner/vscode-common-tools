import * as vscode from 'vscode';
import { CommonCommand, CommandOperationMode, InsertStrategy } from '../types/command';
import { recordCommandExecution } from '../commands/last';

/**
 * 命令执行器类
 * 提供通用的命令执行逻辑，支持不同操作模式和插入策略
 */
export class CommandExecutor {
    /**
     * 执行命令
     * @param command 要执行的命令
     * @returns 执行结果的Promise
     */
    public static async execute(command: CommonCommand): Promise<void> {
        // 记录命令执行
        recordCommandExecution(command.command, command.title);

        // 根据操作模式决定如何处理
        let result: string;

        try {
            const editor = vscode.window.activeTextEditor;
            const selectedText = editor ? editor.document.getText(editor.selection) : '';
            // 转换模式且没有选中文本时，提示警告
            if (command.operationMode === CommandOperationMode.TRANSFORM) {
                if (!editor || editor.selection.isEmpty) {
                    vscode.window.showWarningMessage('No text selected for transformation');
                    return;
                }
                // 进一步判断选中文本是否全为空白
                if (!selectedText || selectedText.trim() === '') {
                    vscode.window.showWarningMessage('Selected text is empty or whitespace');
                    return;
                }
            }

            // 执行命令函数获取结果，支持异步和同步函数
            const functionResult = command.fn(selectedText);

            // 处理 Promise 返回值
            if (functionResult instanceof Promise) {
                result = await functionResult;
            } else {
                result = functionResult;
            }

            // 如果结果为空且是转换模式，显示警告
            if (result === '' && command.operationMode === CommandOperationMode.TRANSFORM) {
                vscode.window.showWarningMessage('Transformation resulted in empty string');
                return;
            }
        } catch (e) {
            vscode.window.showErrorMessage(`Error: ${e instanceof Error ? e.message : String(e)}`);
            return;
        }

        const editor = vscode.window.activeTextEditor;

        // 如果没有编辑器打开，并且是生成模式，则复制到剪贴板
        if (!editor && command.operationMode === CommandOperationMode.GENERATE) {
            vscode.env.clipboard.writeText(result);
            vscode.window.showInformationMessage(`${command.title} copied to clipboard: ${result}`);
            return;
        }

        // 如果没有编辑器，且不是生成模式，显示错误
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        // 根据插入策略处理文本
        await CommandExecutor.applyTextEdit(editor, result, command);

        // 显示成功消息
        vscode.window.showInformationMessage(command.message);
    }

    /**
     * 根据命令的插入策略应用文本编辑
     * @param editor 活动编辑器
     * @param text 要插入或替换的文本
     * @param command 命令定义
     */
    private static async applyTextEdit(editor: vscode.TextEditor, text: string, command: CommonCommand): Promise<void> {
        await editor.edit(editBuilder => {
            const strategy = command.insertStrategy || InsertStrategy.SMART; // 默认使用智能策略

            switch (strategy) {
                case InsertStrategy.REPLACE:
                    if (editor.selection.isEmpty) {
                        // 替换整个文档
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(editor.document.getText().length)
                        );
                        editBuilder.replace(fullRange, text);
                    } else {
                        // 替换选中文本
                        editBuilder.replace(editor.selection, text);
                    }
                    break;

                case InsertStrategy.INSERT:
                    if (editor.selection.isEmpty) {
                        // 如果没有选中文本，查看是否有光标
                        if (editor.selection.active) {
                            // 有光标，插入到光标后面
                            const position = editor.selection.active;

                            // 判断光标前面的字符是否为文本（不是空格或换行）
                            let insertPrefix = '';
                            if (position.character > 0) {
                                // 获取光标前面的字符
                                const rangeBeforeCursor = new vscode.Range(
                                    new vscode.Position(position.line, position.character - 1),
                                    position
                                );
                                const charBeforeCursor = editor.document.getText(rangeBeforeCursor);

                                // 如果光标前是文本字符（非空格、换行等），则添加空格
                                if (charBeforeCursor.trim() !== '') {
                                    insertPrefix = ' ';
                                }
                            }

                            editBuilder.insert(position, insertPrefix + text);
                        } else {
                            // 没有光标，插入到文档最后并换行
                            const lastLine = editor.document.lineCount - 1;
                            const lastPosition = new vscode.Position(
                                lastLine,
                                editor.document.lineAt(lastLine).text.length
                            );
                            editBuilder.insert(lastPosition, '\n' + text);
                        }
                    } else {
                        // 有选中文本，插入到选中文本后面
                        const position = editor.selection.end;
                        editBuilder.insert(position, text);
                    }
                    break;

                case InsertStrategy.SMART:
                    if (editor.selection.isEmpty) {
                        // 没有选中文本，插入到光标位置
                        const position = editor.selection.active ||
                            new vscode.Position(
                                editor.document.lineCount - 1,
                                editor.document.lineAt(editor.document.lineCount - 1).text.length
                            );
                        editBuilder.insert(position, text);
                    } else {
                        // 有选中文本，替换它
                        editBuilder.replace(editor.selection, text);
                    }
                    break;

                default:
                    // 默认使用插入策略
                    const position = editor.selection.active ||
                        new vscode.Position(
                            editor.document.lineCount - 1,
                            editor.document.lineAt(editor.document.lineCount - 1).text.length
                        );
                    editBuilder.insert(position, text);
            }
        });
    }
}
