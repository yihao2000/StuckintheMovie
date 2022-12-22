import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Box, Grid, IconButton } from "@material-ui/core";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import { Dialog } from "@material-ui/core";
import { DialogActions } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import { DialogContentText } from "@material-ui/core";
import { DialogTitle } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ClipLoader } from "react-spinners";
import { Divider } from "@material-ui/core";
import { Snackbar } from "@material-ui/core";
import { acceptLeaveRequest, rejectLeaveRequest } from "../../database/query";

const useStyles = makeStyles({
  root: {
    marginTop: "5px",
    boxShadow: "none",
    border: "1px",
    height: "12vh",
  },

  title: {
    fontSize: 14,
  },
  pos: {},
  button: {
    padding: "0",
    paddingBlockStart: "5",
  },
});

interface Data {
  date: string;
  reason: string;
  status: string;
  id: string;
  leaveRequestMessage: boolean;
  setLeaveRequestMessage: Function;
}

export default function PersonalLeaveCard(props: Data) {
  const classes = useStyles();

  const [openConfirmationDialog, setOpenConfirmationDialog] =
    React.useState(false);
  const [status, setStatus] = React.useState("");
  const [updating, setUpdating] = React.useState(false);

  const confirmAction = async () => {
    if (status == "Confirm") {
      acceptLeaveRequest(props.id).then((e) => {});
    } else if (status == "Decline") {
      rejectLeaveRequest(props.id).then((e) => {});
    }

    setUpdating(true);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);
    setUpdating(false);
    setOpenConfirmationDialog(false);

    props.setLeaveRequestMessage(true);
  };

  const handleOpenConfirmationDialog = (status: String) => {
    if (status == "Confirm") {
      setStatus("Confirm");
    } else if (status == "Decline") {
      setStatus("Decline");
    }
    setOpenConfirmationDialog(true);
  };

  const handleCloseLeaveRequestMessage = () => {
    props.setLeaveRequestMessage(false);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const getColor = (status: string) => {
    if (status == "Pending") {
      return "blue";
    } else if (status == "Accepted") {
      return "green";
    } else {
      return "red";
    }
  };

  return (
    <Card className={classes.root} style={{ backgroundColor: "#FFFFFF" }}>
      <CardContent>
        <Grid container direction={"row"} spacing={2}>
          <Grid item xs={10}>
            <Grid item>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {props.date}
              </Typography>
            </Grid>
            <Grid item>
              <Typography style={{ fontSize: 18, paddingTop: 0 }}>
                {props.reason}
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Grid item>
              <Box color={getColor(props.status)}>{props.status}</Box>
            </Grid>
            <Grid item>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {props.status == "Pending" ? (
                  <Box letterSpacing={2}>
                    {" "}
                    <IconButton
                      onClick={() => {
                        handleOpenConfirmationDialog("Decline");
                      }}
                      className={classes.button}
                    >
                      <CloseIcon
                        fontSize="medium"
                        style={{
                          color: "#EB4F47",
                        }}
                      />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleOpenConfirmationDialog("Confirm");
                      }}
                      className={classes.button}
                    >
                      <CheckIcon style={{ color: "green" }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box></Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <Dialog
        open={openConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Action Confirmation"}
        </DialogTitle>
        <Divider style={{ marginLeft: 15, marginRight: 15 }} />
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            You are about to{" "}
            <span style={{ color: status == "Confirm" ? "green" : "red" }}>
              {status}
            </span>{" "}
            selected leave request ! You can't undo this.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={updating ? undefined : handleCloseConfirmationDialog}
            color="primary"
            style={{
              cursor: updating ? "not-allowed" : "-moz-grab",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={updating ? undefined : confirmAction}
            color="primary"
            style={{
              cursor: updating ? "not-allowed" : "-moz-grab",
            }}
          >
            {updating ? (
              <ClipLoader
                loading={updating}
                size={20}
                color="ffffff"
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={props.leaveRequestMessage}
        autoHideDuration={4000}
        onClose={handleCloseLeaveRequestMessage}
      >
        <Alert onClose={handleCloseLeaveRequestMessage} severity="success">
          Successfully Update Leave Request Status!
        </Alert>
      </Snackbar>
    </Card>
  );
}
