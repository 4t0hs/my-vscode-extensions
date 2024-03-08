import { window, Position } from "vscode";
import { FunctionCommentConfig } from "../config/configration";
import { VscodeApi } from "../vscode_api";
import { DeclarationFunction } from "./declaration";
import { Function } from "./function";
import { Doxygen } from "./doxygen";

export namespace Comment {
	/**
	 * 関数ヘッダを出力する
	 */
	export function printFunctionComment() {
		// 設定
		const config: FunctionCommentConfig = new FunctionCommentConfig();
		// vscode
		let editor: VscodeApi.VscodeEditor = new VscodeApi.VscodeEditor(window.activeTextEditor);
		// 言語が無効
		if (isInvalidLanguage(editor.languageId)) {
			return;
		}
		// 関数の定義を探す
		let declaration: DeclarationFunction = new DeclarationFunction();
		if (!declaration.search(editor.activeEditor, editor.cursorLine, 5)) {
			return;
		}
		let parser: Function.DecrarationParser = new Function.DecrarationParser(declaration.text);
		// 引数を取得する
		const paramNames: string[] = parser.parseParamNames();
		if (paramNames.length === 0) {
			return;
		}
		// doxgenコメントを作る
		let generator: Doxygen.Generator = new Doxygen.Generator(config.template);
		// brief
		generator.makeBriefPart();
		// voidのときは何もしない
		if (!(paramNames.includes("void") && !config.isDisplayVoid)) {
			generator.makeParamParts(paramNames);
		}
		// voidの時だけ出力する
		if (parser.isReturnVoid()) {
			if (config.isDisplayVoid) {
				generator.makeRetvalParts(["void"]);
			}
		} else {
			generator.makeRetvalParts();
		}
		// 全部繋げる
		const comments: string[] = generator.concat();
		// 出力
		editor.insertRange(comments, new Position(declaration.line, 0));
	}
	/**
	 * 無効な言語
	 */
	function isInvalidLanguage(activeLanguage: string): boolean {
		// 有効な言語
		const validLanguages: string[] = ["c", "cpp"];
		for (const lang of validLanguages) {
			if (lang === activeLanguage) {
				return false;
			}
		}
		return true;
	}
}
