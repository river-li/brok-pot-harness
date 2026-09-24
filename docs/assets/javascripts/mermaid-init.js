(() => {
  if (typeof mermaid === 'undefined') {
    document.documentElement.dataset.gbhMermaidError = 'Mermaid renderer did not load';
    return;
  }

  // Disable Mermaid's auto-run before DOMContentLoaded; it reads escaped code-block HTML as markup.
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });

  const renderDiagrams = async () => {
    const diagrams = Array.from(document.querySelectorAll('.gbh-diagram'));
    for (const [index, diagram] of diagrams.entries()) {
      const source = diagram.textContent.trim();
      if (!source) continue;

      try {
        const { svg, bindFunctions } = await mermaid.render(`gbh-mermaid-${index}`, source);
        diagram.innerHTML = svg;
        if (bindFunctions) bindFunctions(diagram);
        const graphic = diagram.querySelector('svg');
        const graphicWidth = graphic && graphic.viewBox && graphic.viewBox.baseVal.width;
        if (Number.isFinite(graphicWidth) && graphicWidth > 0) {
          graphic.style.width = `${graphicWidth}px`;
          graphic.style.maxWidth = 'none';
        }
        diagram.setAttribute('tabindex', '0');
        diagram.setAttribute('role', 'region');
        diagram.setAttribute('aria-label', 'Diagram; scroll horizontally to view the full graphic');
        diagram.dataset.gbhRendered = 'true';
      } catch (error) {
        const message = error && typeof error === 'object' && 'message' in error ? error.message : String(error);
        diagram.dataset.gbhError = message;
        diagram.setAttribute('role', 'alert');
        diagram.textContent = `Diagram failed to render: ${message}`;
        document.documentElement.dataset.gbhMermaidError = message;
        console.error('GBH documentation diagram failed to render', error);
      }
    }
    if (!document.documentElement.dataset.gbhMermaidError) {
      document.documentElement.dataset.gbhMermaidReady = 'true';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderDiagrams, { once: true });
  } else {
    renderDiagrams();
  }
})();
