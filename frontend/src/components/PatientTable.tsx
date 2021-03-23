import * as React from "react";
import * as ReactDOM from "react-dom";
import { DataGrid, GridColDef , ValueGetterParams } from '@material-ui/data-grid';


export interface PatientTableProps {
    patients?: {
        id: number;
        surName: string;
        name: string;
        age: number;
        cancerStage: number;
        medication: string;
        progressionWithinRange: boolean;
        survivalWithinRange: boolean;
        alive: boolean;
    }[];
}

const columns: GridColDef [] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'surname', headerName: 'Surname', width: 130 },
    { field: 'name', headerName: 'Name', width: 130 },
    {
        field: 'patientAge',
        headerName: 'Patient Age',
        type: 'number',
        width: 100,
    },
    {
        field: 'cancerStage',
        headerName: 'Cancer stage',
        type: 'number',
        width: 100,
    },
    { field: 'medication', headerName: 'Medication', width: 200 },
    { field: 'progressionWithinRange', headerName: 'Progression happend within 9 months', type: 'boolean', width: 250 },
    { field: 'survivalWithinRange', headerName: 'Survival after 12 months', type: 'boolean', width: 250 },
    { field: 'alive', headerName: 'Still alive', type: 'boolean', width: 150 },
];


const rows = [
    { id: 1, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 2, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 3, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 4, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 5, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 6, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 7, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 8, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 9, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 10, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 11, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 12, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 13, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
    { id: 14, surname: "Muster", name: "Max", patientAge: 55, cancerStage: 3, medication: "ABC 10mg/ml 1000 Units", progressionWithinRange: false, survivalWithinRange: true, alive: true},
];

export default function PatientTable(props: PatientTableProps) {
    return (
        <div style={{ height: 700, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={10} />
        </div>
    );
}