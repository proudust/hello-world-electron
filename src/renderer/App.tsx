import React from 'react';

interface AppProps {
  children?: never;
}

export const App: React.FC<AppProps> = () => (
  <>
    <h1>Hello World!</h1>
    node {window.main.versions.node}、
    Chrome {window.main.versions.chrome}、
    Electron {window.main.versions.electron} を使用しています。
  </>
);
