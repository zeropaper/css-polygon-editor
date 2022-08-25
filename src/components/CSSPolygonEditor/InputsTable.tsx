import * as React from 'react';
import {
  Select, Input as MInput,
  ActionIcon,
  createStyles
} from '@mantine/core';
import {
  IconCopy,
  IconX,
  IconArrowBarToRight,
  IconArrowBarToLeft,
  IconArrowBarToUp,
  IconArrowBarToDown
} from '@tabler/icons';

import type { DetailedCoords, Axis } from './CSSPolygonEditor';

interface CSSUnitSelectorChangeHandler {
  (value: string): void;
}

type CSSUnitSelectorProps = {
  value: number | string;
  onChange: CSSUnitSelectorChangeHandler;
  onFocus: () => void;
};

function CSSUnitSelector({ value, onChange, onFocus }: CSSUnitSelectorProps) {
  return (
    <Select
      onFocus={onFocus}
      value={!value ? '%' : value?.toString()}
      onChange={onChange}
      sx={{
        width: '8ch',
      }}
      data={['px', '%', 'em', 'rem', 'ex', 'ch', 'vw', 'vh']} />
  );
}
const useInputsTableStyles = createStyles(({ spacing }) => ({
  table: {
    borderCollapse: 'collapse',
  },
  number: {
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },
  direction: {
    paddingRight: spacing.md,
  },
  controls: {
    paddingRight: spacing.md,
    minWidth: 50 + spacing.md,
  },
  highlighted: {
    backgroundColor: 'lightgrey',
  },
}));

function AxisCells({
  amount,
  onValueChange,
  unit,
  onUnitChange,
  direction,
  onDirectionChange,
  classes,
  directionIcon,
  onFocus,
}: {
  amount: number;
  onValueChange: (value: number) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  direction: boolean;
  onDirectionChange: (value: boolean) => void;
  classes: {
    direction: string;
  };
  directionIcon: React.ReactNode;
  onFocus: () => void;
}) {
  return (
    <>
      <td>
        <MInput
          sx={{
            width: '8ch',
          }}
          name="x"
          type="number"
          value={amount}
          onFocus={onFocus}
          onChange={(e: { target: { value: string; }; }) => {
            onValueChange(parseInt(e.target.value, 10) || 0);
          }} />
      </td>
      <td>
        <CSSUnitSelector onFocus={onFocus} value={unit} onChange={onUnitChange} />
      </td>
      <td className={classes.direction}>
        <ActionIcon
          onFocus={onFocus}
          title={`Side from which the value is measured`}
          variant="outline"
          onClick={() => onDirectionChange(!direction)}
        >
          {directionIcon}
        </ActionIcon>
      </td>
    </>
  );
}

export function InputsTable({
  coords, highlightedIndex, onHighlight, onDuplicate, onRemove, onValueChange, onUnitChange, onDirectionChange,
}: {
  coords: DetailedCoords;
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  onDuplicate: (index: number) => void;
  onRemove: (index: number) => void;
  onValueChange: (index: number, axis: Axis, value: number) => void;
  onUnitChange: (index: number, axis: Axis, value: string) => void;
  onDirectionChange: (index: number, axis: Axis, value: boolean) => void;
}) {
  const { classes, cx } = useInputsTableStyles();
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th />
          <th colSpan={3}>X</th>
          <th colSpan={3}>Y</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {coords.map(([[xAmount, xUnit, xDir], [yAmount, yUnit, yDir]], i) => {
          const handleFocus = () => onHighlight(i);
          return (
            <tr
              key={i}
              className={cx({
                [classes.highlighted]: i === highlightedIndex,
              })}
            >
              <th className={classes.number}>{i + 1}</th>
              <AxisCells
                onFocus={handleFocus}
                amount={xAmount}
                onValueChange={(value) => onValueChange(i, 'x', value)}
                unit={xUnit}
                onUnitChange={(value) => onUnitChange(i, 'x', value)}
                direction={xDir}
                onDirectionChange={(value) => onDirectionChange(i, 'x', value)}
                classes={classes}
                directionIcon={xDir ? <IconArrowBarToLeft /> : <IconArrowBarToRight />} />

              <AxisCells
                onFocus={handleFocus}
                amount={yAmount}
                onValueChange={(value) => onValueChange(i, 'y', value)}
                unit={yUnit}
                onUnitChange={(value) => onUnitChange(i, 'y', value)}
                direction={yDir}
                onDirectionChange={(value) => onDirectionChange(i, 'y', value)}
                classes={classes}
                directionIcon={xDir ? <IconArrowBarToUp /> : <IconArrowBarToDown />} />
              <td className={classes.controls}>
                <ActionIcon
                  sx={{ display: 'inline-flex' }}
                  onFocus={handleFocus}
                  variant="subtle"
                  title="Copy down"
                  onClick={() => onDuplicate(i)}
                >
                  <IconCopy />
                </ActionIcon>

                <ActionIcon
                  sx={{ display: 'inline-flex' }}
                  variant="subtle"
                  title="Remove"
                  onFocus={handleFocus}
                  onClick={() => onRemove(i)}
                >
                  <IconX />
                </ActionIcon>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

export default InputsTable;
