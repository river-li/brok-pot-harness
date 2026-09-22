/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/context_ast_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage126, __protoMessage3121, ContextAST, ContainerTree, ContainerTreeNode, ContainerTreeNode_Symbol, ContainerTreeNode_Container, ContainerTreeNode_Blob, ContainerTreeNode_Reference;
var init_context_ast_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/context_ast_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage126 = "aiserver.v1.";
    __protoMessage3121 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage126;
      }
    };
    ContextAST = class _ContextAST extends __protoMessage3121 {
      constructor(data) {
        super();
        this.files = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextAST().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextAST().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextAST().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextAST, a, b2);
      }
      static $() {
        return ["ContextAST|1 files #0*", ContainerTree];
      }
    };
    ContainerTree = class _ContainerTree extends __protoMessage3121 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.nodes = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContainerTree().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContainerTree().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContainerTree().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContainerTree, a, b2);
      }
      static $() {
        return ["ContainerTree|1 relative_workspace_path 9|2 nodes #0*", ContainerTreeNode];
      }
    };
    ContainerTreeNode = class _ContainerTreeNode extends __protoMessage3121 {
      constructor(data) {
        super();
        this.node = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContainerTreeNode().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContainerTreeNode().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContainerTreeNode().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContainerTreeNode, a, b2);
      }
      static $() {
        return ["ContainerTreeNode|1 container #0 node|2 blob #1 node|3 symbol #2 node", ContainerTreeNode_Container, ContainerTreeNode_Blob, ContainerTreeNode_Symbol];
      }
    };
    ContainerTreeNode_Symbol = class _ContainerTreeNode_Symbol extends __protoMessage3121 {
      constructor(data) {
        super();
        this.docString = "";
        this.value = "";
        this.references = [];
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContainerTreeNode_Symbol().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContainerTreeNode_Symbol().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContainerTreeNode_Symbol().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContainerTreeNode_Symbol, a, b2);
      }
      static $() {
        return ["ContainerTreeNode.Symbol|1 doc_string 9|2 value 9|6 references #0*|7 score 1", ContainerTreeNode_Reference];
      }
    };
    ContainerTreeNode_Container = class _ContainerTreeNode_Container extends __protoMessage3121 {
      constructor(data) {
        super();
        this.docString = "";
        this.header = "";
        this.trailer = "";
        this.children = [];
        this.references = [];
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContainerTreeNode_Container().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContainerTreeNode_Container().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContainerTreeNode_Container().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContainerTreeNode_Container, a, b2);
      }
      static $() {
        return ["ContainerTreeNode.Container|1 doc_string 9|2 header 9|3 trailer 9|5 children #0*|6 references #1*|7 score 1", ContainerTreeNode, ContainerTreeNode_Reference];
      }
    };
    ContainerTreeNode_Blob = class _ContainerTreeNode_Blob extends __protoMessage3121 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContainerTreeNode_Blob().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContainerTreeNode_Blob().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContainerTreeNode_Blob().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContainerTreeNode_Blob, a, b2);
      }
      static $() {
        return ["ContainerTreeNode.Blob|1 value 9?"];
      }
    };
    ContainerTreeNode_Reference = class _ContainerTreeNode_Reference extends __protoMessage3121 {
      constructor(data) {
        super();
        this.value = "";
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContainerTreeNode_Reference().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContainerTreeNode_Reference().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContainerTreeNode_Reference().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContainerTreeNode_Reference, a, b2);
      }
      static $() {
        return ["ContainerTreeNode.Reference|1 value 9|2 relative_workspace_path 9"];
      }
    };
  }
});

