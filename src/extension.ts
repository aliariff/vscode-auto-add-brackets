'use strict';

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    console.log('"auto-add-brackets" extension is now active!');

    let addBracketsHashtag = vscode.commands.registerCommand('auto.addBracketsHashtag', async () => {
        await autoAddBrackets('#', '"');
    });
    let addBracketsDollar = vscode.commands.registerCommand('auto.addBracketsDollar', async () => {
        await autoAddBrackets('$', '`');
    });

    context.subscriptions.push(addBracketsHashtag);
    context.subscriptions.push(addBracketsDollar);
}

async function autoAddBrackets(key: string, indicator: string) {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        return;
    }

    if (editor.selections[0].isEmpty === false && editor.selections[0].isSingleLine === false) {
        await editor.edit(textEditor => {
            textEditor.replace(
                editor.selections[0], key
            );
        });
    } else if (editor.selections[0].isEmpty === false && editor.selections[0].isSingleLine === true) {
        await multipleSelection(editor, key, indicator);
    } else {
        await singleSelection(editor, key, indicator);
    }
}

async function singleSelection(editor: vscode.TextEditor, key: string, indicator: string) {
    const lineNumber: number = editor.selection.active.line;
    const columnNumber: number = editor.selection.active.character;
    const start: vscode.Position = new vscode.Position(lineNumber, 0);
    const end: vscode.Position = new vscode.Position(lineNumber, columnNumber);
    const lineText: string = editor.document.getText(new vscode.Range(start, end));

    if (isInsideString(lineText, indicator)) {
        await editor.edit(textEditor => {
            textEditor.insert(
                new vscode.Position(lineNumber, columnNumber), `${key}{}`
            );
        });
        await vscode.commands.executeCommand("cursorLeft");
    } else {
        await editor.edit(textEditor => {
            textEditor.insert(
                new vscode.Position(lineNumber, columnNumber), key
            );
        });
    }
}

async function multipleSelection(editor: vscode.TextEditor, key: string, indicator: string) {
    const lineNumber: number = editor.selections[0].start.line;
    const start: vscode.Position = new vscode.Position(lineNumber, 0);
    const end: vscode.Position = editor.selections[0].start;
    const lineText: string = editor.document.getText(new vscode.Range(start, end));

    if (isInsideString(lineText, indicator)) {
        await editor.edit(textEditor => {
            textEditor.insert(
                editor.selections[0].start, `${key}{`
            );
            textEditor.insert(
                editor.selections[0].end, '}'
            );
        });
    } else {
        await editor.edit(textEditor => {
            textEditor.replace(
                editor.selections[0], key
            );
        });
    }
}

function isInsideString(lineText: string, indicator: string) {
    const occurrences: number = lineText.split(indicator).length - 1;
    // if the occurrences of the indicator (", `) is odd then it is inside a string
    // example: some code, "string without interpolation", 'another simple string', "#{string} with interpolation"
    return occurrences % 2;
}

export function deactivate() { }
