import * as React from "react";
import * as ReactDOM from "react-dom";
import { DataGrid, GridColDef , ValueGetterParams } from '@material-ui/data-grid';


export interface PatientTableProps {
    patients: {
        id: number;
        surName: string;
        name: string;
        birthday: number;
        cancer_stage: number;
    }[];

    onClickRow: (patient_id: number) => void;
}

const columns: GridColDef [] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'surname', headerName: 'Surname', width: 200 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
        field: 'birthday',
        headerName: 'Birthday',
        type: 'string',
        width: 200,
    },
    {
        field: 'cancer_stage',
        headerName: 'Cancer stage',
        type: 'number',
        width: 200,
    }
];


export default function PatientTable(props: PatientTableProps) {

    const searchPatient = (param: any) => {
        console.log(param.row.id);
        props.onClickRow(param.row.id);
    }


    return (
        <div style={{ height: 700, width: '100%' }}>
            <DataGrid rows={props.patients} columns={columns} pageSize={10} onRowClick={searchPatient} />
        </div>
    );
}