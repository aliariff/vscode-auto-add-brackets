import * as assert from 'assert';
import { commands, Position, Selection, window, workspace } from 'vscode';
import Config, { Language } from '../../config';

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

  for (let language in Config.languages) {
    testDefaultSupportedLanguages(language, Config.languages[language]);
  }
});

function testDefaultSupportedLanguages(language: string, config: Language) {
  test(`[${language}] write the symbol when activated outside of a string wrapper`, async () => {
    const textDocument = await workspace.openTextDocument({
      content: '',
      language: language,
    });

    const editor = await window.showTextDocument(textDocument);

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(result, config.symbol);
  });

  test(`[${language}] interpolation when inside a string wrapper but no selection`, async () => {
    const textDocument = await workspace.openTextDocument({
      content: `${config.stringWrapper}test ${config.stringWrapper}`,
      language: language,
    });

    const editor = await window.showTextDocument(textDocument);
    editor.selection = new Selection(new Position(0, 6), new Position(0, 6));

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(
      result,
      `${config.stringWrapper}test ${config.symbol}{}${config.stringWrapper}`,
    );
  });

  test(`[${language}] interpolation with stringWrapper character escaped`, async () => {
    const textDocument = await workspace.openTextDocument({
      content: `${config.stringWrapper}\\${config.stringWrapper} ${config.stringWrapper
        }`,
      language: language,
    });

    const editor = await window.showTextDocument(textDocument);
    editor.selection = new Selection(new Position(0, 4), new Position(0, 4));

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(
      result,
      `${config.stringWrapper}\\${config.stringWrapper} ${config.symbol}{}${config.stringWrapper
      }`,
    );
  });

  test(`[${language}] interpolation when one word is selected`, async () => {
    const textDocument = await workspace.openTextDocument({
      content: `${config.stringWrapper}test${config.stringWrapper}`,
      language: language,
    });

    const editor = await window.showTextDocument(textDocument);
    editor.selection = new Selection(new Position(0, 1), new Position(0, 5));

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(
      result,
      `${config.stringWrapper}${config.symbol}{test}${config.stringWrapper}`,
    );
  });

  test(`[${language}] interpolation with multiple cursors`, async () => {
    const textDocument = await workspace.openTextDocument({
      content: `${config.stringWrapper}test test_test${config.stringWrapper}`,
      language: language,
    });

    const editor = await window.showTextDocument(textDocument);
    editor.selections = [
      new Selection(new Position(0, 1), new Position(0, 5)),
      new Selection(new Position(0, 6), new Position(0, 15)),
    ];

    await commands.executeCommand('auto.addInterpolation');
    await wait(500);

    const result = editor.document.getText();

    assert.equal(
      result,
      `${config.stringWrapper}${config.symbol}{test} ${config.symbol
      }{test_test}${config.stringWrapper}`,
    );
  });
}
