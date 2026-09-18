var DisposableStore = class {
  constructor() {
    this.disposables = /* @__PURE__ */ new Set();
    this._isDisposed = false;
  }
  get isDisposed() {
    return this._isDisposed;
  }
  /**
   * Registers a disposable and returns the same instance.
   *
   * If the store has already been disposed, the item is disposed immediately
   * rather than being stored.
   *
   * Throws if the store is asked to register itself.
   */
  add(disposable) {
    if (Object.is(disposable, this)) {
      throw new Error("Cannot add a DisposableStore to itself");
    }
    if (this._isDisposed) {
      disposable.dispose();
    } else {
      this.disposables.add(disposable);
    }
    return disposable;
  }
  /**
   * Disposes all registered items and marks the store as disposed.
   *
   * Idempotent: subsequent calls are no-ops.
   */
  dispose() {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    this.clear();
  }
  /**
   * Disposes all registered items in reverse registration order without
   * marking the store as disposed.
   *
   * Disposal errors do not prevent the remaining items from being disposed.
   *
   * A single error is rethrown unchanged; multiple errors are collected in
   * an `AggregateError`.
   */
  clear() {
    const disposables = [...this.disposables];
    this.disposables.clear();
    const errors = [];
    for (let i = disposables.length - 1; i >= 0; i--) {
      try {
        disposables[i].dispose();
      } catch (err) {
        errors.push(err);
      }
    }
    if (errors.length === 1) {
      throw errors[0];
    }
    if (errors.length > 1) {
      throw new AggregateError(errors, "Encountered errors while disposing of store");
    }
  }
};
