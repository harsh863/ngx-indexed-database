import { Injectable } from '@angular/core';
import {InvalidArgumentsException} from "../exceptions/InvalidArgumentsException";
import {HelperUtils} from "../utils/helper.utils";
import {isExcludeConfig, StoresResetOptions} from "../types/stores-reset-options.type";

@Injectable({
  providedIn: 'root'
})
export class NgxIndexedDatabaseStoreOperationsService {

  constructor() { }

  public async upsert<T>(dbName: string, storeName: string, data: T): Promise<T> {
    if (!dbName || !storeName || !data) {
      throw new InvalidArgumentsException();
    }

    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(storeName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(storeName);
    const updateRequest: IDBRequest = store.put(data);
    await HelperUtils.promisifyIndexedDBRequest(updateRequest, 'onsuccess', 'onerror');
    database?.close();

    return data;
  }

  public async delete(dbName: string, storeName: string, value: any): Promise<{ success: boolean }> {
    if (!dbName || !storeName || !value) {
      throw new InvalidArgumentsException();
    }
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(storeName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(storeName);
    const deleteRequest: IDBRequest = store.delete(value);
    await HelperUtils.promisifyIndexedDBRequest(deleteRequest, 'onsuccess', 'onerror');
    database?.close();

    return { success: true };
  }

  public async deleteBy(dbName: string, storeName: string, key: string, value: any): Promise<{ success: boolean }> {
    if (!dbName || !storeName || !key || !value) {
      throw new InvalidArgumentsException();
    }
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(storeName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(storeName);
    const primaryKeyIndex: IDBIndex = store.index(key)
    const cursorOpenRequest: IDBRequest = primaryKeyIndex.openCursor(IDBKeyRange.only(value));
    await HelperUtils.promisifyIndexedDBRequest(cursorOpenRequest, 'onsuccess', 'onerror');
    const deleteRequest: IDBRequest = cursorOpenRequest.result?.delete();
    await HelperUtils.promisifyIndexedDBRequest(deleteRequest, 'onsuccess', 'onerror');
    database?.close();

    return { success: true };
  }

  public async clear(dbName: string, storeName: string): Promise<{ success: boolean }> {
    if (!dbName || !storeName) {
      throw new InvalidArgumentsException();
    }
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(storeName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(storeName);
    const clearRequest: IDBRequest = store.clear();
    await HelperUtils.promisifyIndexedDBRequest(clearRequest, 'onsuccess', 'onerror');
    database?.close();

    return { success: true };
  }

  public async find<T>(dbName: string, storeName: string, value: any): Promise<T | null> {
    if (!dbName || !storeName || !value) {
      throw new InvalidArgumentsException();
    }

    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(storeName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(storeName);
    const readRequest: IDBRequest = store.get(value);
    await HelperUtils.promisifyIndexedDBRequest(readRequest, 'onsuccess', 'onerror');
    database?.close();

    return readRequest?.result || null;
  }

  public async findBy<T>(dbName: string, storeName: string, key: string, value: any): Promise<T | null> {
    if (!dbName || !storeName || !key || !value) {
      throw new InvalidArgumentsException();
    }
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(storeName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(storeName);
    const keyIndex = store.index(key);
    const readRequest: IDBRequest = keyIndex.get(value);
    await HelperUtils.promisifyIndexedDBRequest(readRequest, 'onsuccess', 'onerror');
    database?.close();

    return readRequest?.result || null;
  }

  public async findMany<T>(dbName: string, storeName: string, values: any[]): Promise<T[]> {
    const entriesMap: { [value: string]: T } = {};
    for (const value of values) {
      const data: T | null = await this.find<T>(dbName, storeName, value);
      if (data) {
        entriesMap[value + ''] = data;
      }
    }
    return Object.values(entriesMap);
  }

  public async findManyBy<T>(dbName: string, storeName: string, key: string, values: any[]): Promise<T[]> {
    const entriesMap: { [value: string]: T } = {};
    for (const value of values) {
      const data: T | null = await this.findBy<T>(dbName, storeName, key, value);
      if (data) {
        entriesMap[value + ''] = data;
      }
    }
    return Object.values(entriesMap);
  }

  public async fetchAll<T>(dbName: string, storeName: string): Promise<T[]> {
    if (!dbName || !storeName) {
      throw new InvalidArgumentsException();
    }

    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(storeName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(storeName);
    const readRequest: IDBRequest = store.getAll();
    await HelperUtils.promisifyIndexedDBRequest(readRequest, 'onsuccess', 'onerror');
    database?.close();

    return readRequest?.result || [];
  }

  public async resetStores(dbName: string, options?: StoresResetOptions): Promise<any> {
    if (!dbName) {
      throw new InvalidArgumentsException();
    }

    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const allObjectStoreNames: string[] = (Object.values({...database.objectStoreNames}) as string[]);
    const objectStoreNamesToBeCleared: string[] = allObjectStoreNames
      .filter(
        (storeName: string) =>
        options ?
          (
            isExcludeConfig(options) ?
            !(options.exclude || []).includes(storeName) :
            (options.only || allObjectStoreNames).includes(storeName)
          ) :
          true
      )
    database?.close();

    const objectStoreClearRequests = objectStoreNamesToBeCleared.map((storeName: string) => this.clear(dbName, storeName));
    return Promise.all(objectStoreClearRequests);
  }
}
