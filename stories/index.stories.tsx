import * as faker from 'faker';
import * as React from 'react';
import {Column, ColumnProps} from '../src/';
import Group from '../src/components/Group';

import {storiesOf} from '@storybook/react';
import DataScroller, {
  CellRendererArgs,
  HeaderRendererArgs,
  RowGetterArgs,
} from '../src';

const cellRenderer = function CellRenderer({rowData}: CellRendererArgs) {
  return (
    <div
      className="hover"
      style={{
        boxShadow: '0 0 5px 2px black',
      }}>
      {rowData.index}
    </div>
  );
};

const initialColumns = [
  {
    cellRenderer,
    columnData: {},
    dataKey: 'lastName',
    headerRenderer: ({columnData}: HeaderRendererArgs) => (
      <div style={{background: 'white'}}>Header {columnData.columnIndex}</div>
    ),
    label: 'last name',
    width: 200,
  },
  {
    cellRenderer: ({rowData}: CellRendererArgs) => {
      return <div>{rowData.firstName}</div>;
    },
    columnData: {},
    dataKey: 'firstName',
    headerRenderer: ({columnData}: HeaderRendererArgs) => (
      <div>Header{columnData.columnIndex}</div>
    ),
    label: 'first name',
    width: 200,
  },
];

const generateRows = (n: number) => {
  const arr = Array.apply(null, Array(n));
  return arr.map((item, index) => {
    return {
      avatar: faker.image.imageUrl(100, 100, 'people'),
      firstName: faker.name.firstName(),
      index,
      lastName: faker.name.lastName(),
    };
  });
};
const rowCount = 5000;
const rows = generateRows(rowCount);

const rowGetter = ({index}: RowGetterArgs) => rows[index];

let columns: ColumnProps[] = [];
for (let counter = 0; counter < 10; counter++) {
  columns = [...initialColumns, ...(columns || [])];
}

columns = columns.map((column, index) => ({
  ...column,
  columnData: {...(column.columnData || {}), columnIndex: index},
}));

let frozenColumns: ColumnProps[] = [];
for (let counter = 0; counter < 2; counter++) {
  frozenColumns = [...initialColumns, ...(frozenColumns || [])];
}

frozenColumns = frozenColumns.map((column, index) => ({
  ...column,
  columnData: {...(column.columnData || {}), columnIndex: index},
}));

const GroupHeaderA = (props: {width: number}) => {
  return (
    <div style={{backgroundColor: 'blue', width: props.width}}>First Group</div>
  );
};

const GroupHeaderB = (props: {width: number}) => {
  return (
    <div style={{backgroundColor: 'red', width: props.width}}>Second Group</div>
  );
};

storiesOf('react-data-scroller', module).add('default', () => (
  <DataScroller
    rowCount={rowCount}
    rowGetter={rowGetter}
    rowHeight={50}
    height={500}
    headerHeight={100}
    width={500}
    groupHeaderHeight={30}
    columns={[
      <Group key="groupa" headerRenderer={GroupHeaderA}>
        {columns.map((column, index) => (
          <Column key={index} {...column} />
        ))}
      </Group>,
      <Group key="groupb" headerRenderer={GroupHeaderB}>
        {columns.map((column, index) => (
          <Column key={index} {...column} />
        ))}
      </Group>,
    ]}
    frozenColumns={frozenColumns.map((column, index) => (
      <Column key={index} {...column} />
    ))}
  />
));
