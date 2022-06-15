import React from "react";
import {useNavigate} from "react-router-dom";
import { SchedulesListProps } from "./SchedulesList";

export interface Data {
    name: string;
    published: number;
    // lastModified: number;
}

export function createData(
    name: string,
    published: number
    // lastModified: number
): Data {
    return {
        name,
        published
        // lastModified
    };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export type Order = 'asc' | 'desc';

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export const useSchedulesListLogic = (props: SchedulesListProps, rows: Data[]) => {
    return {
        useTable: (): [
            selected: readonly string[],
            order: Order,
            orderBy: keyof Data,
            page: number,
            rowsPerPage: number,
            dense: boolean,
            emptyRows: number,

            isSelected: (name: string) => boolean,
            handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void,
            handleClick: (event: React.MouseEvent<unknown>, name: string) => void,
            handleRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data,) => void,
            handleChangePage: (event: unknown, newPage: number) => void,
            handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void,
            handleChangeDense: (event: React.ChangeEvent<HTMLInputElement>) => void,
            handleRowClick: (event: React.MouseEvent<unknown>, name: string) => void,
            handleResetSelect: () => void
        ] => {

            const [order, setOrder] = React.useState<Order>('desc');
            const [orderBy, setOrderBy] = React.useState<keyof Data>('published');
            const [selected, setSelected] = React.useState<readonly string[]>([]);
            const [page, setPage] = React.useState(0);
            const [dense, setDense] = React.useState(false);
            const [rowsPerPage, setRowsPerPage] = React.useState(5);
            const navigate = useNavigate();

            const handleRequestSort = (
                event: React.MouseEvent<unknown>,
                property: keyof Data,
            ) => {
                const isAsc = orderBy === property && order === 'asc';
                setOrder(isAsc ? 'desc' : 'asc');
                setOrderBy(property);
            };

            const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.checked) {
                    const newSelecteds = rows.map((n) => n.name);
                    setSelected(newSelecteds);
                    return;
                }
                setSelected([]);
            };

            const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
                const selectedIndex = selected.indexOf(name);
                let newSelected: readonly string[] = [];

                if (selectedIndex === -1) {
                    newSelected = newSelected.concat(selected, name);
                } else if (selectedIndex === 0) {
                    newSelected = newSelected.concat(selected.slice(1));
                } else if (selectedIndex === selected.length - 1) {
                    newSelected = newSelected.concat(selected.slice(0, -1));
                } else if (selectedIndex > 0) {
                    newSelected = newSelected.concat(
                        selected.slice(0, selectedIndex),
                        selected.slice(selectedIndex + 1),
                    );
                }

                setSelected(newSelected);
            };

            const handleChangePage = (event: unknown, newPage: number) => {
                setPage(newPage);
            };

            const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
            };

            const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
                setDense(event.target.checked);
            };

            const isSelected = (name: string) => selected.indexOf(name) !== -1;

            // Avoid a layout jump when reaching the last page with empty rows.
            const emptyRows =
                page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

            const handleRowClick = (event: React.MouseEvent<unknown>, name: string) => {

                let foundIndex = -1;
                rows.forEach((element, index) => {
                    if (element.name === name) foundIndex = index;
                });

                navigate(`/editor/${foundIndex}`);
            }

            const handleResetSelect = () => {
                setSelected([]);
            }

            return [
                selected,
                order,
                orderBy,
                page,
                rowsPerPage,
                dense,
                emptyRows,

                isSelected,
                handleSelectAllClick,
                handleClick,
                handleRequestSort,
                handleChangePage,
                handleChangeRowsPerPage,
                handleChangeDense,
                handleRowClick,
                handleResetSelect
            ];
        }
    }
}