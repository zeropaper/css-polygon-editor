import * as React from 'react';
import {
  Box,
  Group,
  Text,
} from '@mantine/core';


import CodeWithCopyButton from '../CodeWithCopyButton/CodeWithCopyButton';
import InputsTable from './InputsTable';

type XY = [string | number, string | number];

type Coords = XY[];

type DetailedCoord = [[number, string, boolean], [number, string, boolean]];

export type DetailedCoords = DetailedCoord[];

export type Axis = 'x' | 'y';

export function polygon(coords: DetailedCoords) {
  return `polygon(\n  ${coords
    .map(([[xV, xU, xN], [yV, yU, yN]]) => {
      const aXV = Math.abs(xV);
      const aYV = Math.abs(yV);
      return [
        xN ? `calc(100% - ${aXV}${aXV ? xU : ''})` : `${aXV}${aXV ? xU : ''}`,
        yN ? `calc(100% - ${aYV}${aYV ? yU : ''})` : `${aYV}${aYV ? yU : ''}`,
      ];
    })
    .map(([x, y]) => [
      x.startsWith('calc(100% - 0') ? '100%' : x,
      y.startsWith('calc(100% - 0') ? '100%' : y,
    ])
    .map((xy) => xy.join(' '))
    .join(',\n  ')}\n)`;
}

export function PreviewBox({
  coords,
  aspectRatio,
  baseSize,
}: {
  coords: DetailedCoords;
  aspectRatio: number;
  baseSize: number;
}) {
  const clipPath = polygon(coords);
  const sizing =
    aspectRatio <= 1
      ? {
        aspectRatio: `${4 * aspectRatio} / 4`,
        height: baseSize,
      }
      : {
        aspectRatio: `4 / ${4 / aspectRatio}`,
        width: baseSize,
      };

  return (
    <Group
      m="xl"
      spacing="md"
      sx={{
        border: '1px dotted #000',
        overflow: 'visible',
        position: 'relative',
      }}
    >
      {coords.map(([[xAmount, xUnit, xDir], [yAmount, yUnit, yDir]], i) => (
        <Text
          key={`${i}${xAmount}${xUnit}${xDir}${yAmount}${yUnit}${yDir}`}
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            width: '2ch',
            height: '2ch',
            borderRadius: '2ch',
            border: '1px solid currentColor',
            left: xDir ? 'unset' : `calc(-1ch + ${xAmount}${xUnit || 'px'})`,
            right: xDir ? `calc(-1ch + ${xAmount}${xUnit || 'px'})` : 'unset',
            top: yDir ? 'unset' : `calc(-1ch + ${yAmount}${yUnit || 'px'})`,
            bottom: yDir ? `calc(-1ch + ${yAmount}${yUnit || 'px'})` : 'unset',
            fontSize: '0.85em',
            background: 'rgba(255, 255, 255, 0.75)',
          }}
        >
          {i + 1}
        </Text>
      ))}
      <Box
        sx={({ fn }) => ({
          ...sizing,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
          clipPath,
          background: fn.primaryColor(),
          position: 'relative',
          zIndex: 0,
        })}
      >
        {sizing.aspectRatio}
      </Box>
    </Group>
  );
}

export function PreviewBoxes({ coords }: { coords: DetailedCoords }) {
  return (
    <Group
      sx={{
        background:
          'repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%) 50% / 20px 20px',
      }}
    >
      <PreviewBox aspectRatio={0.75} baseSize={200} coords={coords} />

      <PreviewBox aspectRatio={1} baseSize={200} coords={coords} />

      <PreviewBox aspectRatio={1 / 0.75} baseSize={200} coords={coords} />
    </Group>
  );
}

const cache: { [k: string]: [number, string, boolean] } = {};
const coordParsingExp = /(-|)\s*([0-9]+)([a-z]{2,}|%|)/i;
function parseCoord(coord: string | number | null): [number, string, boolean] {
  const parseable = `${coord || ''}`.trim();
  if (cache[parseable]) return cache[parseable];
  if (!parseable) {
    cache[parseable] = [0, '%', false];
    return cache[parseable];
  }
  const values = coordParsingExp.exec(parseable);
  if (!values) {
    cache[parseable] = [0, '%', parseable.startsWith('-')];
    return cache[parseable];
  }
  const [, negative, amount, unit] = values || [];
  cache[parseable] = [parseInt(amount, 10), unit || '%', !!negative];
  return cache[parseable];
}

function axisIndex(axis: Axis) {
  return axis === 'x' ? 0 : 1;
}

type PolygonEditorProps = {
  coords?: Coords;
  onChange?: (coords: DetailedCoords) => void;
};

export function PolygonEditor({
  coords: coordsProp = [
    [0, '35%'],
    ['35%', '35%'],
    ['35%', 0],
    ['-0', 0],
    ['-0', '-40px'],
    ['-40px', '-40px'],
    ['-40px', '-0'],
    [0, '-0'],
  ],
  onChange,
}: PolygonEditorProps) {
  const [coords, setCoords] = React.useState<DetailedCoords>(
    coordsProp.map(
      (coord: XY): DetailedCoord => [parseCoord(coord[0]), parseCoord(coord[1])]
    )
  );

  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const handleHightlight = (index: number) => setHighlightedIndex(() => index);

  const handleDuplicate = (index: number) =>
    setCoords([
      ...coords.slice(0, index + 1),
      [...coords[index], ...coords[index]],
      ...coords.slice(index + 1),
    ] as DetailedCoords);

  const handleRemove = (index: number) =>
    setCoords([
      ...coords.slice(0, index),
      ...coords.slice(index + 1),
    ] as DetailedCoords);

  const handleValueChange = (index: number, axis: Axis, newValue: number) =>
    setCoords((cs) => {
      const newCs = [...cs];
      const aI = axisIndex(axis);
      const [, u = '%', n = false] = newCs[index][aI] || [];
      newCs[index][aI] = [newValue, u, n];
      if (onChange) onChange(newCs);
      return newCs;
    });

  const handleUnitChange = (index: number, axis: Axis, newUnit: string) =>
    setCoords((cs) => {
      const newCs = [...cs];
      const aI = axisIndex(axis);
      const [v = 0, , n = false] = newCs[index][aI] || [];
      newCs[index][aI] = [v, newUnit, n];
      if (onChange) onChange(newCs);
      return newCs;
    });

  const handleDirectionChange = (
    index: number,
    axis: Axis,
    newValue: boolean
  ) =>
    setCoords((cs) => {
      const newCs = [...cs];
      const aI = axisIndex(axis);
      const [v = 0, u = '%'] = newCs[index][aI] || [];
      newCs[index][aI] = [v, u, !!newValue];
      if (onChange) onChange(newCs);
      return newCs;
    });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      m="xl"
    >
      <PreviewBoxes coords={coords} />

      <InputsTable
        coords={coords}
        highlightedIndex={highlightedIndex}
        onHighlight={handleHightlight}
        onDuplicate={handleDuplicate}
        onRemove={handleRemove}
        onValueChange={handleValueChange}
        onUnitChange={handleUnitChange}
        onDirectionChange={handleDirectionChange}
      />

      <CodeWithCopyButton m="lg" block>
        {polygon(coords)}
      </CodeWithCopyButton>
    </Box>
  );
}

export default PolygonEditor;
