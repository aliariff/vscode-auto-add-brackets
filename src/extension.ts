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

/**
 * Checks if the current selection is inside a string.
 * @param editor The active text editor.
 * @param stringWrapper The string wrapper character.
 * @param selection The current selection.
 * @returns A boolean indicating whether the selection is inside a string or not.
 */
function isInsideString(
  editor: TextEditor,
  stringWrapper: string,
  selection: Selection
): boolean {
  const lineText = editor.document.getText(
    new Range(new Position(selection.start.line, 0), selection.start)
  );

  let occurrences = lineText.split(stringWrapper).length - 1;
  const escaped = lineText.split(`\\${stringWrapper}`).length - 1;

  // Ignore escaped character
  // Example: "abc \" xyz"
  occurrences -= escaped;

  // If the occurrences of the indicator (", `) is odd, then it is inside a string
  // Example: some code, "string without interpolation", 'another simple string', "#{string} with interpolation"
  return occurrences % 2 === 1;
}

/**
 * Checks if interpolation should be added to the current selection.
 * @param editor The active text editor.
 * @param language The language configuration.
 * @param selection The current selection.
 * @returns A boolean indicating whether interpolation should be added or not.
 */
function shouldInterpolate(
  editor: TextEditor,
  language: Language,
  selection?: Selection
): boolean {
  if (!selection) {
    selection = editor.selection;
  }

  return (
    isInsideString(editor, language.stringWrapper, selection) &&
    selection.isSingleLine
  );
}

/**
 * Updates the selections after adding interpolation.
 * It makes the selections behave the same way as other wrapping operations in VSCode.
 * @param editor The active text editor.
 */
function updateSelections(editor: TextEditor) {
  const updatedSelections: Selection[] = [];

  editor.selections.forEach((selection) => {
    // If selection is empty, we either did not add an interpolation
    // or we added it without having anything selected
    if (selection.isEmpty) {
      const characterBeforeCursor = editor.document.getText(
        new Range(selection.start, selection.end.translate(0, -1))
      );

      // If the characterBeforeCursor is a '}', it means that we did add an interpolation,
      // so we want to move one character back to position the cursor in the middle of it.
      if (characterBeforeCursor === "}") {
        const newPosition = selection.start.translate(0, -1);
        updatedSelections.push(new Selection(newPosition, newPosition));
      } else {
        // Otherwise, we did not add an interpolation, so we just don't change anything
        updatedSelections.push(selection);
      }
    } else {
      // In this case, we added an interpolation with stuff selected,
      // so let's position the selection properly
      updatedSelections.push(
        new Selection(selection.start, selection.end.translate(0, -1))
      );
    }
  });

  editor.selections = updatedSelections;
}

/**
 * Automatically adds interpolation to the selected text inside a string.
 */
async function autoAddInterpolation() {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const language = Config.languages[editor.document.languageId];
  if (!language) {
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

/**
 * Activates the extension.
 * @param context The extension context.
 */
export function activate(context: ExtensionContext) {
  console.log('"auto-add-brackets" extension is now active!');

  context.subscriptions.push(
    commands.registerCommand("auto.addInterpolation", () => {
      autoAddInterpolation();
    })
  );
}

/**
 * Deactivates the extension.
 */
export function deactivate() {}
