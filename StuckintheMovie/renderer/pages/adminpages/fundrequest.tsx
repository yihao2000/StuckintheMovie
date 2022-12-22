import React from "react";
import Head from "next/head";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import { SideDrawer } from "../additionalComponents/drawer/sidedrawer";
import PrimarySearchAppBar from "../additionalComponents/appbar/customappbar";

import {
  AppBar,
  Box,
  CssBaseline,
  Grid,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
} from "@material-ui/core";
import ClipLoader from "react-spinners/ClipLoader";
import { insertFundRequest, queryEmployeeFundRequest } from "../database/query";
import { Alert } from "@material-ui/lab";
import FundRequestCard from "../additionalComponents/card/fundrequestcard";
import secureLocalStorage from "react-secure-storage";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@global": {
      "*::-webkit-scrollbar": {
        width: "0.1em",
      },
      "*::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0,0,0,.1)",
        outline: "1px solid slategrey",
      },
    },
    root: {
      display: "flex",
      paddingTop: theme.spacing(4),
    },
    toolbar: theme.mixins.toolbar,
    content: {
      backgroundColor: "#FFFFFF",
      padding: theme.spacing(3),
      minHeight: "100vh",
      width: `calc(100% - 260px)`,
    },
    createButton: {
      backgroundColor: "#EB4F47",
    },
    grid: {
      minWidth: "33%",
    },
  })
);
function FundRequest() {
  const classes = useStyles({});

  const [openRequestDialog, setOpenRequestDialog] = React.useState(false);
  const [openRequestConfirmation, setOpenRequestConfirmation] =
    React.useState(false);

  const [requesting, setRequesting] = React.useState(false);

  const [requestAmount, setRequestAmount] = React.useState(0);
  const [requestReason, setRequestReason] = React.useState("");

  const [requestSuccessful, setRequestSuccessful] = React.useState(false);

  const [allRequest, setAllRequest] = React.useState([]);
  const [pendingRequest, setPendingRequest] = React.useState([]);
  const [rejectedRequest, setRejectedRequest] = React.useState([]);
  const [acceptedRequest, setAcceptedRequest] = React.useState([]);

  interface Auth {
    id: string;
    firsName: string;
    lastName: string;
    department: string;
    division: string;
  }
  var auth = secureLocalStorage.getItem("credentials") as Auth;
  React.useEffect(() => {
    var tempArr = [];
    queryEmployeeFundRequest(auth.id).then((e) => {
      e.map((e) => {
        tempArr.push(e);
      });
      setAllRequest(tempArr);
    });
  }, [requestSuccessful]);

  React.useEffect(() => {
    var pendingRequest = allRequest.filter((e) => {
      return e.managerstatus === "Pending" || e.anfstatus === "Pending";
    });
    setPendingRequest(pendingRequest);
    console.log(pendingRequest);
  }, [allRequest]);

  React.useEffect(() => {
    var acceptedRequest = allRequest.filter((e) => {
      return e.managerstatus === "Accepted" && e.anfstatus === "Accepted";
    });
    setAcceptedRequest(acceptedRequest);
    console.log(acceptedRequest);
  }, []);

  React.useEffect(() => {
    var rejectedRequest = allRequest.filter((e) => {
      return e.managerstatus === "Rejected" || e.anfstatus === "Rejected";
    });
    setRejectedRequest(rejectedRequest);
  }, []);

  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setReady(true);
  }, []);

  const handleOpenRequestSuccessful = () => {
    setRequestSuccessful(true);
  };

  const handleCloseRequestSuccessful = () => {
    setRequestSuccessful(false);
  };

  const setRequestingTrue = async () => {
    insertFundRequest(requestAmount, requestReason);
    setRequesting(true);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);

    setRequestingFalse();
    handleCloseRequestDialog();

    handleOpenRequestSuccessful();
  };

  const setRequestingFalse = () => {
    setRequesting(false);
  };

  const handleOpenRequestConfirmation = () => {
    setOpenRequestConfirmation(true);
  };

  const handleCloseOpenRequestConfirmation = () => {
    setOpenRequestConfirmation(false);
  };
  const handleOpenRequestDialog = () => {
    setOpenRequestDialog(true);
  };

  const handleCloseRequestDialog = () => {
    setOpenRequestConfirmation(false);
    setRequestAmount(0);
    setRequestReason("");
    setOpenRequestDialog(false);
  };

  return (
    ready && (
      <React.Fragment>
        <Head>
          <title>Next - Nextron (with-typescript-material-ui)</title>
        </Head>
        <div className={classes.root}>
          <CssBaseline />
          <PrimarySearchAppBar />
          <SideDrawer />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Button
              startIcon={<AddIcon />}
              style={{
                textTransform: "none",
                color: "white",
                backgroundColor: "#EB4F47",
              }}
              onClick={handleOpenRequestDialog}
              className={classes.createButton}
            >
              Create Fund Request
            </Button>

            <Grid container style={{ marginTop: 50 }} spacing={1}>
              <Grid
                item
                zeroMinWidth
                className={classes.grid}
                xs={4}
                sm={4}
                md={4}
                lg={4}
                xl={4}
              >
                <TableContainer style={{ maxHeight: "80vh", overflow: "auto" }}>
                  <Paper style={{ backgroundColor: "transparent" }}>
                    <Table style={{ width: "100%" }} aria-label="simple table">
                      <TableHead style={{ backgroundColor: "#3a6c92" }}>
                        <TableRow>
                          <TableCell>
                            <Typography style={{ color: "white" }}>
                              Pending
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingRequest.length != 0 &&
                          pendingRequest.map((e) => {
                            return (
                              <TableRow>
                                <TableCell
                                  style={{ borderBottom: "none", padding: 0 }}
                                >
                                  <FundRequestCard
                                    color="#264862"
                                    reason={e.reason}
                                    amount={e.amount}
                                    date={e.date}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {pendingRequest.length == 0 && (
                          <Typography></Typography>
                        )}
                      </TableBody>
                    </Table>
                  </Paper>
                </TableContainer>
              </Grid>
              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                lg={4}
                xl={4}
                className={classes.grid}
                zeroMinWidth
              >
                <TableContainer>
                  <Paper style={{ backgroundColor: "transparent" }}>
                    <Table style={{ width: "100%" }} aria-label="simple table">
                      <TableHead style={{ backgroundColor: "green" }}>
                        <TableRow>
                          <TableCell>
                            {" "}
                            <Typography style={{ color: "white" }}>
                              Accepted
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {acceptedRequest.length != 0 &&
                          acceptedRequest.map((e) => {
                            return (
                              <TableRow>
                                <TableCell
                                  style={{ borderBottom: "none", padding: 0 }}
                                >
                                  <FundRequestCard
                                    color="#32711f"
                                    reason={e.reason}
                                    amount={e.amount}
                                    date={e.date}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {acceptedRequest.length == 0 && (
                          <Typography></Typography>
                        )}
                      </TableBody>
                    </Table>
                  </Paper>
                </TableContainer>
              </Grid>
              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                lg={4}
                xl={4}
                className={classes.grid}
                zeroMinWidth
              >
                <TableContainer>
                  <Paper style={{ backgroundColor: "transparent" }}>
                    <Table style={{ width: "100%" }} aria-label="simple table">
                      <TableHead style={{ backgroundColor: "red" }}>
                        <TableRow>
                          <TableCell>
                            {" "}
                            <Typography style={{ color: "white" }}>
                              Rejected
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rejectedRequest.length != 0 &&
                          rejectedRequest.map((e) => {
                            return (
                              <TableRow>
                                <TableCell
                                  style={{ borderBottom: "none", padding: 0 }}
                                >
                                  <FundRequestCard
                                    color="#de080c"
                                    reason={e.reason}
                                    amount={e.amount}
                                    date={e.date}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {rejectedRequest.length == 0 && (
                          <Typography></Typography>
                        )}
                      </TableBody>
                    </Table>
                  </Paper>
                </TableContainer>
              </Grid>
            </Grid>
            <Box style={{ minWidth: "100%" }}></Box>

            <Dialog
              open={openRequestDialog}
              onClose={handleCloseRequestDialog}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Fund Request</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please provide information detail for the Requested Fund
                </DialogContentText>

                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Requested Fund ($)"
                      type="number"
                      fullWidth
                      onChange={(e) =>
                        setRequestAmount(parseInt(e.target.value))
                      }
                      value={requestAmount}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      id="standard-multiline-flexible"
                      label="Request Reason"
                      multiline
                      maxRows={6}
                      style={{
                        width: "100%",
                      }}
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                {!openRequestConfirmation && (
                  <Box>
                    <Button
                      onClick={handleCloseRequestDialog}
                      style={{ color: "#EB4F47" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ color: "green" }}
                      onClick={handleOpenRequestConfirmation}
                    >
                      Confirm
                    </Button>
                  </Box>
                )}

                {openRequestConfirmation && (
                  <Box
                    display="flex"
                    flexDirection="row"
                    gridGap={5}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography>Are you sure?</Typography>

                    <Button
                      onClick={requesting ? undefined : setRequestingTrue}
                      style={{
                        color: "green",

                        cursor: requesting ? "not-allowed" : "-moz-grab",
                      }}
                    >
                      {requesting ? (
                        <ClipLoader
                          loading={requesting}
                          size={20}
                          color="ffffff"
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      ) : (
                        "Yes"
                      )}
                    </Button>

                    <Button
                      onClick={
                        requesting
                          ? undefined
                          : handleCloseOpenRequestConfirmation
                      }
                      style={{
                        color: "red",
                        cursor: requesting ? "not-allowed" : "-moz-grab",
                      }}
                    >
                      No
                    </Button>
                  </Box>
                )}
              </DialogActions>
            </Dialog>

            <Snackbar
              open={requestSuccessful}
              autoHideDuration={4000}
              onClose={handleCloseRequestSuccessful}
            >
              <Alert onClose={handleCloseRequestSuccessful} severity="success">
                Successfully submitted fund request!
              </Alert>
            </Snackbar>
          </main>
        </div>
      </React.Fragment>
    )
  );
}
export default FundRequest;
