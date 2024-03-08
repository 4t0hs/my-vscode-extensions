import { workspace, WorkspaceConfiguration } from "vscode";

function joinKey(...args: string[]): string {
	const result: string | undefined = args.join(".");
	if (result === undefined) {
		return "";
	}
	return result;
}

export class FunctionCommentConfig {
	private static _ROOT: string = "Function Comment";
	private static _KEY_FUNCTION_COMMENT: string = FunctionCommentConfig._ROOT;
	private static _TEMPLATE: string = "Template";
	private static _DISPLAY_VOID: string = "Display Void";

	public readonly template: string[] = [];
	public readonly isDisplayVoid: boolean;
	constructor() {
		const config: WorkspaceConfiguration = workspace.getConfiguration(FunctionCommentConfig._KEY_FUNCTION_COMMENT);

		this.template = config.get<string[]>(FunctionCommentConfig._TEMPLATE, []);
		this.isDisplayVoid = config.get<boolean>(FunctionCommentConfig._DISPLAY_VOID, true);
	}
}
