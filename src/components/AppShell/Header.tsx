import React from 'react';
import {
  Header as MHeader,
  MediaQuery,
  Burger,
  Text,
  useMantineTheme,
} from '@mantine/core';

export interface PropTypes {
  opened: boolean;
  setOpened: (opened: boolean) => any;
}

export function Header({ opened, setOpened }: PropTypes) {
  const theme = useMantineTheme();
  return (
    <MHeader height={70} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text>Application header</Text>
      </div>
    </MHeader>
  );
}

export default Header;
