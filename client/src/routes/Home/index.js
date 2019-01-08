import React from "react";
import { compose } from "recompose";
import { Link } from "react-router-dom";
import { withRace } from "../../store/reducers/race";
import RacePreviewCard from "../../components/Card";
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";

export default compose(
    withRace,
)(({ race }) => (
    <div>
        <div className="jumbotron rounded-0 text-center">
            <Typography variant="h4">How fast are you?</Typography>
            <Typography variant="h6">RPH is a smart contract for decentralized real world races.</Typography>
            <Link to="/create-race">
                <Button variant="contained" color="primary">
                    Create Race
                </Button>
            </Link>
        </div>
        <div className="container">
            <div className="row">
                <div className="col mb-4">
                    <RacePreviewCard race={race} />
                </div>
                {/* <div className="col mb-4">
                    <RacePreviewCard race={race} />
                </div>
                <div className="col mb-4">
                    <RacePreviewCard race={race} />
                </div> */}
            </div>
        </div>
    </div>
));