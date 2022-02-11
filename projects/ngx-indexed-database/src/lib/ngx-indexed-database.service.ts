import { Injectable } from '@angular/core';
import {IndexedDBStoreSchema} from "../models/IndexedDBStoreSchema";
import {InvalidArgumentsException} from "../exceptions/InvalidArgumentsException";
import {HelperUtils} from "../utils/helper.utils";
import {PrimaryKeysCountException} from "../exceptions/PrimaryKeysCountException";
import {IndexedDBKeysDataType} from "../enums/IndexedDBKeysDataType";

@Injectable({
  providedIn: 'root'
})
export class NgxIndexedDatabaseService {

  constructor() { }

  public async createStore(dbName: string, storeName: string, version: number, storeSchema: IndexedDBStoreSchema): Promise<{ success: boolean }> {
    if (!dbName || !storeName || !version || version < 1) {
      throw new InvalidArgumentsException();
    }
    const primaryKeys = HelperUtils.getIndexedDBStoreSchemaPrimaryKeys(storeSchema);
    if (primaryKeys.length !== 1) {
      throw new PrimaryKeysCountException();
    }
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName, version);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onupgradeneeded');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const modifiedStoreName: string = HelperUtils.indexedDBStoreNameBuilder(dbName, storeName)
    const store: IDBObjectStore = database.createObjectStore(modifiedStoreName, { keyPath: primaryKeys[0] });
    for (const attribute in storeSchema) {
      if ([IndexedDBKeysDataType.STRING, IndexedDBKeysDataType.INTEGER].includes(storeSchema[attribute].datatype)) {
        store.createIndex(attribute, attribute, { unique: storeSchema[attribute]?.unique || false });
      }
    }

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    database?.close();

    return { success: true };
  }

  public async deleteStore(dbName: string, storeName: string, version: number): Promise<{ success: boolean }>  {
    if (!dbName || !storeName || !version || version < 1) {
      throw new InvalidArgumentsException();
    }

    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName, version);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onupgradeneeded');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const modifiedStoreName: string = HelperUtils.indexedDBStoreNameBuilder(dbName, storeName)
    database.deleteObjectStore(modifiedStoreName);
    database?.close();

    return { success: true };
  }
}
