// Keep Markdown links useful on GitHub, while mapping examples to static downloads on the site.
export default function exampleLinks() {
  return (tree, file) => {
    const match = String(file.path || '').replaceAll('\\', '/').match(/library\/([^/]+)\/index\.md$/);
    if (!match) return;
    const visit = node => {
      if (node.type === 'link' && node.url.startsWith('example/')) node.url = `${(process.env.PORTFOLIO_BASE || '').replace(/\/$/, '')}/examples/${match[1]}/${node.url.slice(8)}`;
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
