import React from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { withRace } from '../../store/reducers/race';
import { Link } from "react-router-dom";

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    color: "#fff"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar({ classes, addCheckpoint }) {
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Link to="/">
            <Typography variant="h6" className={classes.grow}>
                Race Participant Holdings
            </Typography>
          </Link>
          {/* <Button 
            onClick={() => addCheckpoint()}
            color="inherit">Add Checkpoint</Button> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default compose(
    withStyles(styles),
    withRace,
)(ButtonAppBar);