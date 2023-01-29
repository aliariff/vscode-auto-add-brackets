import {
  commands,
  ExtensionContext,
  Position,
  Range,
  Selection,
  TextEditor,
  window,
} from "vscode";

import Config, { Language } from "./config";

function isInsideString(
  editor: TextEditor,
  stringWrapper: string,
  selection: Selection
) {
  const lineText = editor.document.getText(
    new Range(new Position(selection.start.line, 0), selection.start)
  );

  console.log(stringWrapper);
  console.log(lineText);

  let occurrences = lineText.split(stringWrapper).length - 1;
  const escaped = lineText.split(`\\${stringWrapper}`).length - 1;

  // ignore escaped character
  // example: "abc \" xyz"
  occurrences -= escaped;

  // if the occurrences of the indicator (", `) is odd then it is inside a string
  // example: some code, "string without interpolation", 'another simple string', "#{string} with interpolation"
  return occurrences % 2;
}

function shouldInterpolate(
  editor: TextEditor,
  language: Language,
  selection: Selection
) {
  if (selection === undefined) {
    selection = editor.selection;
  }

  return (
    isInsideString(editor, language.stringWrapper, selection) &&
    selection.isSingleLine
  );
}

// updateSelections moves the selections to the expected place after adding interpolation.
// It makes it behave the same way other wrapping operations do in VSCode
function updateSelections(editor: TextEditor) {
  const updatedSelections: Selection[] = [];

  editor.selections.forEach((selection) => {
    // If selection is empty we either did not add an interpolation
    // or we added it without having anything selected
    if (selection.isEmpty) {
      const characterBeforeCursor = editor.document.getText(
        new Range(selection.start, selection.end.translate(0, -1))
      );

      // If the characterBeforeCursor is a '}' it means that we did add a
      // interpolation, so we want to move one character back to position
      // the cursor in the middle of it.
      if (characterBeforeCursor === "}") {
        const newPosition = selection.start.translate(0, -1);
        updatedSelections.push(new Selection(newPosition, newPosition));
      } else {
        // Otherwise we did not add an interpolation, so we just don't change
        // anything
        updatedSelections.push(selection);
      }
    } else {
      // In this case we added a interpolation with stuff selected, so let's
      // position the selection properly
      updatedSelections.push(
        new Selection(selection.start, selection.end.translate(0, -1))
      );
    }
  });

  editor.selections = updatedSelections;
}

async function autoAddInterpolation() {
  const editor = window.activeTextEditor;
  if (editor === undefined) {
    return;
  }

  const language = Config.languages[editor.document.languageId];
  if (language === undefined) {
    window.showErrorMessage(
      `Language configuration not found for: ${editor.document.languageId}`
    );
    return;
  }

  await editor.edit((editBuilder) => {
    editor.selections.forEach((selection) => {
      if (shouldInterpolate(editor, language, selection)) {
        editBuilder.insert(selection.start, `${language.symbol}{`);
        editBuilder.insert(selection.end, "}");
      } else {
        // Just passthrough and insert the symbol as if the extension did not even exist
        editBuilder.insert(selection.start, language.symbol);
      }
    });
  });

  updateSelections(editor);
}

export function activate(context: ExtensionContext) {
  console.log('"auto-add-brackets" extension is now active!');

  context.subscriptions.push(
    commands.registerCommand("auto.addInterpolation", () => {
      autoAddInterpolation();
    })
  );
}

export function deactivate() {}
