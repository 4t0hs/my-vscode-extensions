import * as vscode from 'vscode'
import axios from 'axios'
import { VscodeApi } from './vscode_api';

export namespace translation {
	function makeUri(text: string): string {
		const baseUri = 'https://script.google.com/macros/s/AKfycbzzZj6EizF45vIK6xtj2DHPyz6PWNbyzD864O2_ACRBEoN17JLqBnyK9NrwKRWgbuIM/exec?';
		return baseUri + 'text=' + text + '&source=en' + '&target=ja';
	}
	export async function translate() {
		let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (!editor) return;
		let vscodeApi: VscodeApi = new VscodeApi(editor);
		// console.log("selected:", vscodeApi.selectedText);

		// try {
		// 	const response = await axios.get(makeUri(vscodeApi.selectedText));
		// 	console.log(response.data);
		// } catch (error) {
		// 	console.error("Error fetch data:", error);
		// }
	}

	export class TranslateHierarchyProvider implements vscode.CallHierarchyProvider {
		prepareCallHierarchy(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.CallHierarchyItem | undefined {
			const range = document.getWordRangeAtPosition(position);
			if (range) {
				const word = document.getText(range);
				return this.createCallHierarchyItem(word, '', document, range);
			} else {
				return undefined;
			}
		}

		async provideCallHierarchyOutgoingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): Promise<vscode.CallHierarchyOutgoingCall[] | undefined> {
			const document = await vscode.workspace.openTextDocument(item.uri);
			const parser = new FoodPyramidParser();
			parser.parse(document);
			const model = parser.getModel();
			const originRelation = model.getRelationAt(item.range);
	
			const outgoingCallItems: vscode.CallHierarchyOutgoingCall[] = [];
	
			if (model.isVerb(item.name)) {
				const outgoingCalls = model.getVerbRelations(item.name)
					.filter(relation => relation.subject === originRelation!.subject);
	
				outgoingCalls.forEach(relation => {
					const outgoingCallRange = relation.getRangeOf(relation.object);
					const verbItem = this.createCallHierarchyItem(relation.object, 'noun', document, outgoingCallRange);
					const outgoingCallItem = new vscode.CallHierarchyOutgoingCall(verbItem, [outgoingCallRange]);
					outgoingCallItems.push(outgoingCallItem);
				});
			}
			else if (model.isNoun(item.name)) {
				const outgoingCallMap = groupBy(model.getSubjectRelations(item.name), relation => relation.verb);
	
				outgoingCallMap.forEach((relations, verb) => {
					const outgoingCallRanges = relations.map(relation => relation.getRangeOf(verb));
					const verbItem = this.createCallHierarchyItem(verb, 'verb', document, outgoingCallRanges[0]);
					const outgoingCallItem = new vscode.CallHierarchyOutgoingCall(verbItem, outgoingCallRanges);
					outgoingCallItems.push(outgoingCallItem);
				});
			}
	
			return outgoingCallItems;
		}
	
		async provideCallHierarchyIncomingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): Promise<vscode.CallHierarchyIncomingCall[]> {
			const document = await vscode.workspace.openTextDocument(item.uri);
			const parser = new FoodPyramidParser();
			parser.parse(document);
			const model = parser.getModel();
			const originRelation = model.getRelationAt(item.range);
	
			const outgoingCallItems: vscode.CallHierarchyIncomingCall[] = [];
	
			if (model.isVerb(item.name)) {
				const outgoingCalls = model.getVerbRelations(item.name)
					.filter(relation => relation.object === originRelation!.object);
	
				outgoingCalls.forEach(relation => {
					const outgoingCallRange = relation.getRangeOf(relation.subject);
					const verbItem = this.createCallHierarchyItem(relation.subject, 'noun', document, outgoingCallRange);
					const outgoingCallItem = new vscode.CallHierarchyIncomingCall(verbItem, [outgoingCallRange]);
					outgoingCallItems.push(outgoingCallItem);
				});
			}
			else if (model.isNoun(item.name)) {
				const outgoingCallMap = groupBy(model.getObjectRelations(item.name), relation => relation.verb);
	
				outgoingCallMap.forEach((relations, verb) => {
					const outgoingCallRanges = relations.map(relation => relation.getRangeOf(verb));
					const verbItem = this.createCallHierarchyItem(verb, 'verb-inverted', document, outgoingCallRanges[0]);
					const outgoingCallItem = new vscode.CallHierarchyIncomingCall(verbItem, outgoingCallRanges);
					outgoingCallItems.push(outgoingCallItem);
				});
			}
	
			return outgoingCallItems;
		}
	


		private createCallHierarchyItem(word: string, type: string, document: vscode.TextDocument, range: vscode.Range): vscode.CallHierarchyItem {
			return new vscode.CallHierarchyItem(vscode.SymbolKind.Object, word, `(${type})`, document.uri, range, range);
		}
	}
}