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
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';


export interface ContractFormProps {
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


function ContractForm(props: ContractFormProps) {

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    );

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
                                <TextField required id="manufacturer-input" label="Manufacturer" />
                            </Grid>
                            <Grid item>
                                <TextField required id="insurer-input" label="Insurer" />
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
                                <TextField required id="patient-surname-input" label="Surname" />
                            </Grid>
                            <Grid item>
                                <TextField required id="patient-name-input" label="Name" />
                            </Grid>
                            <Grid item>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="patient-birthday-picker"
                                        label="Patient birthday"
                                        format="dd/MM/yyyy"
                                        value={selectedDate}
                                        onChange={() => { }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                                <InputLabel id="cancer-stage-label">Cancer stage</InputLabel>
                                <Select labelId="cancer-stage-label" id="cancer-stage-select" value="0">
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
                            <Grid item>
                                <TextField required id="brand-input" label="Brand" />
                            </Grid>
                            <Grid item>
                                <TextField required id="product-input" label="Product" />
                            </Grid>
                            <Grid item>
                                <TextField required type="number" id="units-input" label="Units" />
                            </Grid>
                            <Grid item>
                                <TextField required type="number" id="baseprice-input" label="Baseprice CHF" />
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
                                <TextField required id="os-input" label="OS after 12 months" />
                            </Grid>
                            <Grid item>
                                <TextField required id="no-os-input" label="No OS after 12 months" />
                            </Grid>
                            <Grid item>
                                <TextField required id="pfs-input" label="PFS after 9 months" />
                            </Grid>
                            <Grid item>
                                <TextField required id="no-pfs-input" label="No PFS after 9 months" />
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
                                        value={new Date()}
                                        onChange={() => { }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="primary" size="large">
                                    Primary
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </div>
    );

}

export default ContractForm;