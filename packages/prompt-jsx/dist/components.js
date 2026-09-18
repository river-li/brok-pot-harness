var System = (props) => {
  return jsx("System", props);
};
var User = (props) => {
  return jsx("User", props);
};
var Assistant = (props) => {
  return jsx("Assistant", props);
};
var Tool = (props) => {
  return jsx("Tool", props);
};
var Conversation = (props) => {
  return jsx(Fragment, props);
};
var builtinComponents = {
  System,
  User,
  Assistant,
  Tool,
  Conversation,
  Fragment
};
