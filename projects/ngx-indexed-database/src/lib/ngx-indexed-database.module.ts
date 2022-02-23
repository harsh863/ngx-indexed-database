import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgxIndexedDatabaseService} from "./ngx-indexed-database.service";
import {NgxIndexedDatabaseStoreOperationsService} from "./ngx-indexed-database-store-operations.service";
import {NgxIndexedDatabaseStoreSchemaService} from "./ngx-indexed-database-store-schema.service";



@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    NgxIndexedDatabaseService,
    NgxIndexedDatabaseStoreOperationsService,
    NgxIndexedDatabaseStoreSchemaService
  ]
})
export class NgxIndexedDatabaseModule { }
