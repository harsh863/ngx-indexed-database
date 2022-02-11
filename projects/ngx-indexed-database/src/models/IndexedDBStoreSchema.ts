import {IndexedDBKeysDataType} from "../enums/IndexedDBKeysDataType";

export interface IndexedDBStoreSchema {
  [key: string]: {
    primary?: boolean;
    unique?: boolean;
    datatype: IndexedDBKeysDataType
  }
}
