export type StoresResetOptions = StoreResetOptionExclude | StoreResetOptionOnly;

interface StoreResetOptionExclude {
  only?: never;
  exclude: string[];
}

interface StoreResetOptionOnly {
  only: string[];
  exclude?: never;
}

export const isExcludeConfig = (data: any): data is StoreResetOptionExclude => {
  return 'exclude' in data;
}
