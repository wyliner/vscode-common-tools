import * as vscode from 'vscode';

function toCamelCase(str: string): string {
    return str
        .replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, (m) => m.toLowerCase());
}

function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[-\s.]+/g, '_')
        .toLowerCase();
}

function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s.]+/g, '-')
        .toLowerCase();
}

function toPascalCase(str: string): string {
    return str
        .replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, (m) => m.toUpperCase());
}

function toScreamingSnakeCase(str: string): string {
    return toSnakeCase(str).toUpperCase();
}

function toCapitalizedSnakeCase(str: string): string {
    return toSnakeCase(str)
        .split('_')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join('_');
}

function toLowerCase(str: string): string {
    return str.toLowerCase();
}

function toUpperCase(str: string): string {
    return str.toUpperCase();
}

function toSpaceSeparated(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[-_\.]+/g, ' ')
        .toLowerCase();
}

function toDotCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1.$2')
        .replace(/[-_\s]+/g, '.')
        .toLowerCase();
}

export function registerStringToolsCommands(context: vscode.ExtensionContext) {
    const cases = [
        { command: 'common-tools.string.lower-case', fn: toLowerCase, title: 'String: lower case' },
        { command: 'common-tools.string.upper-case', fn: toUpperCase, title: 'String: UPPER CASE' },
        { command: 'common-tools.string.camel-case', fn: toCamelCase, title: 'String: camelCase' },
        { command: 'common-tools.string.snake-case', fn: toSnakeCase, title: 'String: snake_case' },
        { command: 'common-tools.string.screaming-snake-case', fn: toScreamingSnakeCase, title: 'String: SCREAMING_SNAKE_CASE' },
        { command: 'common-tools.string.kebab-case', fn: toKebabCase, title: 'String: kebab-case' },
        { command: 'common-tools.string.pascal-case', fn: toPascalCase, title: 'String: PascalCase' },
        { command: 'common-tools.string.capitalized-snake-case', fn: toCapitalizedSnakeCase, title: 'String: Capitalized_Snake_Case' },
        { command: 'common-tools.string.space-separated', fn: toSpaceSeparated, title: 'String: space separated' },
        { command: 'common-tools.string.dot-case', fn: toDotCase, title: 'String: dot.case' },
    ];
    for (const c of cases) {
        context.subscriptions.push(
            vscode.commands.registerCommand(c.command, async () => {
                const editor = vscode.window.activeTextEditor;
                if (!editor) { return; }
                const text = editor.document.getText(editor.selection) || editor.document.getText();
                const result = c.fn(text.trim());
                await editor.edit(editBuilder => {
                    if (editor.selection.isEmpty) {
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(editor.document.getText().length)
                        );
                        editBuilder.replace(fullRange, result);
                    } else {
                        editBuilder.replace(editor.selection, result);
                    }
                });
                vscode.window.showInformationMessage('转换成功');
            })
        );
    }
}
