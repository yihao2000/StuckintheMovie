import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
});

const LoadingButton = (props) => {
  const { classes, loading, done, ...other } = props;

  if (done) {
    return (
      <Button className={classes.button} {...other} disabled>
        <CheckIcon />
      </Button>
    );
  } else if (loading) {
    return (
      <Button className={classes.button} {...other}>
        <CircularProgress />
      </Button>
    );
  } else {
    return (
      <Button className={classes.button} {...other}>
        {props.children}
      </Button>
    );
  }
};

LoadingButton.defaultProps = {
  loading: false,
  done: false,
};

LoadingButton.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  done: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default withStyles(styles)(LoadingButton);
