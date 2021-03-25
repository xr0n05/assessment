import * as React from "react";
import * as ReactDOM from "react-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import 'date-fns';
import ContractForm from '../components/ContractForm';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';

interface IProduct {
    id: number;
    brand: string;
    product: string;
    units: number;
    baseprice: number;
}

interface IPayableAmount {
    id: number;
    os_after_12_months: number;
    no_os_after_12_months: number;
    pfs_after_9_months: number;
    no_pfs_after_9_months: number;
}

class CreateContractScreen extends React.Component<{}, { products: IProduct[], payable_amounts: IPayableAmount[], products_loaded: boolean, payable_loaded: boolean, open: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = {
            products: [],
            payable_amounts: [],
            products_loaded: false,
            payable_loaded: false,
            open: false
        };

        this.createContract = this.createContract.bind(this);
    }

    componentDidMount() {

        this.getData<IProduct[]>('/products').then(res => this.setState({ products: res, products_loaded: true }));
        this.getData<IPayableAmount[]>('/payable-amounts').then(res => this.setState({ payable_amounts: res, payable_loaded: true }));

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

    createContract(data: any) {

        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // send POST request
        fetch('/contract', options)
            .then(response => response.json())
            .then(response => {
                if (response['status'] == 'ok') this.setState({ open: true });
            });


        console.log(data);
    }

    handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
    };

    render() {


        if (this.state.payable_loaded && this.state.products_loaded) {
            var brands: Set<string> = new Set();
            this.state.products.map(product => brands.add(product.brand));

            var product_names: Set<string> = new Set();
            this.state.products.map(product => product_names.add(product.product));

            var units: Set<number> = new Set();
            this.state.products.map(product => units.add(product.units));

            var default_payable_amount: IPayableAmount = this.state.payable_amounts.filter(amount => amount.id == 1)[0]

            return (<div>
                <ContractForm onCreateContract={this.createContract} brands={Array.from(brands)} product_names={Array.from(product_names)} units={Array.from(units)} products={this.state.products} deafault_payable_amounts={default_payable_amount}></ContractForm>
                <Snackbar open={this.state.open} autoHideDuration={3000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="success">
                        Contract successfully created!
                    </Alert>
                </Snackbar>
            </div>);
        } else {
            return <CircularProgress />;
        }

    }
}


export default CreateContractScreen;