init_exec_pb();
function createServerSerializer(argsKey) {
  function serialize(id, args) {
    return new ExecServerMessage({
      id,
      message: { case: argsKey, value: args }
    });
  }
  return serialize;
}
function createClientDeserializer(resultKey) {
  return (result) => {
    if (result.message.case !== resultKey) {
      return void 0;
    }
    return result.message.value;
  };
}
function createClientSerializer(resultKey) {
  function serialize(id, result) {
    const message = {
      case: resultKey,
      value: result
    };
    return new ExecClientMessage({
      id,
      message
    });
  }
  return serialize;
}
function createServerDeserializer(argsKey) {
  function deserialize(result) {
    if (result.message.case !== argsKey) {
      return void 0;
    }
    return { id: result.id, args: result.message.value };
  }
  return deserialize;
}
