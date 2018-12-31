# vscode-auto-add-brackets

[![Build Status](https://dev.azure.com/aliariff/vscode-auto-add-brackets/_apis/build/status/vscode-auto-add-brackets-CI?branchName=master)](https://dev.azure.com/aliariff/vscode-auto-add-brackets/_build/latest?definitionId=1?branchName=master)

This extension will automatically add complete brackets when writing interpolated string.

This solution inspired from sublime text behaviour.

![Demo GIF](https://drive.google.com/uc?export=view&id=1kqZT4yOlKl_gyGOYuwzNSfy6BFRpl4SQ)

## Language Support

By default the following languages are enabled:

- Ruby
- Elixir
- Javascript
- Javascript React
- Typescript
- Typescript React
- Coffeescript
- ERB
- Haml
- Slim
- Groovy

### Adding other languages

You can enable other languages yourself by doing the following:

```json
{
  // VSCode settings ...

  "auto.languages": {
    // The key is the languageId for the language (see notes)
    "typescript": {
      // Symbol used for string interpolations in the language
      "symbol": "$",
      // Type of quotes that surround strings that can be interpolated in the language
      "stringWrapper": "`"
    },
    "ruby": {
      "symbol": "#",
      "stringWrapper": "\""
    }
  }
}
```

> note that the key in the configuration object should be a [languageId](https://code.visualstudio.com/docs/languages/identifiers) supported by VSCode

Then add the keybind for the language:

```json
{
  // Keybindings ...

  {
    "command": "auto.addInterpolation",
    "key": "shift+3",
    "when": "editorTextFocus && editorLangId == 'YOUR_LANGUAGE_ID'"
  },
}
```

> If you are a Vim mode user you should also add `(vim.mode != '' ? vim.mode == 'Insert' : true)` to your "when" clause

## Related issue:

[vscode-ruby/#200](https://github.com/rubyide/vscode-ruby/issues/200)

[vscode-ruby/#210](https://github.com/rubyide/vscode-ruby/issues/210)

## Credits

Icons made by [Icon Monk](https://www.flaticon.com/authors/icon-monk) from [www.flaticon.com](https://www.flaticon.com)
is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0)
