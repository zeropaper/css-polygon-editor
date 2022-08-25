import * as React from 'react';
import {
  Code, ActionIcon, CodeProps,
  Paper
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import {
  IconCopy,
  IconCheck
} from '@tabler/icons';


export function CodeWithCopyButton({
  m, mb, ml, mr, mt, mx, my, p, pb, pl, pr, pt, px, py, ...rest
}: CodeProps & {}) {
  const clipboard = useClipboard();
  const code = rest.children?.toString();
  return (
    <Paper
      {...{ m, mb, ml, mr, mt, mx, my, p, pb, pl, pr, pt, px, py }}
      withBorder
      sx={{
        position: 'relative',
      }}
    >
      <ActionIcon
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
        }}
        title="Copy"
        onClick={() => clipboard.copy(code)}
      >
        {clipboard.copied ? <IconCheck /> : <IconCopy />}
      </ActionIcon>
      <Code
        {...rest}
        sx={{
          position: 'relative',
          zIndex: 0,
        }} />
    </Paper>
  );
}

export default CodeWithCopyButton;
