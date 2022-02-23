import {SCHEMA_STORE_NAME} from "../constants/schema-store.constant";

export class InvalidStoreNameException extends Error {
  constructor() {
    super(`Store name cannot be equal to ${SCHEMA_STORE_NAME}`);
  }
}
