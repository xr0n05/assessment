import * as React from "react";
import * as ReactDOM from "react-dom";
import 'date-fns';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import PatientTable from "../components/PatientTable";
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';


interface IPatient {
    id: number;
    surName: string;
    name: string;
    birthday: number;
    cancer_stage: number;
}


interface IPatientDetails {
    id: number;
    surname: string;
    name: string;
    birthday: string;
    cancer_stage: number;
    events: string[];
}


class PatientScreen extends React.Component<{}, { patients: IPatient[], patients_loaded: boolean, patient_details: IPatientDetails, new_event: string, new_event_ts: Date | null }> {

    constructor(props: any) {
        super(props);
        this.state = {
            patients: [],
            patients_loaded: false,
            patient_details: {
                id: -1,
                surname: " ",
                name: " ",
                birthday: " ",
                cancer_stage: 0,
                events: []
            },
            new_event: 'progressed',
            new_event_ts: new Date()
        };

        this.searchPatient = this.searchPatient.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.onEventTsChange = this.onEventTsChange.bind(this);
        this.onEventNameChange = this.onEventNameChange.bind(this);

    }


    componentDidMount() {

        this.getData<IPatient[]>('/patients').then(res => this.setState({ patients: res, patients_loaded: true }));

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


    searchPatient(patient_id: number) {

        var url: string = '/patient/' + String(patient_id);
        this.getData<IPatientDetails>(url).then(res => this.setState({ patient_details: res }));
    }

    onEventTsChange(date: Date | null) {
        this.setState({ new_event_ts: date });
    }

    onEventNameChange(event: React.ChangeEvent<{ name?: string; value: string }>) {
        this.setState({ new_event: event.target.value });
    }

    addEvent() {

        console.log(this.state);

        var data = {
            "patient_id": this.state.patient_details.id,
            "event_name": this.state.new_event,
            "event_ts": this.state.new_event_ts
        }

        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // send POST request
        fetch('/event', options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
            });


        console.log(data);

        this.searchPatient(this.state.patient_details?.id);

    }


    render() {

        if (this.state.patients_loaded) {
            return (
                <div style={{ padding: 20 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" spacing={2}>
                                <Grid item>
                                    <TextField disabled id="name" label="Patient name" value={this.state.patient_details?.name} />
                                </Grid>
                                <Grid item>
                                    <TextField disabled id="surname" label="Patient surname" value={this.state.patient_details?.surname} />
                                </Grid>
                                <Grid item>
                                    <TextField disabled id="birthday" label="Patient Birthday" value={this.state.patient_details?.birthday} />
                                </Grid>
                                <Grid item>
                                    <TextField disabled id="cancer_stage" label="Cancer stage" value={this.state.patient_details?.cancer_stage} />
                                </Grid>

                                <List component="nav" aria-label="secondary mailbox folders">
                                    {
                                        this.state.patient_details?.events.map(event => (<ListItemText primary={event} />))
                                    }
                                </List>

                            </Grid>
                        </Grid>

                        <Divider />

                        <Grid item xs={12}>
                            <Grid container justifyContent="flex-start" spacing={5}>
                                <Grid item alignItems="center" >
                                    <InputLabel id="new-event-label">New event</InputLabel>
                                    <Select name="selectedEvent" labelId="new-event-label" id="event-input" value={this.state.new_event} onChange={this.onEventNameChange}>
                                        <option
                                            value="progressed"
                                        >progressed</option>
                                        <option
                                            value="dead"
                                        >dead</option>
                                    </Select>
                                </Grid>
                                <Grid item alignItems="center">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="event-ts-picker"
                                            label="Event occured"
                                            format="dd/MM/yyyy"
                                            value={this.state.new_event_ts}
                                            onChange={this.onEventTsChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Button variant="outlined" color="primary" onClick={this.addEvent}>
                        Add event
                    </Button>

                    <Divider />
                    <div></div>

                    <div>
                        <PatientTable patients={this.state.patients} onClickRow={this.searchPatient}></PatientTable>
                    </div>
                </div>);
        } else {
            return (<Container><CircularProgress /></Container>);
        }
    }
}


export default PatientScreen;