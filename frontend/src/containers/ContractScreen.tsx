import * as React from "react";
import * as ReactDOM from "react-dom";
import 'date-fns';
import ContractForm from '../components/ContractForm';

interface IProduct {
    id: number;
    brand: string;
    product: string;
    units: number;
    base_price: number;
}

interface IPayableAmount {
    id: number;
    os_after_12_months: number;
    no_os_after_12_months: number;
    pfs_after_9_months: number;
    no_pfs_after_9_months: number;
}

class ContractScreen extends React.Component<{}, { products: IProduct[], payable_amounts: IPayableAmount[], products_loaded: boolean, payable_loaded: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = {
            products: [],
            payable_amounts: [],
            products_loaded: false,
            payable_loaded: false
        };
    }

    componentDidMount() {

        this.getData<IProduct[]>('/products').then(res => this.setState({ products: res, products_loaded: true }));
        this.getData<IPayableAmount[]>('/payable-amounts').then(res => this.setState({ payable_amounts: res, payable_loaded: true }));

    }

    // async getProducts(url: string): Promise<IProduct[]>{
    //     const response: IProduct[] =
    //       await fetch(url,
    //         { headers: {'Content-Type': 'application/json'}}
    //       ).then(res => res.json<IProduct[]>());

    //     return response;
    // }

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

        var content = this.state.payable_loaded && this.state.products_loaded ? 
        (<div>
            <ContractForm products={this.state.products} deafault_payable_amounts={this.state.payable_amounts}></ContractForm>
        </div>) : (<div></div>);

        return content;
    }
}


export default ContractScreen;