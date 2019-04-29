import { ReactNode } from "react";

export type CellRendererArgs = {
  cellData: any;
  columnData: any;
  columnIndex: number;
  dataKey: string;
  rowData: any;
  rowIndex: number;
}
export type HeaderRendererArgs = {
  columnData: any;
  dataKey: string;
  label: any;
}

export type Column = {
  cellRenderer: (arg: CellRendererArgs) => ReactNode;
  headerRenderer: (arg: HeaderRendererArgs) => ReactNode;
  width: number;
  columnData: any;
  dataKey: string;
  label: any;
}


export type OnRowsRenderedArgs = {
  startIndex: number;
  overscanStartIndex: number;
  overscanStopIndex: number;
  stopIndex: number;
}

export type RowGetterArgs = {
  index: number;
}
export type RowGetter = (arg: RowGetterArgs) => any;

export type DataTableProps = {
  columns: Column[];
  frozenColumns: Column[];
  groupHeaderHeight: number;
  headerHeight: number;
  height: number;
  initialTopRowIndex: number;
  onRowsRendered: (arg: OnRowsRenderedArgs) => void;
  rowCount: number;
  rowGetter: RowGetter;
  rowHeight: number;
  rowRenderer: React.FC<Row>;
  width: number;
}

export type DataTableState = {
  tableScrollHeight: number;
  tableScrollWidth: number;
  topRowIndex: number;
  leftColumnIndex: number;
  totalVisibleRows: number;
  frozenColumnsWidth: number;
};

export type Row = {
  rowHeight: number;
  children: ReactNode;
};
