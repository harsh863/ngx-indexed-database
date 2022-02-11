import {IndexedDBStoreSchema} from "../models/IndexedDBStoreSchema";

export class HelperUtils {
  static indexedDBStoreNameBuilder(dbName: string, storeName: string): string {
    return `[${dbName.toUpperCase()}] ${storeName}`
  }

  static getIndexedDBStoreSchemaPrimaryKeys(storeSchema: IndexedDBStoreSchema): string[] {
    return Object.keys(storeSchema).filter(key => storeSchema[key].primary);
  }

  static promisifyIndexedDBRequest(request: IDBRequest, resolveMethod: string, rejectMethod?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (request as any)[resolveMethod] = (event: any) => resolve(event);
      if (rejectMethod) {
        (request as any)[rejectMethod] = (event: any) => reject(event);
      }
    })
  }
}
