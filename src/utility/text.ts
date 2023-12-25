import * as vscode from 'vscode'

export namespace UtilText {
	export function cropAt(text: string, targetWord: string): string {
		let index = text.indexOf(targetWord);
		if (index > 0) {
			return text.slice(0, index);
		}
		return "";
	}

	export function split(src: string, separator: string): string[] {
		let array: string[] = [];

		array = src.split(separator);
		return array.filter((item) => item != "");
	}

	export function insertToActiveEditor(texts: string[], position: vscode.Position): void {
		let editor = vscode.window.activeTextEditor;
		let outputText: string = "";

		if (!editor) return;

		// todo: 改行コードを取得したい
		for (let i = 0; i < texts.length; i++) {
			outputText = outputText.concat(texts[i], "\r\n");
		}
		console.log("insert:", outputText, "position:", position);
		editor.edit((builder) => {
			builder.insert(position, outputText);
		});
	}
}
