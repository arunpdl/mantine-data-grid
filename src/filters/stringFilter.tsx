import { Highlight, Select, TextInput } from '@mantine/core';
import { Column } from '@tanstack/react-table';
import { Filter } from 'tabler-icons-react';
import { DataGridFilterFn, DataGridFilterProps } from '../types';

type FilterState = {
  op: StringFilter;
  value: string;
};

export enum StringFilter {
  Includes = 'in',
  NotIncludes = 'nin',
  Equals = 'eq',
  NotEquals = 'neq',
  StartsWith = 'start',
  EndsWith = 'end',
}

export const stringFilterFn: DataGridFilterFn<any, FilterState> = (row, columnId, filter) => {
  const rowValue = String(row.getValue(columnId)).toLowerCase();
  const op = filter.op || StringFilter.Includes;
  const filterValue = String(filter.value).toLowerCase();
  switch (op) {
    case StringFilter.Includes:
      return rowValue.includes(filterValue);
    case StringFilter.NotIncludes:
      return !rowValue.includes(filterValue);
    case StringFilter.Equals:
      return rowValue === filterValue;
    case StringFilter.NotEquals:
      return rowValue !== filterValue;
    case StringFilter.StartsWith:
      return rowValue.startsWith(filterValue);
    case StringFilter.EndsWith:
      return rowValue.endsWith(filterValue);
    default:
      return true;
  }
};
stringFilterFn.autoRemove = (val) => !val;
stringFilterFn.init = () => ({
  op: StringFilter.Includes,
  value: '',
});
stringFilterFn.element = function ({ filter, onFilterChange }: DataGridFilterProps) {
  const handleValueChange = (value: string) => onFilterChange({ ...filter, value });

  const handleOperatorChange = (op: string) => onFilterChange({ ...filter, op });

  return (
    <>
      <Select
        data={Object.entries(StringFilter).map(([label, value]) => ({
          value,
          label,
        }))}
        value={filter.op || StringFilter.Includes}
        onChange={handleOperatorChange}
      />

      <TextInput
        value={filter.value}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder="Filter value"
        rightSection={<Filter />}
      />
    </>
  );
};

export const highlightFilterValue = ({ renderValue, column }: { column: Column<any, any>; renderValue(): any }) => {
  const filter = column.getFilterValue() as FilterState;

  return (
    <Highlight
      highlight={filter && filter.value ? filter.value : []}
      children={renderValue()}
      style={{ display: 'inline', fontSize: 'inherit' }}
    />
  );
};
