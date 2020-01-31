const root = document.getElementById('root');
if (!root) throw new Error('#root is not found.');

Array.from(root.children).forEach(node => node.remove());

const head = document.createElement('h1')
head.appendChild(document.createTextNode('Hello World!'));
root.appendChild(head);

root.appendChild(document.createTextNode(`node ${window.main.versions.node}、
Chrome ${window.main.versions.chrome}、
Electron ${window.main.versions.electron} を使用しています。`));
