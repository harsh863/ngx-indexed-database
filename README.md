<div align="center">
    <img src="https://w3c.github.io/IndexedDB/logo-db.svg" width="120"/>
</div>
<h1 align="center">ngx-indexed-database</h1>

<p align="center">
<b><i>
ngx-indexed-database ships multiple angular services that ease your interaction with IndexedDB.
<br>
Its exposes various promise based method which boosts your productivity many times.
</i></b>
</p>
<p align="center">
		<a href="https://www.npmjs.com/package/ngx-indexed-database"><img alt="NPM Version" src="https://img.shields.io/npm/v/ngx-indexed-database.svg" height="20"/></a>
    <a href="https://www.npmjs.com/package/ngx-indexed-database"><img alt="Total downloads" src="https://img.shields.io/npm/dt/ngx-indexed-database.svg" height="20"/></a>
</p>

## Usage

### NgxIndexedDatabase module
<p style="font-size: 16px">Add <code>NgxIndexedDatabaseModule</code> into your NgModule imports:</p>

```ts
import { NgxIndexedDatabaseModule } from "ngx-indexed-database";

@NgModule({
  ...
    imports: [ NgxIndexedDatabaseModule, ... ],
...
})
```

### NgxIndexedDatabase service
<p style="font-size: 16px">Import and inject the service in the component where you want to handle store interaction.</p>

```ts
import { NgxIndexedDatabaseService } from "ngx-indexed-database";

...
export class XYZComponent {
  constructor(private _ngxIndexedDBService: NgxIndexedDBService) {}
}
```
<p style="font-size: 16px">or</p>
<p style="font-size: 16px">You can get instance of service using this:</p>

```ts
const ngxIndexedDBService = NgxIndexedDBService.getInstance();
```

<p style="font-size: 16px"><code>NgxIndexedDatabaseService</code> provides two methods to create and delete data store.</p>

#### Create
```ts
import { IndexedDBKeysDataType, IndexedDBStoreSchema, NgxIndexedDatabaseService } from "ngx-indexed-database";

...

const dbName = 'ngx-indexed-database';
const storeName = 'users';
const storeSchema: IndexedDBStoreSchema = {
  id: { primary: true, unique: true, datatype: IndexedDBKeysDataType.INTEGER },
  user_name: { datatype: IndexedDBKeysDataType.STRING },
  email: { datatype: IndexedDBKeysDataType.STRING },
};
this._ngxIndexedDBService.createStore(dbName, storeName, storeSchema);
```

<p style="font-size: 15px"><strong>Note: </strong>Whenever store schema is updated old store will be migrated to newer version.</p>

#### Delete
```ts
import { IndexedDBKeysDataType, IndexedDBStoreSchema, NgxIndexedDatabaseService } from "ngx-indexed-database";

...

const dbName = 'ngx-indexed-database';
const storeName = 'users';
this._ngxIndexedDBService.deleteStore(dbName, storeName);
```

### NgxIndexedDatabaseStoreOperations service
<p style="font-size: 16px">Import and inject the service in the component where you want to manipulate or access store data.</p>

```ts
import { NgxIndexedDatabaseStoreOperationsService } from "ngx-indexed-database";

...
export class XYZComponent {
  constructor(private _ngxIndexedDatabaseStoreOperationsService: NgxIndexedDatabaseStoreOperationsService) {}
}
```
<p style="font-size: 16px"><code>NgxIndexedDatabaseStoreOperationsService</code> provides following methods:</p>

#### upsert
<p style="font-size: 16px">Insert the new entries in store and update the existing one</p>

```ts
const data = { id: 1, user_name: 'test123', email: 'test@test.com' }; 
this._ngxIndexedDatabaseStoreOperationsService.upsert(dbName, storeName, data);
```
#### delete
<p style="font-size: 16px">Delete the entry by primary key</p>

```ts
this._ngxIndexedDatabaseStoreOperationsService.delete(dbName, storeName, 1);
```
#### deleteBy
<p style="font-size: 16px">Delete the entry by specific key</p>

```ts
this._ngxIndexedDatabaseStoreOperationsService.deleteBy(dbName, storeName, "user_name", "test123");
```

#### clear
<p style="font-size: 16px">Remove all the entries from specified store</p>

```ts
this._ngxIndexedDatabaseStoreOperationsService.clear(dbName, storeName);
```
#### find
<p style="font-size: 16px">Find the entry by primary key</p>

```ts
this._ngxIndexedDatabaseStoreOperationsService.find(dbName, storeName, 1);
```
#### findBy
<p style="font-size: 16px">Delete the entry by specific key</p>

```ts
this._ngxIndexedDatabaseStoreOperationsService.findBy(dbName, storeName, "user_name", "test123");
```
#### findMany
<p style="font-size: 16px">Find the entries by primary keys</p>

```ts
this._ngxIndexedDatabaseStoreOperationsService.findMany(dbName, storeName, [1, 2, 3]);
```

#### findManyBy
<p style="font-size: 16px">Find the entries by specified key</p>

```ts
this._ngxIndexedDatabaseStoreOperationsService.findManyBy(dbName, storeName, 'user_name', ['test123', 'test456']);
```
#### fetchAll
<p style="font-size: 16px">Return all the entries in specified store</p>

```ts
this._ngxIndexedDatabaseStoreOperationsService.fetchAll(dbName, storeName);
```

#### resetStores
<p style="font-size: 16px">Clear data from all the stores in specified database.</p>

```ts
this._ngxIndexedDatabaseStoreOperationsService.resetStores(dbName);

this._ngxIndexedDatabaseStoreOperationsService.resetStores(dbName, {
    exclude: ['ABC']
});

this._ngxIndexedDatabaseStoreOperationsService.resetStores(dbName, {
  only: ['DEF']
});
```

## Enum

```ts
export enum IndexedDBKeysDataType {
  STRING,
  INTEGER,
  OBJECT,
  ARRAY,
  BOOLEAN,
  ANY
}
```

## Interfaces

```ts
export interface IndexedDBStoreSchema {
  [key: string]: {
    primary?: boolean;
    unique?: boolean;
    datatype: IndexedDBKeysDataType
  }
}
```

## Author

<img src="https://avatars.githubusercontent.com/u/53868138?s=400&u=af1bb288033e40fde4f68cfc6ed4b10f7a696316&v=4" alt="Harsh Mittal Github" width="100"/>

**[Harsh Mittal](https://github.com/harsh863/)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/harsh863/)
[![StackOverflow](https://img.shields.io/badge/Stack_Overflow-FE7A16?logo=stack-overflow&logoColor=white)](https://stackoverflow.com/users/12774193/harsh-mittal)
[![DEV](https://img.shields.io/badge/DEV-%23000000.svg?logo=dev.to&logoColor=white)](https://dev.to/harsh863)
[![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?logo=facebook&logoColor=white)](https://www.facebook.com/harsh863)

<a href="https://www.buymeacoffee.com/harsh863" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40"></a>
