import {Injectable} from "@angular/core";
import {HelperUtils} from "../utils/helper.utils";
import {IndexedDBStoreSchema} from "../models/IndexedDBStoreSchema";
import {SCHEMA_STORE_NAME} from "../constants/schema-store.constant";

@Injectable()
export class NgxIndexedDatabaseStoreSchemaService {
  primaryKey = 'name';

  constructor() {}

  async defineSchemasStore(dbName: string) {
    try {
      const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName, 1);
      await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onupgradeneeded', 'onerror');
      const database: IDBDatabase = indexedDBOpenRequest.result;
      await database.createObjectStore(SCHEMA_STORE_NAME, { keyPath: this.primaryKey });

      await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
      database?.close();
    } catch (e) {}

    return { success: true };
  }

  async modifySchemaStore(dbName: string, storeName: string, storeSchema: IndexedDBStoreSchema): Promise<any> {
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    const data = {
      [this.primaryKey]: storeName,
      schema: encodeURIComponent(JSON.stringify(storeSchema))
    };

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(SCHEMA_STORE_NAME, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(SCHEMA_STORE_NAME);
    const updateRequest: IDBRequest = store.put(data);
    await HelperUtils.promisifyIndexedDBRequest(updateRequest, 'onsuccess', 'onerror');
    database?.close();

    return data;
  }

  async getStoreSchema(dbName: string, storeName: string): Promise<IndexedDBStoreSchema> {
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(SCHEMA_STORE_NAME, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(SCHEMA_STORE_NAME);
    const readRequest: IDBRequest = store.get(storeName);
    await HelperUtils.promisifyIndexedDBRequest(readRequest, 'onsuccess', 'onerror');
    database?.close();

    return JSON.parse(decodeURIComponent(readRequest?.result?.schema || null));
  }

  async removeStoreSchema(dbName: string, storeName: string): Promise<{ success: boolean }> {
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const transaction: IDBTransaction = database.transaction(SCHEMA_STORE_NAME, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(SCHEMA_STORE_NAME);
    const deleteRequest: IDBRequest = store.delete(storeName);
    await HelperUtils.promisifyIndexedDBRequest(deleteRequest, 'onsuccess', 'onerror');
    database?.close();

    return { success: true };
  }
}
