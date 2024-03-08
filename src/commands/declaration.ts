import { TextEditor } from "vscode";
import { UtilText } from "../utility/text";

export class DeclarationFunction {
	public text: string = "";
	public line: number = -1;

	constructor() {}

	public search(editor: TextEditor, cursorLine: number, range: number): boolean {
		let limitLine: number;
		if ((cursorLine - range) < 0) {
			limitLine = 0;
		} else {
			limitLine = cursorLine - range;
		}
		
		for (let l = cursorLine; l > limitLine; l--) {
			const lineText = editor.document.lineAt(l).text;
			if (this.isDeclaration(lineText)) {
				this.text = this.excludeCommentOut(lineText);
				this.line = l;
				return true;
			}
		}
		return false;
	}

	private isDeclaration(text: string): boolean {
		const invalidWords: string[] = ["#", "typedef"];
		const declarationPattern: RegExp = /[0-9a-zA-Z_*]+[ \t]+[0-9a-zA-Z_*]+[ \t]*\(/g;
		const formated: string = this.excludeCommentOut(text);

		if (!declarationPattern.test(formated)) {
			return false;
		}
		if (this.isContainInvalidWords(formated, invalidWords)) {
			return false;
		}
		return true;
	}

	private excludeCommentOut(src: string): string {
		const commentOutWords: string[] = ["//", "/*"];
		let result: string = src;

		for (const word of commentOutWords) {
			result = UtilText.cropAt(src, word);
			if (result) {
				return result;
			}
		}
		return src;
	}

	private isContainInvalidWords(src: string, words: string[]): boolean {
		for (const word of words) {
			if (src.includes(word)) {
				return true;
			}
		}
		return false;
	}
}
