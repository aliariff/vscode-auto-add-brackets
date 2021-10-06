# vscode-auto-add-brackets

[![Test](https://github.com/aliariff/vscode-auto-add-brackets/actions/workflows/test.yaml/badge.svg)](https://github.com/aliariff/vscode-auto-add-brackets/actions/workflows/test.yaml)
[![Release](https://github.com/aliariff/vscode-auto-add-brackets/actions/workflows/release.yaml/badge.svg)](https://github.com/aliariff/vscode-auto-add-brackets/actions/workflows/release.yaml)

This extension will automatically add complete brackets when writing interpolated string.

This solution inspired from sublime text behaviour.

![Demo GIF](https://drive.google.com/uc?export=view&id=1kqZT4yOlKl_gyGOYuwzNSfy6BFRpl4SQ)

## Language Support

By default the following languages are enabled:

- Coffeescript
- Crystal
- Dart
- Elixir
- Embedded Crystal
- ERB
- Groovy
- Haml
- Javascript
- Javascript React
- Javascript Vue
- Kotlin
- Ruby
- Scala
- Slim
- Typescript
- Typescript React

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

> If you are a Vim mode user you should also add `vim.mode != 'Normal' && vim.mode != 'Visual' && vim.mode != 'VisualBlock' && vim.mode != 'VisualLine'` to your "when" clause

## Related issue:

[vscode-ruby/#200](https://github.com/rubyide/vscode-ruby/issues/200)

[vscode-ruby/#210](https://github.com/rubyide/vscode-ruby/issues/210)

## Credits

Icons made by [Icon Monk](https://www.flaticon.com/authors/icon-monk) from [www.flaticon.com](https://www.flaticon.com)
is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0)
