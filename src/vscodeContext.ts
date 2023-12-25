import * as vscode from 'vscode';

class VscodeContext {
	public readonly getConfigration:
		(section?: string | undefined, scope?: vscode.ConfigurationScope | null | undefined) => vscode.WorkspaceConfiguration;
	public readonly activeEditor: vscode.TextEditor;
	public readonly showInfoMessage: <T>(message: string, ...items: []) => Thenable<T | undefined>;
	public readonly cursorPosion: vscode.Position;

	private variable: any[] = [
		vscode.window.activeTextEditor,

	]
	constructor() {
		this.getConfigration = vscode.workspace.getConfiguration;
		this.showInfoMessage = vscode.window.showInformationMessage;
		if (vscode.window.activeTextEditor) {
			this.activeEditor = vscode.window.activeTextEditor;
		} else {
		}
		// this.activeEditor = vscode.window.activeTextEditor;
		// this.cursorPosion = this.activeEditor?.selection.active;
	}
	public load(): boolean {
		
		
	}
}