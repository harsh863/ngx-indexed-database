export class PrimaryKeysCountException extends Error {
  constructor() {
    super('There must be only one primary key');
  }
}
