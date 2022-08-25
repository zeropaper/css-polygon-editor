import React from 'react';

import { MantineProvider, Paper } from '@mantine/core';
import AppShell from './components/AppShell/AppShell';
import Header from './components/AppShell/Header';
import CSSPolygoneEditor from './components/CSSPolygonEditor/CSSPolygonEditor';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell header={<Header />}>
        <CSSPolygoneEditor />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
