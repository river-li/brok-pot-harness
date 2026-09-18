function jsx(type2, props, ...children) {
  const normalizedProps = props || {};
  const allChildren = normalizedProps.children ? Array.isArray(normalizedProps.children) ? normalizedProps.children : [normalizedProps.children] : children;
  const filteredChildren = allChildren.filter((child) => child != null && typeof child !== "boolean" && child !== "");
  return {
    type: type2,
    props: Object.assign(Object.assign({}, normalizedProps), { children: filteredChildren.length > 0 ? filteredChildren : void 0 }),
    children: filteredChildren.length > 0 ? filteredChildren : void 0
  };
}
function Fragment(props) {
  return jsx("Fragment", props);
}
function jsxs(type2, props) {
  return jsx(type2, props);
}
