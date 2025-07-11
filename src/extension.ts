// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerJsonToolsCommands } from './commands/json';
import { registerTimeToolsCommands } from './commands/time';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// 注册 JSON 相关命令
	registerJsonToolsCommands(context);
	// 注册时间工具相关命令
	registerTimeToolsCommands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
