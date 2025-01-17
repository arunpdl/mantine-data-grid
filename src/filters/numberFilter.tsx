import { NumberInput, Select } from '@mantine/core';
import { Filter } from 'tabler-icons-react';
import { DataGridFilterFn, DataGridFilterProps } from '../types';

type FilterState = {
  op: NumberFilter;
  value: number;
};

export enum NumberFilter {
  Equals = 'eq',
  NotEquals = 'neq',
  GreaterThan = 'gt',
  GreaterThanOrEquals = 'gte',
  LowerThan = 'lt',
  LowerThanOrEquals = 'lte',
}

export const numberFilterFn: DataGridFilterFn<any, FilterState> = (row, columnId, filter) => {
  const rowValue = Number(row.getValue(columnId));
  const op = filter.op || NumberFilter.Equals;
  const filterValue = Number(filter.value);
  switch (op) {
    case NumberFilter.Equals:
      return rowValue === filterValue;
    case NumberFilter.NotEquals:
      return rowValue !== filterValue;
    case NumberFilter.GreaterThan:
      return rowValue > filterValue;
    case NumberFilter.GreaterThanOrEquals:
      return rowValue >= filterValue;
    case NumberFilter.LowerThan:
      return rowValue < filterValue;
    case NumberFilter.LowerThanOrEquals:
      return rowValue <= filterValue;
    default:
      return true;
  }
};
numberFilterFn.autoRemove = (val) => !val;
numberFilterFn.init = () => ({
  op: NumberFilter.GreaterThan,
  value: 0,
});
numberFilterFn.element = function ({ filter, onFilterChange }: DataGridFilterProps) {
  const handleValueChange = (value: number) => onFilterChange({ ...filter, value });

  const handleOperatorChange = (op: string) => onFilterChange({ ...filter, op });

  return (
    <>
      <Select
        data={Object.entries(NumberFilter).map(([label, value]) => ({
          value,
          label,
        }))}
        value={filter.op || NumberFilter.Equals}
        onChange={handleOperatorChange}
      />

      <NumberInput
        value={filter.value}
        onChange={(e) => handleValueChange(e || 0)}
        placeholder="Filter value"
        rightSection={<Filter />}
      />
    </>
  );
};
