import { workspace } from "vscode";

export interface Language {
  symbol: string;
  stringWrapper: string;
  heredocSupport: boolean
}

export interface Configuration {
  languages: { [languageId: string]: Language };
}

function config(): Configuration {
  const languages = workspace.getConfiguration("auto").get("languages", {});

  return {
    languages: languages,
  };
}

export default config();
