const root = document.getElementById('root');
if (!root) throw new Error('#root is not found.');

Array.from(root.children).forEach(node => node.remove());

const head = document.createElement('h1')
head.appendChild(document.createTextNode('Hello World!'));
root.appendChild(head);

root.appendChild(document.createTextNode(`node ${process.versions.node}、
Chrome ${process.versions.chrome}、
Electron ${process.versions.electron} を使用しています。`));
