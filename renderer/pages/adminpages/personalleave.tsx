import React from "react";
import Head from "next/head";
import {
  Theme,
  makeStyles,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "../../components/Link";
import { withRouter } from "next/router";
import AddIcon from "@material-ui/icons/Add";
import secureLocalStorage from "react-secure-storage";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Inbox";
import MailIcon from "@material-ui/icons/Mail";
import DashboardIcon from "@material-ui/icons/Dashboard";

import { SideDrawer } from "../additionalComponents/drawer/sidedrawer";

import Router from "next/router";
import PrimarySearchAppBar from "../additionalComponents/appbar/customappbar";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { ClipLoader } from "react-spinners";
import {
  insertPersonalLeave,
  queryEmployeePersonalLeave,
} from "../database/query";
import { Alert, TabPanel } from "@material-ui/lab";
import PersonalLeaveCard from "../additionalComponents/card/personalleavecard";

const drawerWidth = 260;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      paddingTop: theme.spacing(4),
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor: "#181c20",
      paddingLeft: 20,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      background: "#111416",
    },
    drawerPaper: {
      background: "#111416",
      width: drawerWidth,
    },

    createButton: {
      color: "white ",
      backgroundColor: "#EB4F47",
      textTransform: "none",
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      width: `calc(100% - 260px)`,
      height: "100vh",
      backgroundColor: "#FFFFFF",
      padding: theme.spacing(3),
    },
    tabs: {
      "& .MuiTab-root.Mui-selected": {
        color: "#F79A1F",
      },
      "&.Mui-disabled": {
        width: 0,
      },
    },

    tab: {
      width: "50px",
    },
  })
);

const AntTabs = withStyles({
  indicator: {
    backgroundColor: "#F79A1F",
  },
})(Tabs);

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      minWidth: 72,

      marginRight: theme.spacing(4),

      "&:hover": {
        color: "#F79A1F",
        opacity: 1,
      },
      "&$selected": {
        color: "#F79A1F",
      },
      "&:focus": {
        color: "#F79A1F",
      },
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "50%",
      backgroundColor: "#635ee7",
    },
  },
})((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
));

interface StyledTabProps {
  label: string;
}

interface LeaveRequest {
  personalleaveid: string;
  employeeid: string;
  personalleavedate: string;
  personalleavereason: string;
  status: string;
}

