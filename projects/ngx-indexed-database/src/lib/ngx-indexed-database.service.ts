import { Injectable } from '@angular/core';
import {IndexedDBStoreSchema} from "../models/IndexedDBStoreSchema";
import {InvalidArgumentsException} from "../exceptions/InvalidArgumentsException";
import {HelperUtils} from "../utils/helper.utils";
import {PrimaryKeysCountException} from "../exceptions/PrimaryKeysCountException";
import {IndexedDBKeysDataType} from "../enums/IndexedDBKeysDataType";
import {NgxIndexedDatabaseStoreSchemaService} from "./ngx-indexed-database-store-schema.service";
import {isEqual} from "lodash";
import {SCHEMA_STORE_NAME} from "../constants/schema-store.constant";
import {InvalidStoreNameException} from "../exceptions/InvalidStoreNameException";

@Injectable({
  providedIn: 'root'
})
export class NgxIndexedDatabaseService {

  constructor(private _ngxIndexedDatabaseStoreSchemaService: NgxIndexedDatabaseStoreSchemaService) { }

  public async createStore(dbName: string, storeName: string, storeSchema: IndexedDBStoreSchema): Promise<{ success: boolean }> {
    if (!dbName || !storeName) {
      throw new InvalidArgumentsException();
    }
    if (storeName === SCHEMA_STORE_NAME) {
      throw new InvalidStoreNameException();
    }
    const primaryKeys = HelperUtils.getIndexedDBStoreSchemaPrimaryKeys(storeSchema);
    if (primaryKeys.length !== 1) {
      throw new PrimaryKeysCountException();
    }

    await this._ngxIndexedDatabaseStoreSchemaService.defineSchemasStore(dbName);
    const alreadyExistingSchema = await this._ngxIndexedDatabaseStoreSchemaService.getStoreSchema(dbName, storeName);
    const ifSchemasIdentical = isEqual(alreadyExistingSchema, storeSchema);

    if (ifSchemasIdentical) {
      return { success: true };
    }

    if (alreadyExistingSchema && !ifSchemasIdentical) {
      await this.deleteStore(dbName, storeName);
    }

    await this._ngxIndexedDatabaseStoreSchemaService.modifySchemaStore(dbName, storeName, storeSchema);

    const version = (await HelperUtils.getDatabaseVersion(dbName)) + 1;
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName, version);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onupgradeneeded');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    const store: IDBObjectStore = database.createObjectStore(storeName, { keyPath: primaryKeys[0] });
    for (const attribute in storeSchema) {
      if ([IndexedDBKeysDataType.STRING, IndexedDBKeysDataType.INTEGER].includes(storeSchema[attribute].datatype)) {
        store.createIndex(attribute, attribute, { unique: storeSchema[attribute]?.unique || false });
      }
    }

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onsuccess', 'onerror');
    database?.close();

    return { success: true };
  }

  public async deleteStore(dbName: string, storeName: string): Promise<{ success: boolean }>  {
    if (!dbName || !storeName) {
      throw new InvalidArgumentsException();
    }

    const version = (await HelperUtils.getDatabaseVersion(dbName)) + 1;
    const indexedDBOpenRequest: IDBOpenDBRequest = indexedDB.open(dbName, version);

    await HelperUtils.promisifyIndexedDBRequest(indexedDBOpenRequest, 'onupgradeneeded');
    const database: IDBDatabase = indexedDBOpenRequest.result;
    database.deleteObjectStore(storeName);
    database?.close();

    return { success: true };
  }
}
