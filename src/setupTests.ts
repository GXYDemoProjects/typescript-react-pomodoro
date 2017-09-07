class LocalStorageMock {
  store: {};
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

class NotificationMock {
  constructor(title: string, options: {}) {
    //
  }

  static requestPermission() {
   // null 
  }
}

global.localStorage = new LocalStorageMock;
global.Notification = NotificationMock;