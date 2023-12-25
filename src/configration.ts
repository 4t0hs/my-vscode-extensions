import * as vscode from 'vscode';
import { workspace } from 'vscode'

class ConfigMyExtension {
	// my-extension
	protected readonly _TITLE: string = "my-extensions";
}

class ConfigComment extends ConfigMyExtension {
	// comment
	protected readonly _COMMENT: string = ".comment";
	// 	.function
	protected readonly _FUNCTION: string = ".function";
	// 		.template
	protected readonly _TEMPLATE: string = ".template";
	// 		.display-void
	protected readonly _DISPLAY_VOID: string = ".display-void";
	//			.param, .retval
	protected readonly _PARAM: string = ".@param";
	protected readonly _RETVAL: string = ".@retval";
	// comment.function
	protected readonly KEY_FUNCTION: string = this._TITLE + this._COMMENT + this._FUNCTION;
	protected readonly TEMPLATE: string = "template";
	// comment.function.display-void
	protected readonly KEY_DISPLAY_VOID: string = this.KEY_FUNCTION + this._DISPLAY_VOID;
	protected readonly PARAM: string = "@param";
	protected readonly RETVAL: string = "@retval";

	private confFunction: vscode.WorkspaceConfiguration;
	public functionTemplate: string[] = [];

	private confDisplayVoid: vscode.WorkspaceConfiguration;
	public isDisplayVoidParam: boolean = false;
	public isDisplayVoidRetval: boolean = false;

	constructor() {
		super()
		this.confFunction = workspace.getConfiguration(this.KEY_FUNCTION);
		this.confDisplayVoid = workspace.getConfiguration(this.KEY_DISPLAY_VOID);
		this.load();
	}
	load() {
		// comment.function.template
		this.functionTemplate = this.confFunction.get<string[]>(this.TEMPLATE, []);
		// comment.function.display-void.param
		this.isDisplayVoidParam = this.confDisplayVoid.get<boolean>(this.PARAM, true);
		// comment.function.display-void.retval
		this.isDisplayVoidRetval = this.confDisplayVoid.get<boolean>(this.RETVAL, true);
	}
}

export class ConfigManager {
	public comment: ConfigComment;

	constructor() {
		this.comment = new ConfigComment();
	}
}
