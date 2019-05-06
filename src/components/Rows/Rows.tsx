import React from 'react';
import { Row, RowGetter } from '../../types';
import { Props as ColumnProps } from '../Column';

export type Props = {
  columns: ColumnProps[];
  topRowIndex: number;
  rowHeight: number;
  rowRenderer: React.FC<Row>;
  totalVisibleRows: number;
  rowGetter: RowGetter;
  rowCount: number;
};

function Rows({
  columns,
  topRowIndex,
  rowHeight,
  rowRenderer,
  totalVisibleRows,
  rowGetter,
  rowCount,
}: Props) {
  const RowRenderer = rowRenderer;

  return (
    <div>
      {Array.apply(null, new Array(totalVisibleRows)).map((_, index) => {
        const rowIndex = topRowIndex + index;
        const row = rowGetter({ index: rowIndex });
        if (rowIndex > rowCount - 1) {
          return null;
        }

        return (
          <RowRenderer rowHeight={rowHeight} key={index}>
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} style={{ width: column.width }}>
                {column.cellRenderer ? (
                  column.cellRenderer({
                    columnIndex,
                    rowIndex,
                    cellData: row[column.dataKey],
                    columnData: column.columnData,
                    dataKey: column.dataKey,
                    rowData: row,
                  })
                ) : (
                  <div>{row[column.dataKey]}</div>
                )}
              </div>
            ))}
          </RowRenderer>
        );
      })}
    </div>
  );
}

export default React.memo(Rows);
