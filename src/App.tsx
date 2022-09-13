import React from 'react';

import { MantineProvider } from '@mantine/core';
import AppShell from './components/AppShell/AppShell';
import Header from './components/AppShell/Header';
import CSSPolygoneEditor from './components/CSSPolygonEditor/CSSPolygonEditor';

function App() {
  const noHeader = window.location.search.indexOf('no_header=true') > -1;
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell header={noHeader ? undefined : <Header />}>
        <CSSPolygoneEditor />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
