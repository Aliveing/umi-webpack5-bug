/*
 * @Date: 2021-07-15 09:24:37
 * @LastEditors: Alive
 * @FilePath: /src/utils/storage.ts
 */
class Storage {
  storage: globalThis.Storage

  constructor() {
    this.storage = window.localStorage;
  }

  getItem = (key: string) => {
    return this.storage.getItem(key);
  }

  setItem = (key: string, value: any): void => {
    this.storage.setItem(key, JSON.stringify(value));
  }

  removeItem = (key: string): void => {
    this.storage.removeItem(key);
  }

  clearStorage = (): void => {
    return this.storage.clear();
  }
}

export default new Storage();