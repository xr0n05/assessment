import * as React from "react";
import * as ReactDOM from "react-dom";
import 'date-fns';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import PatientTable from "./PatientTable";


export interface PatientScreenProps {
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

function PatientScreen(props: PatientScreenProps) {

    return (
        <div style={{ padding: 20 }}>
            <form noValidate autoComplete="off" style={{ marginBottom: 20 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item>
                                <TextField id="standard-search" label="Search patient" type="search" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>

            <Divider />

            <PatientTable></PatientTable>
        </div>
    );

}

export default PatientScreen;