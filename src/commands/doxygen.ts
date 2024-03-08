import { secureHeapUsed } from "crypto";
import { resourceUsage } from "process";
import { stringify } from "querystring";

export namespace Doxygen {
	export class Generator {
		private _template: string[];
		private _lineCode: string;

		private _brief: string = "";
		private _params: string[] = [];
		private _retvals: string[] = [];

		constructor(template: string[], lineCode: string = "\r\n") {
			this._template = template;
			this._lineCode = lineCode;
		}
		public makeAll(params: string[] = [], retvals: string[] = []): string {
			const summary: string = "";
			let lines: string[] = [];

			this.makeBriefPart(summary);
			this.makeParamParts(params);
			this.makeRetvalParts(retvals);
			return lines.join(this._lineCode);
		}
		public concat(): string[] {
			let comment: string[] = [];

			for (let i = 0; i < this._template.length; i++) {
				switch (SectionTag.contains(this._template[i])) {
					case SectionTag.BRIEF:
						comment.push(this._brief);
						break;
					case SectionTag.PARAM:
						comment = comment.concat(this._params);
						break;
					case SectionTag.RETVAL:
						comment = comment.concat(this._retvals);
						break;
					default:
						comment.push(this._template[i]);
						break;
				}
			}
			return comment;
		}

		private findIndex(tag: string): number {
			for (let i = 0; i < this._template.length; i++) {
				if (this._template[i].includes(tag)) {
					return i;
				}
			}
			return -1;
		}
		public makeBriefPart(summary: string = ""): void {
			const index: number = this.findIndex(SectionTag.BRIEF);
			if (index < 0) {
				return;
			}
			if (summary) {
				this._brief = this._template[index] + summary;
			} else {
				this._brief = this._template[index];
			}
		}

		public makeParamParts(params: string[] = []): void {
			const index: number = this.findIndex(SectionTag.PARAM);
			if (index < 0) {
				return;
			}
			let result: string[] = [];

			if (params.length === 0) {
				result.push(this._template[index]);
				this._params = result;
				return;
			}
			for (const name of params) {
				result.push(this._template[index] + name);
			}
			this._params = result;
		}

		public makeRetvalParts(retvals: string[] = []): void {
			const index: number = this.findIndex(SectionTag.RETVAL);
			if (index < 0) {
				return;
			}
			let result: string[] = [];
			if (retvals.length === 0) {
				result.push(this._template[index]);
				this._retvals = result;
				return;
			}
			for (const name of retvals) {
				result.push(this._template[index] + name);
			}
			this._retvals = result;
		}
	}

	export class SectionTag {
		public static readonly BRIEF: string = "@brief";
		public static readonly PARAM: string = "@param";
		public static readonly RETVAL: string = "@retval";
		static contains(src: string): string {
			if (src.includes(SectionTag.BRIEF)) {
				return SectionTag.BRIEF;
			}
			if (src.includes(SectionTag.PARAM)) {
				return SectionTag.PARAM;
			}
			if (src.includes(SectionTag.RETVAL)) {
				return SectionTag.RETVAL;
			}
			return "";
		}
	}
}
