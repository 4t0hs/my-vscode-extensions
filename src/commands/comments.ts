import { window, TextEditor, Position } from 'vscode';
import { ConfigManager } from '../configration'
import { UtilText } from '../utility/text';

export namespace Comment {

	export function printFunctionComment(configManager: ConfigManager) {
		let activeEditor = window.activeTextEditor;
		if (!activeEditor) {
			return;
		}
		const validLanguageIds: string[] = ["c", "cpp"];
		const languageId: string = activeEditor.document.languageId;
		let validLanguage: boolean = false;
		for (let i = 0; i < validLanguageIds.length; i++) {
			if (validLanguageIds[i] == languageId) {
				validLanguage = true;
				break;
			}
		}
		if (!validLanguage) {
			return;
		}

		let cursorLine = activeEditor.selection.active.line;

		// 関数の定義を探す
		let declarationFunc: IDeclarationFunction = searchDeclarationFunction(
			activeEditor, cursorLine, 5
		);
		if (!declarationFunc.text) return;
		// 引数を取得する
		let params: string[] = extractFucntionParams(declarationFunc.text);
		// doxygenテンプレートを取得
		let template: string[] = configManager.comment.functionTemplate;
		// @paramの位置を取得
		let paramTemplateIndex = SectionTag.getTagVarIndex(template, SectionTag.VAR_PARAM);
		// @retvatの位置を取得
		let retvalTemplateIndex = SectionTag.getTagVarIndex(template, SectionTag.VAR_RETVAL);
		let returnValue: string | undefined = "";

		// すべて置き換える
		template = SectionTag.replaceAllTagVariable(template);
		console.log("replaceAll:", template);
		// 引数がvoidの時は表示しない
		if ((params.length == 1) && (!configManager.comment.isDisplayVoidParam)) {
			params = [];
		}
		// 戻り値がvoidの時は表示しない
		if (isReturnVoid(declarationFunc.text)) {
			returnValue = "void";
			if (!configManager.comment.isDisplayVoidParam) {
				returnValue = undefined;
			}
		}
		console.log("file: comments.ts:40 ~ printFunctionComment ~ returnValue:", returnValue)

		let outputComment: string[] = [];
		for (let i = 0; i < template.length; i++) {
			switch (i) {
				// @param
				case paramTemplateIndex:
					for (let j = 0; j < params.length; j++) {
						outputComment.push(template[i].concat(params[j]));
					}
					break;
				// @retval
				case retvalTemplateIndex:
					if (!(returnValue == undefined)) {
						outputComment.push(template[i].concat(returnValue));
					}
					break;
				default:
					outputComment.push(template[i]);
					break;
			}
		}
		console.log("output:", outputComment);

		// 出力
		UtilText.insertToActiveEditor(outputComment, new Position(declarationFunc.line, 0));
	}

	function isReturnVoid(declarationText: string): boolean {
		const leftBracket: string = "(";
		return UtilText.cropAt(declarationText, leftBracket).includes("void");
	}

	function extractFucntionParams(functionText: string): string[] {
		const leftBracket = "(";
		const rightBracket = ")"
		let cropedText: string;
		let paramTexts: string[] = [];
		let leftBracketIndex, rightBracketIndex;

		// ()の中身だけ切り抜く
		leftBracketIndex = functionText.indexOf(leftBracket);
		rightBracketIndex = functionText.indexOf(rightBracket);
		if ((leftBracketIndex < 0) || (rightBracketIndex < 0)) {
			return [];
		}
		cropedText = functionText.slice(leftBracketIndex + 1, rightBracketIndex);
		// 水平タブをスペースに置換
		let replacedText = cropedText.replace("\t", " ");
		// voidだった
		if (replacedText.includes("void")) {
			paramTexts.push("void");
			return paramTexts;
		}
		// ','区切りで分ける
		let argWords = UtilText.split(replacedText, ",");
		let spaceSplitWords: string[] = [];

		// 引数だけにする
		for (let i = 0; i < argWords.length; i++) {
			// スペースで区切る
			spaceSplitWords = UtilText.split(argWords[i], " ");

			if (spaceSplitWords.length > 1) {
				// ポインタをすべて消す
				if (spaceSplitWords[1].includes("*")) {
					spaceSplitWords[1] = spaceSplitWords[1].replaceAll("*", "");
				}
				// const
				if (spaceSplitWords[0].includes("const")) {
					spaceSplitWords.splice(0, 1);
				}
				paramTexts.push(spaceSplitWords[1]);
			}
		}
		return paramTexts;
	}

	/*!
	* @brief 関数の文字列かはんてい
	*/
	function isFunctionString(text: string): boolean {
		const commentOutWords: string[] = ["//", "/*"];
		let invalidWords: string[] = ["#", "typedef"];
		let declarationPattern = /[0-9a-zA-Z_*]+[ \t]+[0-9a-zA-Z_*]+[ \t]*\(/g;
		let cropedText: string;

		for (let num = 0; num < commentOutWords.length; num++) {
			cropedText = UtilText.cropAt(text, commentOutWords[num]);
			if (cropedText) {
				text = cropedText;
				break;
			}
		}
		if (!declarationPattern.test(text)) {
			return false;
		}

		for (let i = 0; i < invalidWords.length; i++) {
			if (text.includes(invalidWords[i])) {
				return false;
			}
		}
		return true;
	}

	interface IDeclarationFunction {
		text: string;
		line: number;
	};

	/*!
	* @brief 関数の宣言を探す
	*/
	function searchDeclarationFunction(activeEditor: TextEditor, cursorLine: number, range: number): IDeclarationFunction {
		let limitLine = (cursorLine - range) < 0 ? 0 : cursorLine - range;
		let text: string = "";

		for (let line = cursorLine; line > limitLine; line--) {
			text = activeEditor.document.lineAt(line).text;
			if (isFunctionString(text)) {
				return { text: text, line: line };
			}
		}
		return { text: "", line: -1 };
	}

	class SectionTag {
		static readonly VAR_BRIEF: string = "@1";
		static readonly VAR_PARAM: string = "@2";
		static readonly VAR_RETVAL: string = "@3";

		static readonly NAME_BRIEF: string = "@brief";
		static readonly NAME_PARAM: string = "@param";
		static readonly NAME_RETVAL: string = "@retval";

		private static readonly tagVariables: string[] = [
			SectionTag.VAR_BRIEF,
			SectionTag.VAR_PARAM,
			SectionTag.VAR_RETVAL,
		];
		private static readonly tagNames: string[] = [
			SectionTag.NAME_BRIEF,
			SectionTag.NAME_PARAM,
			SectionTag.NAME_RETVAL,
		];

		static replaceAllTagVariable(src: string[]): string[] {
			for (let srcIdx = 0; srcIdx < src.length; srcIdx++) {
				for (let tagIdx = 0; tagIdx < this.tagVariables.length; tagIdx++) {
					if (src[srcIdx].includes(this.tagVariables[tagIdx])) {
						src[srcIdx] = src[srcIdx].replace(this.tagVariables[tagIdx], this.tagNames[tagIdx]);
					}
				}
			}
			return src;
		}

		static getTagVarIndex(template: string[], tagVar: string): number {
			for (let i = 0; i < template.length; i++) {
				if (template[i].includes(tagVar)) {
					return i;
				}
			}
			return -1;
		}

	}
}
