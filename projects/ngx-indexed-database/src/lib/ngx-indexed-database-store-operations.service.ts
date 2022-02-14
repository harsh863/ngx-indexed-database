import { Injectable } from '@angular/core';
import {InvalidArgumentsException} from "../exceptions/InvalidArgumentsException";
import {HelperUtils} from "../utils/helper.utils";

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
    const modifiedStoreName: string = HelperUtils.indexedDBStoreNameBuilder(dbName, storeName);
    const transaction: IDBTransaction = database.transaction(modifiedStoreName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(modifiedStoreName);
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
    const modifiedStoreName: string = HelperUtils.indexedDBStoreNameBuilder(dbName, storeName);
    const transaction: IDBTransaction = database.transaction(modifiedStoreName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(modifiedStoreName);
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
    const modifiedStoreName: string = HelperUtils.indexedDBStoreNameBuilder(dbName, storeName);
    const transaction: IDBTransaction = database.transaction(modifiedStoreName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(modifiedStoreName);
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
    const modifiedStoreName: string = HelperUtils.indexedDBStoreNameBuilder(dbName, storeName);
    const transaction: IDBTransaction = database.transaction(modifiedStoreName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(modifiedStoreName);
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
    const modifiedStoreName: string = HelperUtils.indexedDBStoreNameBuilder(dbName, storeName);
    const transaction: IDBTransaction = database.transaction(modifiedStoreName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(modifiedStoreName);
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
    const modifiedStoreName: string = HelperUtils.indexedDBStoreNameBuilder(dbName, storeName);
    const transaction: IDBTransaction = database.transaction(modifiedStoreName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(modifiedStoreName);
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
    const modifiedStoreName: string = HelperUtils.indexedDBStoreNameBuilder(dbName, storeName);
    const transaction: IDBTransaction = database.transaction(modifiedStoreName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(modifiedStoreName);
    const readRequest: IDBRequest = store.getAll();
    await HelperUtils.promisifyIndexedDBRequest(readRequest, 'onsuccess', 'onerror');
    database?.close();

    return readRequest?.result || [];
  }
}
