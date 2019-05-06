import React from 'react';
import { Props as ColumnProps } from '../Column';

export type Props = {
  children: React.ReactNode;
  groupData?: any;
  headerRenderer: ({ width }: { width: number }) => React.ReactNode;
};

export default function Group({ children, headerRenderer, groupData }: Props) {
  return null;
}

// Used for identifying the component type when iterating through children
Group.__Group__ = true;