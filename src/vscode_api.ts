import { error } from "console";
import * as vscode from "vscode";

export namespace VscodeApi {
	export class VscodeEditor {
		private readonly _activeEditor: vscode.TextEditor;

		constructor(activeEditor: vscode.TextEditor | undefined) {
			if (activeEditor === undefined) {
				throw new Error("Undefined Active Text Editro.");
			}
			this._activeEditor = activeEditor;
		}

		get selectedText(): string {
			let document: vscode.TextDocument = this._activeEditor.document;
			return document.getText(this._activeEditor.selection);
		}

		public getSelectedTextAll(): string[] {
			let selectedTexts: string[] = [];

			for (let i = 0; i < this._activeEditor.selections.length; i++) {
				selectedTexts.push(
					this._activeEditor.document.getText(this._activeEditor.selections[i])
				);
			}
			return selectedTexts;
		}

		get languageId(): string {
			return this._activeEditor.document.languageId;
		}

		get cursorLine(): number {
			return this._activeEditor.selection.active.line;
		}

		get activeEditor(): vscode.TextEditor {
			return this._activeEditor;
		}

		public insert(
			text: string,
			position: vscode.Position = new vscode.Position(this.cursorLine, 0),
			isLineBreak: boolean = true
		): void {
			const outputText: string = isLineBreak ? text + this.eolCharacter : text;
			this._activeEditor.edit((builder) => {
				builder.insert(position, outputText);
			});
		}

		public insertRange(
			texts: string[],
			position: vscode.Position = new vscode.Position(this.cursorLine, 0),
			isLineBreak: boolean = true
		): void {
			let outputText: string = texts.join(this.eolCharacter);

			this.insert(outputText, position, isLineBreak);
		}

		get eolCharacter(): string {
			if (this._activeEditor.document.eol === vscode.EndOfLine.LF) {
				return "\n";
			}
			return "\r\n";
		}
	}
}
