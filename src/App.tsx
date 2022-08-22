import React from 'react';

import { MantineProvider } from '@mantine/core';
import AppShell from './components/AppShell/AppShell';
import Header from './components/AppShell/Header';
import CSSPolygoneEditor from './components/CSSPolygonEditor/CSSPolygonEditor';
// @ts-ignore
import data from './data-mock.json';

function App() {
  const [opened, setOpened] = React.useState(false);
  return (
    <MantineProvider>
      <AppShell header={<Header opened={opened} setOpened={setOpened} />}>
        <CSSPolygoneEditor />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
