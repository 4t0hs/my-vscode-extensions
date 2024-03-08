import { match } from "assert";
import { UtilText } from "../utility/text";

export namespace Function {
	export class DecrarationParser {
		private readonly LEFT_BRACKET: string = "(";
		private readonly RIGHT_BRACKET: string = ")";

		// public returnType: string = "";
		// public name: string = "";

		private _decraration: string = "";
		private _argmentPart: string = "";
		private _nonArgumentPart: string = "";

		constructor(declaration: string) {
			this._decraration = this.formatDeclaration(declaration);
			// 引数の部分とそれ以外に分ける
			const restPart: string = this.divideToArgmentAndRest();
			this._nonArgumentPart = restPart;
		}
		/**
		 * パラメータ名を取得する
		 */
		public parseParamNames(): string[] {
			const formated: string = UtilText.replaceAll(this._argmentPart, "*", " "); // ポインタはいらないので消す
			const args: string[] = formated.split(",");

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
			let matches: RegExpMatchArray | null = arg.match(pattern);

			if (matches !== null && matches.length > 0) {
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
		private divideToArgmentAndRest(): string {
			let firstBracketIndex: number = this._decraration.indexOf(this.LEFT_BRACKET);
			let lastBracketIndex: number = this._decraration.lastIndexOf(this.RIGHT_BRACKET);

			this._argmentPart = this._decraration.slice(firstBracketIndex + 1, lastBracketIndex);
			return this._decraration.slice(0, firstBracketIndex);
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
