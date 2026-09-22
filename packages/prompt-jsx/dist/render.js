/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/prompt-jsx/dist/render.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __rest3 = function(s3, e) {
  var t = {};
  for (var p2 in s3) if (Object.prototype.hasOwnProperty.call(s3, p2) && e.indexOf(p2) < 0)
    t[p2] = s3[p2];
  if (s3 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s3); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s3, p2[i]))
        t[p2[i]] = s3[p2[i]];
    }
  return t;
};
var RenderContext = class {
  constructor(options2) {
    this.metadata = {};
    this.components = Object.assign(Object.assign({}, builtinComponents), options2.components);
  }
  /**
   * Main rendering function that converts nodes to messages
   */
  renderToMessages(node) {
    if (node == null || typeof node === "boolean") {
      return [];
    }
    if (typeof node === "string" || typeof node === "number") {
      return [
        {
          role: "user",
          content: String(node)
        }
      ];
    }
    if (Array.isArray(node)) {
      return node.flatMap((child) => this.renderToMessages(child));
    }
    const element = node;
    return this.renderElement(element);
  }
  /**
   * Renders a single element
   */
  renderElement(element) {
    if (typeof element.type === "function") {
      const result = element.type(element.props);
      return this.renderToMessages(result);
    }
    if (typeof element.type === "string") {
      return this.renderIntrinsicElement(element.type, element.props);
    }
    throw new Error(`Unknown element type: ${element.type}`);
  }
  /**
   * Renders built-in/intrinsic elements
   */
  renderIntrinsicElement(type2, props) {
    switch (type2) {
      case "System":
        return [
          Object.assign({ role: "system", content: this.renderContent(props.children) }, props.name && { name: props.name })
        ];
      case "User":
        return [
          Object.assign({ role: "user", content: this.renderContent(props.children) }, props.name && { name: props.name })
        ];
      case "Assistant":
        return [
          Object.assign({ role: "assistant", content: this.renderContent(props.children) }, props.name && { name: props.name })
        ];
      case "Tool":
        return [
          Object.assign({ role: "tool", content: this.renderContent(props.children), toolCallId: props.tool_call_id }, props.name && { name: props.name })
        ];
      case "Fragment":
        return this.renderToMessages(props.children);
      case "p":
      case "section":
      case "ul":
      case "ol":
      case "li":
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
      case "x":
      case "pre":
        return [];
      case "br":
        return [];
      default:
        if (this.components[type2]) {
          const result = this.components[type2](props);
          return this.renderToMessages(result);
        }
        throw new Error(`Unknown component type: ${type2}`);
    }
  }
  /**
   * Renders content (children) to a string with React-like whitespace handling
   */
  renderContent(children) {
    if (children == null || typeof children === "boolean") {
      return "";
    }
    if (typeof children === "string" || typeof children === "number") {
      return String(children);
    }
    if (Array.isArray(children)) {
      return this.renderParagraphAwareContent(children);
    }
    return this.renderContentNode(children);
  }
  /**
   * Renders a single content node, handling paragraphs specially
   */
  renderContentNode(node) {
    if (node == null || typeof node === "boolean") {
      return "";
    }
    if (typeof node === "string" || typeof node === "number") {
      return String(node);
    }
    if (Array.isArray(node)) {
      const flattened = [];
      for (const item of node) {
        if (Array.isArray(item)) {
          flattened.push(...item);
        } else {
          flattened.push(item);
        }
      }
      return this.renderParagraphAwareContent(flattened);
    }
    const element = node;
    if (typeof element.type === "function") {
      const renderedNode = element.type(element.props);
      return this.renderContent(renderedNode);
    }
    if (element.type === "p") {
      const paragraphContent = this.renderContent(element.props.children);
      return paragraphContent;
    }
    if (element.type === "Fragment") {
      return this.renderContent(element.props.children);
    }
    if (element.type === "h1" || element.type === "h2" || element.type === "h3" || element.type === "h4" || element.type === "h5" || element.type === "h6") {
      const headingContent = this.renderContent(element.props.children);
      return this.formatHeading(element.type, headingContent);
    }
    if (element.type === "x") {
      return this.renderXElement(element.props);
    }
    if (element.type === "section") {
      return this.renderSection(element.props);
    }
    if (element.type === "br") {
      return "\n";
    }
    if (element.type === "pre") {
      return this.renderPreContent(element.props.children);
    }
    if (element.type === "ul") {
      return this.renderUnorderedList(element.props.children);
    }
    if (element.type === "ol") {
      return this.renderOrderedList(element.props.children);
    }
    if (element.type === "li") {
      const itemContent = this.renderContent(element.props.children);
      return `- ${itemContent}`;
    }
    const messages2 = this.renderToMessages(element);
    return messages2.map((msg) => msg.content).join("\n");
  }
  /**
   * Renders content with paragraph-aware spacing
   */
  renderParagraphAwareContent(nodes) {
    const flattenedNodes = this.flattenNodes(nodes);
    const paragraphs = [];
    let currentParagraph = [];
    const flushCurrentParagraph = () => {
      if (currentParagraph.length > 0) {
        const content = currentParagraph.join("");
        if (content.trim()) {
          paragraphs.push({
            content: this.normalizeWhitespace(content),
            isSection: false
          });
        } else if (content.includes("\n")) {
          paragraphs.push({
            content,
            isSection: false
          });
        }
        currentParagraph = [];
      }
    };
    for (const node of flattenedNodes) {
      if (node && typeof node === "object" && !Array.isArray(node) && "type" in node) {
        const element = node;
        if (typeof element.type === "function") {
          const resolvedNode = element.type(element.props);
          if (this.isBlockElement(resolvedNode)) {
            flushCurrentParagraph();
            const content = this.renderContentNode(resolvedNode);
            if (content.trim()) {
              const isSection = this.isSectionElement(resolvedNode);
              paragraphs.push({ content: content.trim(), isSection });
            }
          } else {
            const resolvedNodes = this.flattenNodes(Array.isArray(resolvedNode) ? resolvedNode : [resolvedNode]);
            for (const resolvedChild of resolvedNodes) {
              const rendered = this.renderContentNode(resolvedChild);
              if (rendered) {
                currentParagraph.push(rendered);
              }
            }
          }
        } else if (element.type === "p" || element.type === "section" || element.type === "ul" || element.type === "ol" || element.type === "h1" || element.type === "h2" || element.type === "h3" || element.type === "h4" || element.type === "h5" || element.type === "h6" || element.type === "x" || element.type === "pre") {
          flushCurrentParagraph();
          const content = this.renderContentNode(element);
          const isPre = element.type === "pre";
          const finalContent = isPre ? content : content.trim();
          if (finalContent || isPre) {
            const isSection = element.type === "section";
            paragraphs.push({ content: finalContent, isSection });
          }
        } else {
          const rendered = this.renderContentNode(node);
          if (rendered !== null && rendered !== void 0) {
            currentParagraph.push(rendered);
          }
        }
      } else {
        const rendered = this.renderContentNode(node);
        if (rendered) {
          currentParagraph.push(rendered);
        }
      }
    }
    flushCurrentParagraph();
    if (paragraphs.length === 0) {
      return "";
    }
    let result = paragraphs[0].content;
    for (let i = 1; i < paragraphs.length; i++) {
      const prev = paragraphs[i - 1];
      const curr = paragraphs[i];
      const currIsOnlyNewlines = !curr.content.trim();
      const prevHasContentAndEndsWithNewline = prev.content.trim() && prev.content.endsWith("\n");
      if (currIsOnlyNewlines) {
        result += curr.content;
      } else if (prevHasContentAndEndsWithNewline) {
        result += curr.content;
      } else {
        result += `

${curr.content}`;
      }
    }
    return result.replace(/^\n+/, "").replace(/\n+$/, "");
  }
  /**
   * Flattens nodes by resolving Fragments and arrays recursively
   * This ensures br elements inside Fragments are processed in the same context
   */
  flattenNodes(nodes) {
    const result = [];
    for (const node of nodes) {
      if (node == null || typeof node === "boolean") {
        continue;
      }
      if (Array.isArray(node)) {
        result.push(...this.flattenNodes(node));
      } else if (typeof node === "object" && "type" in node) {
        const element = node;
        if (element.type === "Fragment") {
          const children = element.props.children;
          if (children != null) {
            const childArray = Array.isArray(children) ? children : [children];
            result.push(...this.flattenNodes(childArray));
          }
        } else if (typeof element.type === "function") {
          const resolvedNode = element.type(element.props);
          if (resolvedNode != null) {
            const resolvedArray = Array.isArray(resolvedNode) ? resolvedNode : [resolvedNode];
            result.push(...this.flattenNodes(resolvedArray));
          }
        } else {
          result.push(node);
        }
      } else {
        result.push(node);
      }
    }
    return result;
  }
  /**
   * Formats a heading with appropriate markdown-style syntax
   */
  formatHeading(type2, content) {
    if (!content.trim()) {
      return "";
    }
    const headingLevel = parseInt(type2.slice(1), 10);
    const prefix = "#".repeat(headingLevel);
    return `${prefix} ${content.trim()}`;
  }
  /**
   * Renders an x element as XML with proper attribute and content formatting
   */
  renderXElement(props) {
    const { children, key: _key, tag } = props, attributes = __rest3(props, ["children", "key", "tag"]);
    const tagName2 = tag || "x";
    const content = this.renderContent(children);
    const attributeString = Object.keys(attributes).filter((attr) => attributes[attr] != null).map((attr) => {
      const value = attributes[attr];
      if (typeof value === "boolean") {
        return value ? attr : "";
      }
      return `${attr}="${String(value).replace(/"/g, "&quot;")}"`;
    }).filter((attr) => attr).join(" ");
    const attributePrefix = attributeString ? ` ${attributeString}` : "";
    if (!content.trim()) {
      return `<${tagName2}${attributePrefix} />`;
    } else {
      return `<${tagName2}${attributePrefix}>${content}</${tagName2}>`;
    }
  }
  /**
   * Renders a section element as XML with the title as the tag name
   * Sections have newlines after opening tag and before closing tag
   */
  renderSection(props) {
    const { children, key: _key, title } = props, attributes = __rest3(props, ["children", "key", "title"]);
    const tagName2 = String(title).toLowerCase().replace(/\s+/g, "-");
    const content = this.renderContent(children);
    const attributeString = Object.keys(attributes).filter((attr) => attributes[attr] != null).map((attr) => {
      const value = attributes[attr];
      if (typeof value === "boolean") {
        return value ? attr : "";
      }
      return `${attr}="${String(value).replace(/"/g, "&quot;")}"`;
    }).filter((attr) => attr).join(" ");
    const attributePrefix = attributeString ? ` ${attributeString}` : "";
    if (!content.trim()) {
      return `<${tagName2}${attributePrefix} />`;
    } else {
      return `<${tagName2}${attributePrefix}>
${content}
</${tagName2}>`;
    }
  }
  /**
   * Renders an ordered list with proper numbered formatting
   */
  renderOrderedList(children, indent = 0, baseIndentWidth = 0) {
    if (children == null) {
      return "";
    }
    const items = [];
    let itemNumber = 1;
    const indentStr = " ".repeat(baseIndentWidth);
    const markerWidth = 3;
    const flattenedChildren = this.flattenListChildren(Array.isArray(children) ? children : [children]);
    for (const child of flattenedChildren) {
      if (child && typeof child === "object" && !Array.isArray(child) && "type" in child) {
        const element = child;
        if (element.type === "li") {
          const { textContent, nestedLists } = this.extractListItemContent(element.props.children, indent + 1, baseIndentWidth + markerWidth);
          if (textContent.trim() || nestedLists.length > 0) {
            if (textContent.trim()) {
              items.push(`${indentStr}${itemNumber}. ${textContent.trim()}`);
              items.push(...nestedLists);
            } else if (nestedLists.length > 0) {
              const combinedNested = nestedLists.join("\n");
              const firstNewline = combinedNested.indexOf("\n");
              const totalIndent = baseIndentWidth + markerWidth;
              if (firstNewline === -1) {
                items.push(`${indentStr}${itemNumber}. ${combinedNested.trimStart()}`);
              } else {
                const firstLine = combinedNested.substring(0, firstNewline);
                const rest = combinedNested.substring(firstNewline + 1);
                items.push(`${indentStr}${itemNumber}. ${firstLine.trimStart()}`);
                const reindented = rest.split("\n").map((line) => {
                  const trimmed = line.trimStart();
                  return " ".repeat(totalIndent) + trimmed;
                }).join("\n");
                items.push(reindented);
              }
            }
            itemNumber++;
          }
        } else {
          const rendered = this.renderContentNode(child);
          if (rendered.trim()) {
            items.push(indentStr + rendered.trim());
          }
        }
      } else {
        const rendered = this.renderContentNode(child);
        if (rendered.trim()) {
          items.push(indentStr + rendered.trim());
        }
      }
    }
    return items.join("\n");
  }
  /**
   * Renders an unordered list with proper bullet formatting
   */
  renderUnorderedList(children, indent = 0, baseIndentWidth = 0) {
    if (children == null) {
      return "";
    }
    const items = [];
    const indentStr = " ".repeat(baseIndentWidth);
    const markerWidth = 2;
    const flattenedChildren = this.flattenListChildren(Array.isArray(children) ? children : [children]);
    for (const child of flattenedChildren) {
      if (child && typeof child === "object" && !Array.isArray(child) && "type" in child) {
        const element = child;
        if (element.type === "li") {
          const { textContent, nestedLists } = this.extractListItemContent(element.props.children, indent + 1, baseIndentWidth + markerWidth);
          if (textContent.trim() || nestedLists.length > 0) {
            if (textContent.trim()) {
              items.push(`${indentStr}- ${textContent.trim()}`);
            }
            items.push(...nestedLists);
          }
        } else {
          const rendered = this.renderContentNode(child);
          if (rendered.trim()) {
            items.push(indentStr + rendered.trim());
          }
        }
      } else {
        const rendered = this.renderContentNode(child);
        if (rendered.trim()) {
          items.push(indentStr + rendered.trim());
        }
      }
    }
    return items.join("\n");
  }
  /**
   * Flattens nested arrays in list children (from .map() operations)
   */
  flattenListChildren(children) {
    const flattened = [];
    for (const child of children) {
      if (Array.isArray(child)) {
        flattened.push(...this.flattenListChildren(child));
      } else {
        flattened.push(child);
      }
    }
    return flattened;
  }
  /**
   * Extracts text content and nested lists from list item children
   * Returns the text content (for the list item) and rendered nested lists separately
   */
  extractListItemContent(children, nestedIndent, baseIndentWidth = 0) {
    if (children == null) {
      return { textContent: "", nestedLists: [] };
    }
    const textParts = [];
    const nestedLists = [];
    const childArray = Array.isArray(children) ? children : [children];
    const flattenedChildren = this.flattenListChildren(childArray);
    for (const child of flattenedChildren) {
      if (child && typeof child === "object" && !Array.isArray(child) && "type" in child) {
        let element = child;
        if (typeof element.type === "function") {
          const resolvedNode = element.type(element.props);
          if (resolvedNode && typeof resolvedNode === "object" && !Array.isArray(resolvedNode) && "type" in resolvedNode) {
            element = resolvedNode;
          } else {
            const rendered = this.renderContent(resolvedNode);
            if (rendered) {
              textParts.push(rendered);
            }
            continue;
          }
        }
        if (element.type === "ul") {
          const rendered = this.renderUnorderedList(element.props.children, nestedIndent, baseIndentWidth);
          if (rendered.trim()) {
            nestedLists.push(rendered);
          }
        } else if (element.type === "ol") {
          const rendered = this.renderOrderedList(element.props.children, nestedIndent, baseIndentWidth);
          if (rendered.trim()) {
            nestedLists.push(rendered);
          }
        } else {
          const rendered = this.renderContentNode(element);
          if (rendered) {
            textParts.push(rendered);
          }
        }
      } else {
        const rendered = this.renderContentNode(child);
        if (rendered) {
          textParts.push(rendered);
        }
      }
    }
    return {
      textContent: textParts.join(""),
      nestedLists
    };
  }
  /**
   * Renders preformatted content, preserving all whitespace including newlines
   */
  renderPreContent(children) {
    if (children == null || typeof children === "boolean") {
      return "";
    }
    if (typeof children === "string" || typeof children === "number") {
      return String(children);
    }
    if (Array.isArray(children)) {
      return children.map((child) => this.renderPreContent(child)).join("");
    }
    const element = children;
    if (typeof element.type === "function") {
      const renderedNode = element.type(element.props);
      return this.renderPreContent(renderedNode);
    }
    if (element.type === "Fragment") {
      return this.renderPreContent(element.props.children);
    }
    if (element.type === "br") {
      return "\n";
    }
    return this.renderPreContent(element.props.children);
  }
  /**
   * Checks if a node is a block-level element (p, section, lists, headings, x, pre)
   */
  isBlockElement(node) {
    if (node && typeof node === "object" && !Array.isArray(node) && "type" in node) {
      const type2 = node.type;
      return type2 === "p" || type2 === "section" || type2 === "ul" || type2 === "ol" || type2 === "h1" || type2 === "h2" || type2 === "h3" || type2 === "h4" || type2 === "h5" || type2 === "h6" || type2 === "x" || type2 === "pre";
    }
    return false;
  }
  /**
   * Checks if a node is a section element
   */
  isSectionElement(node) {
    return node !== null && typeof node === "object" && !Array.isArray(node) && "type" in node && node.type === "section";
  }
  /**
   * Normalizes whitespace in the final rendered content
   * This handles cases where expressions resulted in empty values
   * Preserves newlines that are part of list structures
   * Replaces multiple spaces with a single space
   * Preserves trailing newlines (from br elements before block elements)
   */
  normalizeWhitespace(text2) {
    const trailingNewlineMatch = text2.match(/\n+$/);
    const trailingNewlines = trailingNewlineMatch ? trailingNewlineMatch[0] : "";
    const normalized = text2.replace(/ +/g, " ").trim();
    return normalized + trailingNewlines;
  }
};
function renderContent(element, options2) {
  const context2 = new RenderContext(options2 || {});
  return context2.renderContent(element);
}

