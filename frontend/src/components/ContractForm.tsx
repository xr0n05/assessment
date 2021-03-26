import * as React from "react";
import * as ReactDOM from "react-dom";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { Container } from "@material-ui/core";


export interface ContractFormProps {
    /** List containing product objects */
    products: {
        id: number;
        brand: string;
        product: string;
        units: number;
        baseprice: number;
    }[];

    /** Default values for the payable amounts */
    deafault_payable_amounts: {
        id: number;
        os_after_12_months: number;
        no_os_after_12_months: number;
        pfs_after_9_months: number;
        no_pfs_after_9_months: number;
    };

    brands: string[];
    product_names: string[];
    units: number[];

    onCreateContract: (data: any) => void;
}


function ContractForm(props: ContractFormProps) {

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    );

    const [treatmentStart, setTreatmentStart] = React.useState<Date | null>(
        new Date(),
    );

    const [insurer, setInsurer] = React.useState<string>('');
    const [manufacturer, setManufacturer] = React.useState<string>('');

    const [patientName, setPatientName] = React.useState<string>('');
    const [patientSurname, setPatientSurname] = React.useState<string>('');
    const [patientCancerStage, setPatientCancerStage] = React.useState<number>(0);

    const [os, setOs] = React.useState<number>(props.deafault_payable_amounts.os_after_12_months);
    const [noOs, setNoOs] = React.useState<number>(props.deafault_payable_amounts.no_os_after_12_months);
    const [pfs, setPfs] = React.useState<number>(props.deafault_payable_amounts.pfs_after_9_months);
    const [noPfs, setNoPfs] = React.useState<number>(props.deafault_payable_amounts.no_pfs_after_9_months);

    const [open, setOpen] = React.useState(false);
    const [ageOpen, setAgeOpen] = React.useState(false);





    const [state, setState] = React.useState<{ selectedBrand: string | null; selectedProduct: string | null; selectedUnits: number | null; baseprice: number | null; }>({
        selectedBrand: null,
        selectedProduct: null,
        selectedUnits: null,
        baseprice: null
    });

    React.useEffect(() => {
        if (state.selectedBrand && state.selectedProduct && state.selectedUnits) {
            props.products.map(product => {
                if (state.selectedBrand == product.brand && state.selectedProduct == product.product && state.selectedUnits == product.units) {
                    setState({
                        ...state,
                        baseprice: product.baseprice
                    });
                }
            })
        }
    }, [state.selectedBrand, state.selectedProduct, state.selectedUnits]);



    const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {

        // Update state with the newly selected product informations
        const name = event.target.name as keyof typeof state;
        setState({
            ...state,
            [name]: event.target.value
        });

    };


    const handleCancerStage = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        setPatientCancerStage(event.target.value as unknown as number);
    }


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const handleAgeClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setAgeOpen(false);
    };


    const calcAge = (birthday: Date | null) => {

        if (!birthday) return -1;

        var birthDate = new Date(birthday);
        var today = new Date();

        var years = (today.getFullYear() - birthDate.getFullYear());

        if (today.getMonth() < birthDate.getMonth() ||
            today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate()) {
            years--;
        }

        return years;
    }

    const sendContractToParent = () => {

        if (insurer === "" ||
            manufacturer === "" ||
            patientName === "" ||
            patientSurname === "" ||
            state.selectedBrand === "" ||
            state.selectedProduct === "" ||
            !state.selectedUnits ||
            !state.baseprice) {
            setOpen(true);
            return;
        }

        if (selectedDate && calcAge(selectedDate) >= 55) {
            setAgeOpen(true);
            return;
        }

        var data = {
            "treatment_start": treatmentStart,
            "insurer": insurer,
            "manufacturer": manufacturer,
            "patient_surname": patientSurname,
            "patient_name": patientName,
            "patient_birthday": selectedDate,
            "patient_cancer_stage": patientCancerStage,
            "product_brand": state.selectedBrand,
            "product_name": state.selectedProduct,
            "product_units": state.selectedUnits,
            "product_baseprice": state.baseprice,
            "os": os,
            "no_os": noOs,
            "pfs": pfs,
            "no_pfs": noPfs
        }

        props.onCreateContract(data);
    }

    return (
        <div style={{ padding: 20 }}>
            <form noValidate autoComplete="off">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" spacing={2}>
                            <Grid item>
                                <h3>Contract parties</h3>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" spacing={2}>
                            <Grid item>
                                <TextField required id="manufacturer-input" label="Manufacturer" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setManufacturer(e.target.value);
                                }} />
                            </Grid>
                            <Grid item>
                                <TextField required id="insurer-input" label="Insurer" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setInsurer(e.target.value);
                                }} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" spacing={2}>
                            <Grid item>
                                <h3>Patient information</h3>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" alignItems="center" spacing={2}>
                            <Grid item>
                                <TextField required id="patient-surname-input" label="Surname" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPatientSurname(e.target.value);
                                }} />
                            </Grid>
                            <Grid item>
                                <TextField required id="patient-name-input" label="Name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPatientName(e.target.value);
                                }} />
                            </Grid>
                            <Grid item>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="patient-birthday-picker"
                                        label="Patient birthday"
                                        format="dd/MM/yyyy"
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                                <InputLabel id="cancer-stage-label">Cancer stage</InputLabel>
                                <Select labelId="cancer-stage-label" id="cancer-stage-select" value={patientCancerStage} onChange={handleCancerStage}>
                                    {[0, 1, 2, 3].map((stage) => (
                                        <MenuItem
                                            value={stage}
                                        >{stage}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>


                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" spacing={2}>
                            <Grid item>
                                <h3>Medication</h3>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" spacing={2}>
                            <InputLabel id="product-brand-label">Brand</InputLabel>
                            <Select name="selectedBrand" labelId="product-brand-label" id="product_brand" value={state.selectedBrand} onChange={handleChange}>
                                {
                                    props.brands.map(brand => (
                                        <option
                                            value={brand}
                                        >{brand}</option>))
                                }
                            </Select>
                            <InputLabel id="product-name-label">Product</InputLabel>
                            <Select name="selectedProduct" labelId="product-name-label" id="product_name" value={state.selectedProduct} onChange={handleChange}>
                                {props.product_names.map(product_name => (<option
                                    value={product_name}
                                >{product_name}</option>
                                ))}
                            </Select>
                            <InputLabel id="product-units-label">Units</InputLabel>
                            <Select name="selectedUnits" labelId="product-units-label" id="product_units" value={state.selectedUnits} onChange={handleChange}>
                                {props.units.map(unit => (
                                    <option
                                        value={unit}
                                    >{unit}</option>
                                ))}
                            </Select>
                            <Grid item>
                                <TextField required type="number" id="baseprice-input" label="Baseprice CHF" value={state.baseprice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setState({ ...state, baseprice: e.target.valueAsNumber });
                                }} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" spacing={2}>
                            <Grid item>
                                <h3>Payable amounts agreement</h3>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" spacing={2}>
                            <Grid item>
                                <TextField required type="number" id="os-input" label="OS after 12 months" defaultValue={props.deafault_payable_amounts.os_after_12_months} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setOs(e.target.valueAsNumber);
                                }} />
                            </Grid>
                            <Grid item>
                                <TextField required type="number" id="no-os-input" label="No OS after 12 months" defaultValue={props.deafault_payable_amounts?.no_os_after_12_months} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setNoOs(e.target.valueAsNumber);
                                }} />
                            </Grid>
                            <Grid item>
                                <TextField required type="number" id="pfs-input" label="PFS after 9 months" defaultValue={props.deafault_payable_amounts?.pfs_after_9_months} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPfs(e.target.valueAsNumber);
                                }} />
                            </Grid>
                            <Grid item>
                                <TextField required type="number" id="no-pfs-input" label="No PFS after 9 months" defaultValue={props.deafault_payable_amounts?.no_pfs_after_9_months} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setNoPfs(e.target.valueAsNumber);
                                }} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-start" alignItems="center" spacing={2}>
                            <Grid item>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="treatment-start-picker"
                                        label="Treatment start"
                                        format="dd/MM/yyyy"
                                        value={treatmentStart}
                                        onChange={setTreatmentStart}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>

            <Button variant="outlined" color="primary" size="large" onClick={sendContractToParent}>
                Create contract
            </Button>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    Please fill out all required input fields!
                </Alert>
            </Snackbar>

            <Container>
                <Snackbar open={ageOpen} autoHideDuration={3000} onClose={handleAgeClose}>
                    <Alert onClose={handleAgeClose} severity="error">
                        The patient must be younger than 55 to enroll!
                </Alert>
                </Snackbar>
            </Container>
        </div>
    );

}

export default ContractForm;