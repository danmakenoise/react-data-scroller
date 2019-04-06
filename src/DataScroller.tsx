/* Dependencies */
import React, {
  Component,
  ReactNode,
  UIEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import Headers from './components/Headers';
import defaultRowRenderer from './components/Row';
import Rows from './components/Rows';
import {Row} from './types';

/* Types */
import {
  CellRendererArgs,
  Column,
  DataTableProps,
  DataTableState,
  HeaderRendererArgs,
  OnRowsRenderedArgs,
  RowGetterArgs,
} from './types';

/* Styles */
import './styles.css';

export default function DataScroller(props: DataTableProps) {
  const tableScrollerRef = useRef<HTMLDivElement>(null);
  const [topRowIndex, setTopRowIndex] = useState(props.initialTopRowIndex);
  const totalVisibleRows = useTotalVisibleRows(props);
  const {
    frozenColumnsScrollWidth,
    tableScrollHeight,
    tableScrollWidth,
  } = useTableScrollDimensions(props);

  useEffect(() => {
    props.onRowsRendered({
      overscanStartIndex: topRowIndex,
      overscanStopIndex: topRowIndex + totalVisibleRows,
      startIndex: topRowIndex,
      stopIndex: topRowIndex + totalVisibleRows,
    });
  }, [topRowIndex, totalVisibleRows]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollPosition = tableScrollerRef.current
      ? tableScrollerRef.current.scrollTop
      : 0;
    const newTopRowIndex = Math.round(scrollPosition / props.rowHeight);

    setTopRowIndex(newTopRowIndex);
  };

  const regularColumnsWidth = tableScrollWidth;
  const rows = [];

  for (let i = topRowIndex; i < topRowIndex + totalVisibleRows; i++) {
    rows.push(props.rowGetter({index: i}));
  }

  const RowRenderer = props.rowRenderer;

  return (
    <div
      ref={tableScrollerRef}
      style={{height: props.height, overflowY: 'auto'}}
      onScroll={handleScroll}
      className="scroll">
      <div style={{height: tableScrollHeight, position: 'relative'}}>
        <div
          className="sticky"
          style={{
            display: 'flex',
            fontSize: '20px',
            top: 0,
          }}>
          {/* Frozen */}
          <div
            style={{
              height: props.height,
              overflowX: 'scroll',
              overflowY: 'hidden',
              width: frozenColumnsScrollWidth,
            }}>
            <div style={{width: frozenColumnsScrollWidth}}>
              <Headers
                columns={props.frozenColumns}
                headerHeight={props.headerHeight}
              />
              <Rows
                rows={rows}
                columns={props.frozenColumns}
                topRowIndex={topRowIndex}
                rowHeight={props.rowHeight}
                rowRenderer={props.rowRenderer}
              />
            </div>
          </div>

          {/*Standard */}
          <div
            style={{
              flex: 1,
              height: props.height,
              overflowX: 'auto',
              overflowY: 'hidden',
            }}>
            <div style={{width: regularColumnsWidth}}>
              <Headers
                columns={props.columns}
                headerHeight={props.headerHeight}
              />
              <Rows
                rows={rows}
                columns={props.columns}
                topRowIndex={topRowIndex}
                rowHeight={props.rowHeight}
                rowRenderer={props.rowRenderer}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const useTableScrollDimensions = (props: DataTableProps) => {
  const [tableScrollHeight, setTableScrollHeight] = useState(0);
  const [tableScrollWidth, setTableScrollWidth] = useState(0);
  const [frozenColumnsScrollWidth, setFrozenColumnsScrollWidth] = useState(0);
  useEffect(() => {
    let newTableScrollHeight = 0;
    for (let i = 0; i < props.rowCount; i++) {
      newTableScrollHeight += props.rowHeight;
    }

    setTableScrollHeight(newTableScrollHeight);
  }, [props.rowHeight]);

  useEffect(() => {
    const newTableScrollWidth = props.columns.reduce(
      (width, column) => width + column.width,
      0,
    );
    setTableScrollWidth(newTableScrollWidth);
  }, [props.columns]);

  useEffect(() => {
    const newFrozenColumnsScrollWidth = props.frozenColumns.reduce(
      (width, column) => width + column.width,
      0,
    );
    setFrozenColumnsScrollWidth(newFrozenColumnsScrollWidth);
  }, [props.frozenColumns]);

  return {
    frozenColumnsScrollWidth,
    tableScrollHeight,
    tableScrollWidth,
  };
};

const useTotalVisibleRows = (props: DataTableProps) => {
  const [totalVisibleRows, setTotalVisibleRows] = useState(0);
  useEffect(() => {
    const newTotalVisibleRows = Math.floor(
      (props.height - props.headerHeight) / props.rowHeight,
    );
    setTotalVisibleRows(newTotalVisibleRows);
  }, [props.height, props.headerHeight, props.rowHeight]);
  return totalVisibleRows;
};

DataScroller.defaultProps = {
  frozenColumns: [],
  initialTopRowIndex: 0,
  onRowsRendered: ({}) => undefined,
  rowRenderer: defaultRowRenderer,
};
