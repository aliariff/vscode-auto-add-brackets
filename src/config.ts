import { workspace } from 'vscode';

export interface Language {
  symbol: string;
  stringWrapper: string;
}

export interface Configuration {
  languages: { [languageId: string]: Language };
}

function Config(): Configuration {
  const languages = workspace.getConfiguration('auto').get('languages', {});

  return {
    languages: languages,
  };
}

export default Config();
