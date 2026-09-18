function startFlight() {
  let fulfil = () => {
  };
  let reject2 = (_error) => {
  };
  const settled = new Promise((resolve29, fail) => {
    fulfil = resolve29;
    reject2 = fail;
  });
  return { settled, fulfil, reject: reject2 };
}
function createSingleFlight(spec) {
  let flight = null;
  let isDisposed = false;
  const land = (current, effect) => {
    if (flight !== current) {
      current.fulfil();
      return;
    }
    flight = null;
    try {
      effect();
    } catch (error41) {
      current.reject(error41);
      return;
    }
    current.fulfil();
  };
  return {
    get isInFlight() {
      return flight != null;
    },
    run: () => {
      if (isDisposed) return Promise.resolve();
      if (flight != null) return flight.settled;
      const current = startFlight();
      flight = current;
      spec.read().then(
        (result) => {
          land(current, () => spec.install(result));
        },
        (error41) => {
          land(current, () => {
            if (spec.installFailure == null) throw error41;
            spec.installFailure(error41);
          });
        }
      );
      return current.settled;
    },
    supersede: () => {
      flight = null;
    },
    dispose: () => {
      isDisposed = true;
      flight = null;
    }
  };
}
