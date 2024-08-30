export interface LocaleProps  {
  locale: string;
};

export type LangType = {
  header: {
    [key: string]: string;
  };
  nav: {
    [key: string]: string;
  };
};
