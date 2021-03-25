import * as React from "react";
import * as ReactDOM from "react-dom";
import 'date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';
import ContractTable from '../components/ContractTable';

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
    amount: number;
}



class ListContractScreen extends React.Component<{}, { contracts: IContract[], contracts_loaded: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = {
            contracts: [],
            contracts_loaded: false,
        };
    }

    componentDidMount() {

        this.getData<IContract[]>('/contracts').then(res => this.setState({ contracts: res, contracts_loaded: true }));

    }

    getData<T>(url: string): Promise<T> {
        return fetch(url, { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json() as Promise<T>
            })
    }

    render() {

        if (this.state.contracts_loaded) {
            return (<div>
                <ContractTable contracts={this.state.contracts}></ContractTable>
            </div>);
        } else {
            return <CircularProgress />;
        }
    }
}


export default ListContractScreen;