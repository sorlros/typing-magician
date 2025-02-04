export interface LocaleProps  {
  locale: string;
};

export type LangType = {
  header: {
    [key: string]: string;
  };
};

export interface DotsProps {
  typingSpeed: number;
}

export interface FileContent {
  file: string;
  content: string;
}

export interface TextItem {
  title: string;
  content: string;
}

export type FileContentArray = FileContent[];