import React from 'react';
import {
  Header as MHeader,
  Text,
} from '@mantine/core';

export function Header() {
  return (
    <MHeader height={70} p="md" sx={({
      spacing
    }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
    })}>
      <Text>CSS Polygon Editor</Text>

      <Text href="https://github.com/zeropaper/css-polygon-editor" component='a'>Github</Text>
    </MHeader>
  );
}

export default Header;
