import { IUser } from "../types/IUser.ts";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
    LockClosedIcon,
    LockOpenIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import useUsersAction from "../hooks/useUsersAction.ts";
import { ClipLoader } from "react-spinners";

const style = {
    actionButton: "h-8",
};

const COLUMNS: GridColDef[] = [
    { field: "id", headerName: "ID", width: 15 },
    { field: "email", headerName: "Email", width: 170 },
    { field: "first_name", headerName: "First name" },
    { field: "last_name", headerName: "Last name", width: 130 },
    { field: "blocked", headerName: "Status", width: 80 },
    {
        field: "last_login",
        headerName: "Last login",
        width: 230,
        valueGetter: (params: GridValueGetterParams) =>
            params.value
                ? new Date(params.value).toUTCString()
                : "User is not logged in",
    },
    {
        field: "updated_at",
        headerName: "Last update",
        width: 250,
        valueGetter: (params) => new Date(params.value).toUTCString(),
    },
    {
        field: "created_at",
        headerName: "Create time",
        width: 250,
        valueGetter: (params) => new Date(params.value).toUTCString(),
    },
];

const Table = () => {
    const [rowSelected, setRowSelected] = useState<GridRowSelectionModel>([]);
    const [users, setUsers] = useState<IUser[]>();
    const { getUsers, deleteUsers, updateUsers } = useUsersAction();

    const handleGetUsers = () => {
        getUsers().then((data) => {
            setUsers(data);
        });
    };

    const handleDeleteUsers = () => {
        deleteUsers(rowSelected as number[]).then((res) => {
            if (res) {
                handleGetUsers();
            }
        });
    };

    const handleUpdateStatusUsers = (status: boolean) => {
        updateUsers(rowSelected as number[], status).then((res) => {
            if (res) {
                handleGetUsers();
            }
        });
    };

    useEffect(() => {
        handleGetUsers();
    }, []);

    return (
        <>
            <div className="flex justify-between mb-2">
                <h1 className="text-2xl mb-2">Table</h1>
                <div className="flex gap-5">
                    <Button
                        variant="contained"
                        className={style.actionButton}
                        startIcon={<TrashIcon className="h-5" />}
                        color="error"
                        onClick={handleDeleteUsers}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="contained"
                        className={style.actionButton}
                        startIcon={<LockClosedIcon className="h-5" />}
                        color="warning"
                        onClick={() => handleUpdateStatusUsers(true)}
                    >
                        Block
                    </Button>
                    <Button
                        variant="contained"
                        className={style.actionButton}
                        startIcon={<LockOpenIcon className="h-5" />}
                        color="success"
                        onClick={() => handleUpdateStatusUsers(false)}
                    >
                        Unblock
                    </Button>
                </div>
            </div>
            {users ? (
                <div>
                    <DataGrid
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 15,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 15]}
                        columns={COLUMNS}
                        rows={users}
                        checkboxSelection
                        onRowSelectionModelChange={(newRowSelected) => {
                            setRowSelected(newRowSelected);
                        }}
                        rowSelectionModel={rowSelected}
                    />
                    <pre>{JSON.stringify(rowSelected)}</pre>
                </div>
            ) : (
                <div>
                    <ClipLoader />
                </div>
            )}
        </>
    );
};

export default Table;
