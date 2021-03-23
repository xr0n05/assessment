import * as React from "react";
import * as ReactDOM from "react-dom";
import { DataGrid, GridColDef , ValueGetterParams } from '@material-ui/data-grid';


export interface ContractListProps {
    /** List containing product objects */
    products?: {
        id: number;
        brand: string;
        product: string;
        units: number;
        base_price: number;
    }[];

    /** Default values for the payable amounts */
    deafault_payable_amounts?: {
        os_after_12_months: number;
        no_os_after_12_months: number;
        pfs_after_9_months: number;
        no_pfs_after_9_months: number;
    };
}

const columns: GridColDef [] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'manufacturer', headerName: 'Manufacturer', width: 130 },
    { field: 'insurer', headerName: 'Insurer', width: 130 },
    { field: 'patientName', headerName: 'Patient Name', width: 160 },
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
    { field: 'baseprice', headerName: 'Baseprice', type: 'number', width: 150 },
    { field: 'treatmentStart', headerName: 'Treatment start', width: 150 },
    { field: 'contractStatus', headerName: 'Contract status', width: 150 },


];


const rows = [
    { id: 1, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 2, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 3, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 4, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 5, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 6, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 7, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 8, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 9, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 10, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},
    { id: 11, manufacturer: 'Roche', insurer: 'Swica', patientName: "Max Muster" , patientAge: 55, cancerStage:2, medication: "ABC 10mg/ml 1000 Units", baseprice: 1000, treatmentStart: "10.10.2010",contractStatus: "ongoing"},

];

export default function ContractTable() {
    return (
        <div style={{ height: 700, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={10} />
        </div>
    );
}