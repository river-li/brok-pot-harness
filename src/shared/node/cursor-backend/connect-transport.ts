function createSandConnectTransport(options2) {
  return createConnectTransport2({ ...options2, httpVersion: "1.1" });
}
