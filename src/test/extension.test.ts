import * as assert from 'assert';
import { commands, Position, Selection, window, workspace } from 'vscode';

const wait = (amount = 0) =>
  new Promise(resolve => setTimeout(resolve, amount));

suite('Auto Add Brackets in String Interpolation', async () => {
  test('does nothing when language is not enabled', async () => {
    const expectedResult = '`test`';

    const textDocument = await workspace.openTextDocument({
      content: expectedResult,
      language: 'java',
    });

    const editor = await window.showTextDocument(textDocument);
    editor.selection = new Selection(new Position(0, 2), new Position(0, 6));

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(result, expectedResult);
  });

  test('write the symbol when activated outside of a string wrapper', async () => {
    const textDocument = await workspace.openTextDocument({
      content: '',
      language: 'typescript',
    });

    const editor = await window.showTextDocument(textDocument);

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(result, '$');
  });

  test('interpolation when inside a string wrapper but no selection', async () => {
    const textDocument = await workspace.openTextDocument({
      content: '`test `',
      language: 'typescript',
    });

    const editor = await window.showTextDocument(textDocument);
    editor.selection = new Selection(new Position(0, 6), new Position(0, 6));

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(result, '`test ${}`');
  });

  test('interpolation when one word is selected', async () => {
    const textDocument = await workspace.openTextDocument({
      content: '`test`',
      language: 'typescript',
    });

    const editor = await window.showTextDocument(textDocument);
    editor.selection = new Selection(new Position(0, 1), new Position(0, 5));

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(result, '`${test}`');
  });

  test('interpolation with multiple cursors', async () => {
    const textDocument = await workspace.openTextDocument({
      content: '`test test_test`',
      language: 'typescript',
    });

    const editor = await window.showTextDocument(textDocument);
    editor.selections = [
      new Selection(new Position(0, 1), new Position(0, 5)),
      new Selection(new Position(0, 6), new Position(0, 15)),
    ];

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(result, '`${test} ${test_test}`');
  });
});
