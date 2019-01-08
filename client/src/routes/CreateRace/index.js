import React from "react";
import { compose } from "recompose";
import classnames from "classnames";
import Form from "react-form-controls";
import { withRace } from "../../store/reducers/race";
import { withUser } from "../../store/reducers/user";
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PinDropIcon from '@material-ui/icons/PinDrop';
import UserIcon from '@material-ui/icons/AccountCircle';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Map from "../../components/Map";
import { Marker } from "react-google-maps";
import { withDynamic } from "../../components/Active";
import { withStyles } from '@material-ui/core/styles';
import DoneIcon from "@material-ui/icons/Done";

const activeMarkerIcon = "http://maps.google.com/mapfiles/ms/micons/yellow.png"
const markerIcon = "http://maps.google.com/mapfiles/ms/micons/blue.png"

const submitStyles = theme => ({
    submit: {
        position: 'relative',
        marginLeft: 0,
        width: 'auto',
    },
    submitIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        height: 'inherit',
        margin: 'auto'
    },
    inputClassName: {
        paddingRight: theme.spacing.unit * 6
    }
})

const style = theme => ({
    fab: {
        position: "absolute",
        bottom: 0,
        margin: 12,
    },
    vertCrosshair: {
        position: "absolute",
        margin: "auto",
        width: "100%",
        backgroundColor: "silver",
        height: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    horCrosshair: {
        position: "absolute",
        margin: "auto",
        height: "100%",
        backgroundColor: "silver",
        width: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
})

const SubmitField = withStyles(submitStyles)(({ className, inputClassName, classes, onChange, ...props }) => (
    <div className={classnames(classes.submit, className)}> 
        <TextField className={classes.inputClassName} {...props} onChange={ev => onChange(ev.target.value)} />
        <IconButton className={classes.submitIcon} type="submit">
            <DoneIcon />
        </IconButton>
    </div>
))

export default compose(
    withRace,
    withUser,
    withDynamic("marker"),
    withDynamic("map"),
    withStyles(style),
)(({ classes, race, user, map, setMap, marker, setMarker, setName, setDescription, setEstimatedStartTime, addCheckpoint }) => (
    <div>
        <div className="jumbotron rounded-0 text-center mb-0">
            <div className="row">
                <div className="offset-md-4 col-md-4">
                    <Typography variant="h4">Create Race</Typography>
                </div>
            </div>
        </div>
        <div className="position-relative">
            <Map defaultZoom={8} onMapMounted={(map) => console.log("Set map") || setMap(map)}>
                {
                    (race.checkpoints || [])
                    .map(loc => loc.split(","))
                    .map(([lat, lng]) => ([Number(lat), Number(lng)]))
                    .map(([lat, lng], i) => (
                        <Marker key={i} position={{ lat, lng }} icon={{
                            url: (marker === i) ? activeMarkerIcon : markerIcon
                        }} />
                    ))                    
                }
            </Map>
            <div className={classes.vertCrosshair} />
            <div className={classes.horCrosshair} />
            <Fab 
                className={classes.fab}
                color="primary" 
                onClick={() => addCheckpoint({
                    lat: map.getCenter().lat(),
                    lng: map.getCenter().lng(),
                })}>
                <PinDropIcon />
            </Fab>
        </div>
        {race.loading ? <div /> : <div className="container py-4">
            <Form onSubmit={({ name }) => setName(name)}>
                <SubmitField 
                    value={race.name}
                    name="name" 
                    label="Name" 
                    variant="outlined" 
                    className="mb-2"
                    fullWidth />
                <div />
            </Form>
            <Form onSubmit={({ description }) => setDescription(description)}>
                <SubmitField 
                    value={race.description}
                    name="description" 
                    label="Description" 
                    className="mb-2" 
                    variant="outlined"  
                    fullWidth 
                    multiline 
                    rowsMax="4" 
                />
                <div />
            </Form>
            <Form onSubmit={({ start_time }) => setEstimatedStartTime(start_time)}>
                <SubmitField value={race.estimated_start_time || new Date().toLocaleDateString()} type="date" name="start_time" label="Estimated start time" className="mb-2" variant="outlined"  fullWidth />
                <div />
            </Form>
            <Typography paragraph className="mb-0">Owner: <a href={`${process.env.REACT_APP_ETHERSCAN}/address/${race.owner}`}>{race.owner}</a></Typography>
            <Typography paragraph className="mb-0">No. of checkpoints: {race.checkpoint_count}</Typography>
            <Typography paragraph className="mb-0">No. of participants: {race.participant_count || 0}</Typography>
            <Typography paragraph className="mb-0">Ante: {race.ante} Eth</Typography>
            <div className="row">
                <div className="col">
                    <List>
                    {
                        (race.checkpoints || [])
                        .map(loc => loc.split(","))
                        .map(([lat, lng]) => ([Number(lat), Number(lng)]))
                        .map(([lat, lng], i) => (
                            <ListItem key={i} button onClick={() => setMarker(i)}>
                                <Avatar>
                                    <PinDropIcon />
                                </Avatar>
                                <ListItemText primary={`Checkpoint ${i + 1}`} secondary={`Lat: ${lat} Lng: ${lng}`} />
                            </ListItem>
                        ))
                    }
                    </List>
                </div>
                <div className="col">
                    <List>
                    {
                        (race.participants || [])
                        .map(({ sender }, i) => (
                            <a key={i} href={`${process.env.REACT_APP_ETHERSCAN}/address/${sender}`}>
                                <ListItem button>
                                    <Avatar>
                                        <UserIcon />
                                    </Avatar>
                                    <ListItemText primary={`Participant ${i + 1}`} secondary={sender} />
                                </ListItem>
                            </a>
                        ))
                    }
                    </List>
                </div>
            </div>
        </div>}
    </div>
));