// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerJsonToolsCommands } from './commands/json';
import { registerTimeToolsCommands } from './commands/time';
import { registerStringToolsCommands } from './commands/string';
import { registerUuidCommands } from './commands/uuid';
import { registerRandomToolsCommands } from './commands/random';
import { registerBase64ToolsCommands } from './commands/base64';
import { registerLastCommand } from './commands/last';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// 注册 "上一次命令" 功能
	registerLastCommand(context);
	// 注册 JSON 相关命令
	registerJsonToolsCommands(context);
	// 注册时间工具相关命令
	registerTimeToolsCommands(context);
	// 注册字符串工具相关命令
	registerStringToolsCommands(context);
	// 注册 UUID 相关命令
	registerUuidCommands(context);
	// 注册随机数工具相关命令
	registerRandomToolsCommands(context);
	// 注册 Base64 工具相关命令
	registerBase64ToolsCommands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
