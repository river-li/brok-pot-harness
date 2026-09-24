const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const initializer = readFileSync(
  path.join(__dirname, '..', 'docs/assets/javascripts/mermaid-init.js'),
  'utf8',
);
const decodedDiagram = 'flowchart LR\n  A["decoded & expanded"]';

function makeHarness(render, text = decodedDiagram) {
  let onReady;
  const errors = [];
  const options = [];
  const diagram = {
    textContent: text,
    dataset: {},
    attributes: {},
    graphic: { viewBox: { baseVal: { width: 1540 } }, style: {} },
    querySelector(selector) {
      assert.equal(selector, 'svg');
      return this.graphic;
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  };
  const document = {
    readyState: 'loading',
    documentElement: { dataset: {} },
    querySelectorAll(selector) {
      assert.equal(selector, '.gbh-diagram');
      return [diagram];
    },
    addEventListener(name, callback) {
      assert.equal(name, 'DOMContentLoaded');
      onReady = callback;
    },
  };

  vm.runInNewContext(initializer, {
    document,
    mermaid: {
      initialize(value) {
        options.push(value);
      },
      render,
    },
    console: {
      error(...args) {
        errors.push(args);
      },
    },
  });

  return {
    diagram,
    document,
    options,
    errors,
    onReady: () => onReady(),
  };
}

test('renders decoded diagram text and marks a successful SVG ready', async () => {
  let renderArgs;
  let bindTarget;
  const harness = makeHarness(async (...args) => {
    renderArgs = args;
    return {
      svg: '<svg class="rendered-diagram"></svg>',
      bindFunctions(element) {
        bindTarget = element;
      },
    };
  });

  await harness.onReady();

  assert.equal(harness.options.length, 1);
  assert.equal(harness.options[0].startOnLoad, false);
  assert.equal(harness.options[0].securityLevel, 'strict');
  assert.equal(renderArgs[0], 'gbh-mermaid-0');
  assert.equal(renderArgs[1], decodedDiagram);
  assert.equal(harness.diagram.innerHTML, '<svg class="rendered-diagram"></svg>');
  assert.equal(bindTarget, harness.diagram);
  assert.equal(harness.diagram.dataset.gbhRendered, 'true');
  assert.equal(harness.diagram.graphic.style.width, '1540px');
  assert.equal(harness.diagram.graphic.style.maxWidth, 'none');
  assert.equal(harness.diagram.attributes.tabindex, '0');
  assert.equal(harness.diagram.attributes.role, 'region');
  assert.equal(harness.diagram.attributes['aria-label'], 'Diagram; scroll horizontally to view the full graphic');
  assert.equal(harness.document.documentElement.dataset.gbhMermaidReady, 'true');
  assert.equal(harness.errors.length, 0);
});

test('reports render errors and does not mark a failed diagram ready', async () => {
  const harness = makeHarness(async () => {
    throw new Error('invalid graph syntax');
  });

  await harness.onReady();

  assert.equal(harness.diagram.dataset.gbhError, 'invalid graph syntax');
  assert.equal(harness.diagram.attributes.role, 'alert');
  assert.match(harness.diagram.textContent, /Diagram failed to render: invalid graph syntax/);
  assert.equal(harness.document.documentElement.dataset.gbhMermaidError, 'invalid graph syntax');
  assert.equal(harness.document.documentElement.dataset.gbhMermaidReady, undefined);
  assert.equal(harness.errors.length, 1);
});

test('skips empty diagram blocks without adding an error', async () => {
  let renderCalled = false;
  const harness = makeHarness(async () => {
    renderCalled = true;
    return { svg: '<svg></svg>' };
  }, '  \n ');

  await harness.onReady();

  assert.equal(renderCalled, false);
  assert.equal(harness.diagram.dataset.gbhError, undefined);
  assert.equal(harness.document.documentElement.dataset.gbhMermaidError, undefined);
  assert.equal(harness.document.documentElement.dataset.gbhMermaidReady, 'true');
  assert.equal(harness.errors.length, 0);
});
