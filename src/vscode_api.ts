import * as vscode from 'vscode'

export class VscodeApi {
	private activeEditor: vscode.TextEditor;

	constructor(activeEditor: vscode.TextEditor) {
		this.activeEditor = activeEditor;
	}

	get selectedText(): string {
		let document: vscode.TextDocument = this.activeEditor.document;
		return document.getText(this.activeEditor.selection);
	}

	public getSelectedTextAll(): string[] {
		let selectedTexts: string[] = [];

		for (let i = 0; i < this.activeEditor.selections.length; i++) {
			selectedTexts.push(
				this.activeEditor.document.getText(this.activeEditor.selections[i]));
		}
		return selectedTexts;
	}
}