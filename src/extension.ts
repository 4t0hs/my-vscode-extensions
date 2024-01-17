// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ftruncateSync } from 'fs';
import * as vscode from 'vscode';
import { ConfigManager } from './configration'
import { Comment } from './commands/comments';
import {translation} from './translate'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerTextEditorCommand('my-extensions.func-comment', () => {
		let configManager: ConfigManager = new ConfigManager();

		Comment.printFunctionComment(configManager);
	});
	let tr = vscode.commands.registerCommand("my-extensions.translate", translation.translate);

	let ret = vscode.languages.registerCallHierarchyProvider()
	
	context.subscriptions.push(disposable);
	context.subscriptions.push(tr);
}

// This method is called when your extension is deactivated
export function deactivate() { }


