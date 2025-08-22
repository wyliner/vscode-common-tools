import * as vscode from 'vscode';

// 记录最后执行的命令信息
interface LastCommandInfo {
    commandId: string;
    title: string;
    timestamp: number;
    // 可以根据需要存储更多信息，如参数等
}

// 存储最后执行的命令
let lastCommand: LastCommandInfo | undefined;

/**
 * 记录命令执行
 * @param commandId 命令ID
 * @param title 命令标题
 */
export function recordCommandExecution(commandId: string, title: string): void {
    lastCommand = {
        commandId,
        title,
        timestamp: Date.now()
    };
}

/**
 * 执行上一次命令
 */
async function executeLastCommand(): Promise<void> {
    if (!lastCommand) {
        vscode.window.showInformationMessage('No previous command to execute');
        return;
    }

    try {
        await vscode.commands.executeCommand(lastCommand.commandId);
        vscode.window.showInformationMessage(`Re-executed: ${lastCommand.title}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to execute last command: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * 注册"上一次命令"功能
 */
export function registerLastCommand(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('common-tools.execute-last-command', executeLastCommand)
    );
}