interface Data {
  allrequest: Array<LeaveRequest>;
}
export function CustomizedTabs(props: Data) {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      flexGrow: 1,
    },
    padding: {
      padding: theme.spacing(3),
    },
    demo1: {
      backgroundColor: "transparent",
    },
    demo2: {
      backgroundColor: "#2e1534",
    },
  }));

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const [pendingRequest, setPendingRequest] = React.useState([]);
  const [acceptedRequest, setAcceptedRequest] = React.useState([]);
  const [rejectedRequest, setRejectedRequest] = React.useState([]);

  React.useEffect(() => {
    filterPendingRequest();
    filterAcceptedRequest();
    filterRejectedRequest();
  }, [props.allrequest]);

  const filterRejectedRequest = () => {
    var array = props.allrequest.filter((e) => {
      return e.status == "Rejected";
    });

    setRejectedRequest(array);
  };

  const filterPendingRequest = () => {
    var array = props.allrequest.filter((e) => {
      return e.status == "Pending";
    });

    setPendingRequest(array);
  };

  const filterAcceptedRequest = () => {
    var array = props.allrequest.filter((e) => {
      return e.status == "Accepted";
    });

    setAcceptedRequest(array);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo1}>
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="All" />
          <AntTab label="Outgoing" />
          <AntTab label="Accepted" />
          <AntTab label="Rejected" />
        </AntTabs>

        <TableContainer style={{ overflow: "auto" }}>
          <Table style={{ width: "50%" }} aria-label="simple table">
            <TableBody>
              {value == 0 &&
                props.allrequest.map((e) => {
                  return (
                    <TableRow style={{}}>
                      <TableCell style={{ padding: 0 }}>
                        <PersonalLeaveCard
                          date={e.personalleavedate}
                          reason={e.personalleavereason}
                          status={e.status}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

              {value == 1 &&
                pendingRequest.map((e) => {
                  return (
                    <TableRow style={{}}>
                      <TableCell style={{ padding: 0 }}>
                        <PersonalLeaveCard
                          date={e.personalleavedate}
                          reason={e.personalleavereason}
                          status={e.status}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

              {value == 2 &&
                acceptedRequest.map((e) => {
                  return (
                    <TableRow style={{}}>
                      <TableCell style={{ padding: 0 }}>
                        <PersonalLeaveCard
                          date={e.personalleavedate}
                          reason={e.personalleavereason}
                          status={e.status}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

              {value == 3 &&
                rejectedRequest.map((e) => {
                  return (
                    <TableRow style={{}}>
                      <TableCell style={{ padding: 0 }}>
                        <PersonalLeaveCard
                          date={e.personalleavedate}
                          reason={e.personalleavereason}
                          status={e.status}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

function LeaveRequest() {
  const classes = useStyles({});
  const [openRequestDialog, setOpenRequestDialog] = React.useState(false);

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date("2014-08-18T21:11:54")
  );

  const [leaveReason, setLeaveReason] = React.useState("");

  const [openRequestConfirm, setOpenRequestConfirm] = React.useState(false);

  const [requesting, setRequesting] = React.useState(false);

  const [requestSuccessful, setRequestSuccessful] = React.useState(false);

  const [requestExist, setRequestExist] = React.useState(false);

  const [allLeaveRequest, setAllLeaveRequest] = React.useState([]);

  interface Auth {
    id: string;
    firsName: string;
    lastName: string;
    department: string;
    division: string;
  }

  var auth = secureLocalStorage.getItem("credentials") as Auth;
  React.useEffect(() => {
    var array = [];
    queryEmployeePersonalLeave(auth.id).then((e) => {
      e.map((item) => {
        array.push(item);
      });
      setAllLeaveRequest(array);
    });
  }, [requestSuccessful]);

  const handleCloseRequestExist = () => {
    setRequestExist(false);
  };

  const setRequestingTrue = () => {
    setRequesting(true);

    insertPersonalLeave(leaveReason, selectedDate).then(async (e) => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(2000);
      setRequesting(false);
      setOpenRequestConfirm(false);
      if (e) {
        setRequestExist(true);
      } else {
        setRequestSuccessful(true);
        setOpenRequestDialog(false);
      }
    });
  };

  const handleCloseRequestSuccessful = () => {
    setRequestSuccessful(false);
  };
  const handleOpenRequestConfirm = () => {
    setOpenRequestConfirm(true);
  };

  const handleCloseRequestConfirm = () => {
    setOpenRequestConfirm(false);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleOpenRequestDialog = () => {
    setOpenRequestDialog(true);
  };

  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
  };
  return (
    <React.Fragment>
      <Head>
        <title>Leave Request</title>
      </Head>
      <div className={classes.root}>
        <CssBaseline />
        <PrimarySearchAppBar />
        <SideDrawer />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", marginLeft: "20" }}
          >
            Leave Request
          </Typography>
          <Box style={{ height: 30 }}></Box>
          <Button
            startIcon={<AddIcon />}
            className={classes.createButton}
            onClick={handleOpenRequestDialog}
          >
            Create Leave Request
          </Button>

          <CustomizedTabs allrequest={allLeaveRequest}></CustomizedTabs>

          <Dialog
            maxWidth="sm"
            fullWidth
            open={openRequestDialog}
            onClose={handleCloseRequestDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Leave Request"}</DialogTitle>
            <DialogContent>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disabled={openRequestConfirm}
                      value={selectedDate}
                      onChange={handleDateChange}
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Leave Date"
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item>
                  <TextField
                    onChange={(e) => setLeaveReason(e.target.value)}
                    disabled={openRequestConfirm}
                    id="standard-multiline-flexible"
                    label="Request Reason"
                    multiline
                    maxRows={6}
                    style={{
                      width: "100%",
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item style={{ marginTop: 20 }}>
                <Typography style={{ color: "gray" }}>
                  *Notes: Submitted personal leave request can't be{" "}
                  <span style={{ color: "red" }}>cancelled</span>
                </Typography>
              </Grid>

              <Snackbar
                open={requestExist}
                autoHideDuration={4000}
                onClose={handleCloseRequestExist}
              >
                <Alert onClose={handleCloseRequestExist} severity="error">
                  You already have a leave request at specified date!
                </Alert>
              </Snackbar>
            </DialogContent>
            <DialogActions>
              {!openRequestConfirm && (
                <Box
                  display="flex"
                  flexDirection="row"
                  gridGap={5}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={handleCloseRequestDialog}
                    style={{
                      color: "red",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{
                      color: "green",
                    }}
                    onClick={handleOpenRequestConfirm}
                  >
                    Confirm
                  </Button>
                </Box>
              )}

              {openRequestConfirm && (
                <Box
                  display="flex"
                  flexDirection="row"
                  gridGap={5}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography style={{ color: "red" }}>
                    <strong>Are you sure?</strong>
                  </Typography>

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
                    onClick={requesting ? undefined : handleCloseRequestConfirm}
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
              You have successfully inserted personal leave request!
            </Alert>
          </Snackbar>
        </main>
      </div>
    </React.Fragment>
  );
}

export default withRouter(LeaveRequest);
