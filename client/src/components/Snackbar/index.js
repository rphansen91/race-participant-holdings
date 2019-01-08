import React from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from '../../store/reducers/snackbar';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles = theme => ({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing.unit,
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  });

export default compose(
    withSnackbar,
    withStyles(styles)
)((props) => {
    const { classes, className, snackbar, closeSnackbar } = props;
    const Icon = variantIcon[snackbar.variant] || CheckCircleIcon;
  
    return (
        <Snackbar
          open={!!snackbar.message}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={() => closeSnackbar()}
          autoHideDuration={6000}
        >
            <SnackbarContent
                className={classNames(classes[snackbar.variant], className)}
                aria-describedby="client-snackbar"
                message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {snackbar.message}
                </span>
                }
                action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={(ev) => {
                        ev.stopPropagation();
                        closeSnackbar();
                    }}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
                ]}
            />
        </Snackbar>
    );
  })