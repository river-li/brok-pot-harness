function createEventChannel(options2) {
  const subscribers = new SubscriberList(options2.onSubscriberError);
  let isDisposed = false;
  return [
    {
      send(event) {
        if (isDisposed) {
          return;
        }
        subscribers.send(event);
      },
      dispose() {
        if (isDisposed) {
          return;
        }
        isDisposed = true;
        subscribers.clear();
      }
    },
    {
      subscribe(subscriber) {
        if (isDisposed) {
          return NOOP_SUBSCRIPTION;
        }
        return subscribers.subscribe(subscriber);
      }
    }
  ];
}
function createWatchChannel(options2) {
  const subscribers = new SubscriberList(options2.onSubscriberError);
  let currentValue = options2.initialValue;
  let isDisposed = false;
  return [
    {
      send(value) {
        if (isDisposed) {
          return;
        }
        currentValue = value;
        subscribers.send();
      },
      dispose() {
        if (isDisposed) {
          return;
        }
        isDisposed = true;
        subscribers.clear();
      }
    },
    {
      get() {
        return currentValue;
      },
      subscribe(subscriber) {
        if (isDisposed) {
          return NOOP_SUBSCRIPTION;
        }
        return subscribers.subscribe(subscriber);
      }
    }
  ];
}
var NOOP_SUBSCRIPTION = { dispose() {
} };
var SubscriberList = class {
  constructor(onSubscriberError) {
    this.onSubscriberError = onSubscriberError;
    this.subscribers = [];
  }
  /**
   * Adds a subscriber and returns a handle that removes it.
   */
  subscribe(subscriber) {
    const subscribers = this.subscribers;
    subscribers.push(subscriber);
    let isDisposed = false;
    return {
      dispose() {
        if (isDisposed) {
          return;
        }
        isDisposed = true;
        const index = subscribers.indexOf(subscriber);
        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      }
    };
  }
  /**
   * Delivers a value to the subscribers present when delivery begins.
   *
   * Subscription changes during delivery affect only later sends.
   */
  send(...args) {
    for (const subscriber of [...this.subscribers]) {
      try {
        subscriber(...args);
      } catch (err) {
        this.onSubscriberError(err);
      }
    }
  }
  /**
   * Removes all subscribers.
   */
  clear() {
    this.subscribers.length = 0;
  }
};
