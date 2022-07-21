import { useEffect, useMemo } from 'react';
import { ScrollArea, Stack, Table as MantineTable } from '@mantine/core';
import {
    ColumnSizingInfoState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    RowData,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import useStyles from './DataGrid.styles';

import { GlobalFilter } from './GlobalFilter';
import { ColumnSorter } from './ColumnSorter';
import { ColumnFilter } from './ColumnFilter';
import {
    Pagination,
    DEFAULT_INITIAL_PAGE,
    DEFAULT_INITIAL_SIZE,
} from './Pagination';
import { DataGridProps } from './types';

export function DataGrid<TData extends RowData>({
    data,
    columns,
    classNames,
    styles,
    sx,
    noEllipsis,
    withGlobalFilter,
    withPagination,
    pagination,
    debug = false,
    onPageChange = () => {},
    striped,
    highlightOnHover,
    horizontalSpacing,
    verticalSpacing = 'xs',
    fontSize,
    ...others
}: DataGridProps<TData>) {
    const { classes, cx } = useStyles(
        {},
        {
            classNames,
            styles,
            name: 'DataGrid',
        }
    );

    const [globalFilter, setGlobalFilter] = useState('');
    const [columnSizingInfo, setColumnSizingInfo] =
        useState<ColumnSizingInfoState>({} as any);

    const initialPageIndex =
        pagination?.initialPageIndex || DEFAULT_INITIAL_PAGE;
    const initiaPageSize = pagination?.initialPageSize || DEFAULT_INITIAL_SIZE;

    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: initialPageIndex,
        pageSize: initiaPageSize,
    });

    const paginationMemo = useMemo(() => {
        if (withPagination) {
            return {
                pageIndex,
                pageSize,
            };
        }

        return {
            pageIndex: 0,
            pageSize: data.length,
        };
    }, [withPagination, data, pageIndex, pageSize]);

    const pageCount = useMemo(() => {
        if (withPagination && pageSize) {
            return Math.floor(data.length / pageSize) ?? -1;
        }
        return data.length;
    }, [data, pageSize, withPagination]);

    const table = useReactTable<TData>({
        data,
        columns,
        columnResizeMode: 'onChange',
        enableColumnFilters: true,
        enableColumnResizing: true,
        enableGlobalFilter: withGlobalFilter,
        state: {
            globalFilter,
            columnSizingInfo,

            // For pagination
            ...(withPagination ? { pagination: paginationMemo } : {}),
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnSizingInfoChange: setColumnSizingInfo,

        // Pagination feature
        ...(withPagination
            ? {
                  getPaginationRowModel: getPaginationRowModel(),
                  pageCount: pageCount,
                  onPaginationChange: setPagination,
              }
            : {}),

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        debugTable: debug,
        debugHeaders: debug,
        debugColumns: debug,
    });

    useEffect(() => {
        if (!withPagination) {
            table.setPageSize(data.length);
        }
    }, []);

    return (
        <Stack {...others} spacing={verticalSpacing}>
            {withGlobalFilter && (
                <GlobalFilter
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    className={classes.globalFilter}
                />
            )}
            <ScrollArea>
                <MantineTable
                    striped={striped}
                    highlightOnHover={highlightOnHover}
                    horizontalSpacing={horizontalSpacing}
                    verticalSpacing={verticalSpacing}
                    fontSize={fontSize}
                    className={classes.table}
                >
                    <thead className={classes.header} role="rowgroup">
                        {table
                            .getHeaderGroups()
                            .map((group, groupIndex, headerGroups) => (
                                <tr
                                    key={group.id}
                                    className={classes.row}
                                    role="row"
                                >
                                    {group.headers.map(
                                        (header, headerIndex) => (
                                            <th
                                                key={header.id}
                                                style={{
                                                    width: header.getSize(),
                                                }}
                                                className={cx(
                                                    classes.headerCell
                                                )}
                                                role="columnheader"
                                            >
                                                {!header.isPlaceholder && (
                                                    <>
                                                        <div
                                                            className={cx({
                                                                [classes.ellipsis]:
                                                                    !noEllipsis,
                                                            })}
                                                        >
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}
                                                        </div>
                                                        <div
                                                            className={
                                                                classes.headerCellButtons
                                                            }
                                                        >
                                                            {header.column.getCanSort() && (
                                                                <ColumnSorter
                                                                    className={
                                                                        classes.sorter
                                                                    }
                                                                    column={
                                                                        header.column
                                                                    }
                                                                />
                                                            )}
                                                            {header.column.getCanFilter() && (
                                                                <ColumnFilter
                                                                    className={
                                                                        classes.filter
                                                                    }
                                                                    column={
                                                                        header.column
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                        {header.column.getCanResize() && (
                                                            <div
                                                                className={
                                                                    classes.resizer
                                                                }
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                                onMouseDown={header.getResizeHandler()}
                                                                onTouchStart={header.getResizeHandler()}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </th>
                                        )
                                    )}
                                </tr>
                            ))}
                    </thead>
                    <tbody className={classes.body} role="rowgroup">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className={classes.row} role="row">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        style={{
                                            width: cell.column.getSize(),
                                        }}
                                        className={cx(classes.dataCell, {
                                            [classes.ellipsis]: !noEllipsis,
                                        })}
                                        children={flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                        role="cell"
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </MantineTable>
            </ScrollArea>
            {withPagination && (
                <Pagination
                    table={table}
                    onPageChange={onPageChange}
                    pageSizes={pagination?.pageSizes}
                    className={classes.pagination}
                />
            )}
        </Stack>
    );
}