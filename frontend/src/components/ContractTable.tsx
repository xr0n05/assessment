import * as React from "react";
import * as ReactDOM from "react-dom";
import { DataGrid, GridColDef , ValueGetterParams } from '@material-ui/data-grid';

interface IContract {
    id: number;
    treatment_start: string;
    status: string;
    producer_id: number;
    producer_name: string;
    insurer_id: number;
    insurer_name: string;
    product_id: number;
    medication_brand: string;
    medication_product: string;
    medication_units: number;
    medication_baseprice: number;
    patient_id: number;
    patient_name: string;
    patient_surname: string;
    patient_birthday: string;
    patient_cancer_stage: number;
    payable_amount_id: number;
    os_payable: number;
    no_os_payable: number;
    pfs_payable: number;
    no_pfs_payable: number;
}


const columns: GridColDef [] = [
    { field: 'id', headerName: 'ID', width: 100 },

    { field: 'producer_id', headerName: 'Manufacturer ID', width: 130, hide:true},
    { field: 'producer_name', headerName: 'Manufacturer', width: 130 },

    { field: 'insurer_id', headerName: 'Insurer ID', width: 130, hide:true},
    { field: 'insurer_name', headerName: 'Insurer', width: 130 },

    { field: 'patient_id', headerName: 'Patient ID', width: 160, hide:true },
    { field: 'patient_name', headerName: 'Patient Name', width: 160 },
    { field: 'patient_surname', headerName: 'Patient Surame', width: 160 },

    {
        field: 'patient_birthday',
        headerName: 'Patient Birthday',
        width: 100,
    },
    {
        field: 'patient_cancer_stage',
        headerName: 'Cancer stage',
        type: 'number',
        width: 100,
    },

    { field: 'product_id', headerName: 'Product ID', width: 100, hide:true },

    { field: 'medication_brand', headerName: 'Medication Brand', width: 200 },
    { field: 'medication_product', headerName: 'Medication Name', width: 200 },
    { field: 'medication_units', headerName: 'Medication Units', width: 200 },
    { field: 'medication_baseprice', headerName: 'Medication Baseprice', width: 200 },

    { field: 'treatment_start', headerName: 'Treatment start', width: 150 },
    { field: 'status', headerName: 'Contract status', width: 150 },

    { field: 'payable_amount_id', headerName: 'Payable Amount ID', width: 150, hide:true },
    { field: 'os_payable', headerName: 'OS after 12 months', width: 150 },
    { field: 'no_os_payable', headerName: 'No OS after 12 months', width: 150 },
    { field: 'pfs_payable', headerName: 'PFS after 9 months', width: 150 },
    { field: 'no_pfs_payable', headerName: 'No PFS before 9 months', width: 150 },

];


export default function ContractTable(props: {contracts: IContract[]}) {
    return (
        <div style={{ height: 700, width: '100%' }}>
            <DataGrid rows={props.contracts} columns={columns} pageSize={10} />
        </div>
    );
}