import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Map from "../Map";
import { Marker } from "react-google-maps"

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class RacePeviewCard extends React.Component {
  state = { 
      expanded: false
    };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { race, classes } = this.props;
    return (
      <Card className={classes.card}>
        <Link to={`/join-race/${race.id}`}>
            <CardHeader
            avatar={
                <Avatar aria-label="Recipe" className={classes.avatar}>
                {(race.name || "R").slice(0, 1)}
                </Avatar>
            }
            title={race.name || "Race"}
            subheader={race.estimated_start_time || ""}
            />
        </Link>
        <Map defaultZoom={8}>
            {
                (race.checkpoints || [])
                .map(loc => loc.split(","))
                .map(([lat, lng]) => ([Number(lat), Number(lng)]))
                .map(([lat, lng], i) => (
                    <Marker key={i} position={{ lat, lng }} />
                ))                    
            }
        </Map>
        <CardContent>
          <Typography component="p">
            {race.description || ""}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Owner: <a href={`${process.env.REACT_APP_ETHERSCAN}/address/${race.owner}`} target="_blank">{race.owner}</a></Typography>
            <Typography paragraph>No. of checkpoints: {race.checkpoint_count}</Typography>
            <Typography paragraph>No. of participants: {race.participant_count}</Typography>
            <Typography paragraph>Ante: {race.ante} Eth</Typography>
            <Link to={`/join-race/${race.id}`}>
                <Button color="primary" variant="contained">More Info</Button>
            </Link>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

export default withStyles(styles)(RacePeviewCard);