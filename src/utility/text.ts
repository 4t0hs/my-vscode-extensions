export namespace UtilText {
	export function cropAt(text: string, targetWord: string): string {
		let index = text.indexOf(targetWord);
		if (index >= 0) {
			return text.slice(0, index);
		}
		return "";
	}

	export function split(src: string, separator: string): string[] {
		let array: string[] = [];

		array = src.split(separator);
		return array.filter((item) => item !== "");
	}

	export function removeIgnoreWords(src: string, ignoreWords: string[]): string {
		let result: string = src.replace(ignoreWords[0], "");
		for (let i = 1; i < ignoreWords.length; i++) {
			result = result.replace(ignoreWords[i], "");
		}
		return result;
	}

	export function replaceAll(src: string, word: string, dstWord: string): string {
		let result: string = src;
		while (result.includes(word)) {
			result = result.replace(word, dstWord);
		}
		return result;
	}

	export function replaceAllWords(src: string, words: string[], dstWord: string): string {
		let result: string = src;
		for (let i = 0; i < words.length; i++) {
			result = UtilText.replaceAll(result, words[i], dstWord);
		}
		return result;
	}
}
