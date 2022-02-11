import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgxIndexedDatabaseService} from "./ngx-indexed-database.service";
import {NgxIndexedDatabaseStoreOperationsService} from "./ngx-indexed-database-store-operations.service";



@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    NgxIndexedDatabaseService,
    NgxIndexedDatabaseStoreOperationsService
  ]
})
export class NgxIndexedDatabaseModule { }
