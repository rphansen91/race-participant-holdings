import React from "react";
import { compose } from "recompose";
import { withRace } from "../../store/reducers/race";
import { withUser } from "../../store/reducers/user";
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PinDropIcon from '@material-ui/icons/PinDrop';
import UserIcon from '@material-ui/icons/AccountCircle';
import Map from "../../components/Map";
import { Marker } from "react-google-maps";
import { withDynamic } from "../../components/Active";

const activeMarkerIcon = "http://maps.google.com/mapfiles/ms/micons/yellow.png"
const markerIcon = "http://maps.google.com/mapfiles/ms/micons/blue.png"

export default compose(
    withRace,
    withUser,
    withDynamic("marker"),
)(({ race, user, marker, setMarker, joinRace }) => (
    <div>
        <Map defaultZoom={8} center={{ lat: 1, lng: 1 }}>
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
        { race.loading ? <div /> : <div className="container py-4">
            <Typography variant="h4" className="mb-0">{race.name || ""}</Typography>
            <Typography variant="h6" className="mb-2">{race.description || ""}</Typography>
            <Typography paragraph className="mb-0">Owner: <a href={`${process.env.REACT_APP_ETHERSCAN}/address/${race.owner}`} target="_blank">{race.owner}</a></Typography>
            <Typography paragraph className="mb-0">No. of checkpoints: {race.checkpoint_count}</Typography>
            <Typography paragraph className="mb-0">No. of participants: {race.participant_count || 0}</Typography>
            <Typography paragraph className="mb-0">Ante: {race.ante} Eth</Typography>
            <Button className="mb-2" color="primary" variant="contained" onClick={() => joinRace(race.ante)}>Join Race</Button>
            <div className="row">
                <div className="col">
                <Typography variant="h6" className="mb-2">Checkpoints</Typography>
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
                    <Typography variant="h6" className="mb-2">Participants</Typography>
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