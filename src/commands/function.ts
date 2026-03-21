import { match } from "assert";
import { UtilText } from "../utility/text";

export namespace Function {
	export class DeclarationParser {
		private readonly LEFT_BRACKET: string = "(";
		private readonly RIGHT_BRACKET: string = ")";

		// public returnType: string = "";
		// public name: string = "";

		private _declaration: string = "";
		private _argumentPart: string = "";
		private _nonArgumentPart: string = "";

		constructor(declaration: string) {
			this._declaration = this.formatDeclaration(declaration);
			// 引数の部分とそれ以外に分ける
			const restPart: string = this.divideToArgumentAndRest();
			this._nonArgumentPart = restPart;
		}
		/**
		 * パラメータ名を取得する
		 */
		public parseParamNames(): string[] {
			const formatted: string = UtilText.replaceAll(this._argumentPart, "*", " "); // ポインタはいらないので消す
			const args: string[] = formatted.split(",");

			if (args.length <= 0) {
				return [];
			}
			let names: string[] = [];
			for (let i = 0; i < args.length; i++) {
				const name: string = this.extractArgumentName(args[i]);
				if (name) {
					names.push(name);
				}
			}
			return names;
		}

		public isReturnVoid(): boolean {
			return this.findReturnType() === "void";
		}
		private findReturnType(): string {
			const words: string[] = UtilText.split(this._nonArgumentPart, " ");
			if (words.length < 2) {
				return "";
			}
			let returnType: string = words[0];
			// ポインタを探す
			for (let i = 1; i < words.length; i++) {
				if (words[i].includes("*")) {
					return returnType + "*";
				}
			}
			return returnType;
		}
		/**
		 * パターンにマッチしているか
		 */
		private matchArgument(arg: string, pattern: RegExp): string | undefined {
			const matches: RegExpMatchArray | null = arg.match(pattern);

			if (matches !== null && matches.length > 1) {
				return matches[1];
			}
			return undefined;
		}
		/**
		 * 引数の名前を取得する
		 */
		private extractArgumentName(arg: string): string {
			const patterns: RegExp[] = [
				/[a-zA-Z\d_]+ [ *]*(.*)/, // 通常 ex)int num
				/[_\da-zA-Z]+ [ \t*]*\([ \t]*\*([a-zA-Z\d_]+)\)[ \t]*\(.*\)/, // 関数ポインタ ex)void (*func)()
				/^[ \t]*(void|[ ]*)[ \t]*$/, // void
			];

			for (let i = 0; i < patterns.length; i++) {
				let name: string | undefined = this.matchArgument(arg, patterns[i]);
				if (name !== undefined) {
					if (name) {
						return name;
					} else {
						return "void";
					}
				}
			}
			return "";
		}

		/**
		 * 引数のとそれ以外の部分に分解する
		 */
		private divideToArgumentAndRest(): string {
			let firstBracketIndex: number = this._declaration.indexOf(this.LEFT_BRACKET);
			let lastBracketIndex: number = this._declaration.lastIndexOf(this.RIGHT_BRACKET);

			this._argumentPart = this._declaration.slice(firstBracketIndex + 1, lastBracketIndex);
			return this._declaration.slice(0, firstBracketIndex);
		}
		/**
		 * 関数宣言をフォーマットする
		 */
		private formatDeclaration(declaration: string): string {
			const replaceWords: string[] = ["static", "const", "\t"];
			return UtilText.replaceAllWords(declaration, replaceWords, " ");
		}
	}
}
