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

import { SideDrawer } from "../../additionalComponents/drawer/sidedrawer";

import Router from "next/router";
import PrimarySearchAppBar from "../../additionalComponents/appbar/customappbar";

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
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { ClipLoader } from "react-spinners";
import {
  insertEquipmentReport,
  insertFacilityReport,
  insertPersonalLeave,
  queryEmployeePersonalLeave,
  queryEquipmentReportAmount,
  queryEquipments,
  queryFacilities,
  queryFacilityAmount,
} from "../../database/query";
import { Alert, TabPanel } from "@material-ui/lab";
import PersonalLeaveCard from "../../additionalComponents/card/personalleavecard";
import {
  EquipmentReport,
  FacilityReport,
  Inventory,
} from "../../additionalComponents/interfaces/interface";
import InventoryReportTable from "../../additionalComponents/tables/inventoryreporttable";

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

interface Parameter {
  refreshComponent: Function;
  refresh: boolean;
}
export function CustomizedTabs(props: Parameter) {
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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo1}>
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="All" />
          <AntTab label="Pending" />
          <AntTab label="Reviewed" />
        </AntTabs>
        <Box style={{ height: "40px" }}></Box>
        {value == 0 && (
          <InventoryReportTable
            filter="All"
            type="Admin"
            refresh={props.refresh}
            refreshComponent={props.refreshComponent}
          />
        )}

        {value == 1 && (
          <InventoryReportTable
            filter="Pending"
            type="Admin"
            refresh={props.refresh}
            refreshComponent={props.refreshComponent}
          />
        )}

        {value == 2 && (
          <InventoryReportTable
            filter="Reviewed"
            type="Admin"
            refresh={props.refresh}
            refreshComponent={props.refreshComponent}
          />
        )}
      </div>
    </div>
  );
}

function LeaveRequest() {
  const classes = useStyles({});
  const [openRequestDialog, setOpenRequestDialog] = React.useState(false);

  const [openRequestConfirm, setOpenRequestConfirm] = React.useState(false);

  const [requesting, setRequesting] = React.useState(false);

  const [requestSuccessful, setRequestSuccessful] = React.useState(false);

  const [confirmAdd, setConfirmAdd] = React.useState(false);

  const [typeSelected, setTypeSelected] = React.useState(false);

  const [selectedInventoryType, setSelectedInventoryType] = React.useState("");

  const [selectedInventoryId, setSelectedInventoryId] = React.useState("");
  const [reportMessage, setReportMessage] = React.useState("");
  const [inventoryList, setInventoryList] = React.useState<Inventory[]>([]);

  const [refresh, setRefresh] = React.useState(false);

  const refreshComponent = () => {
    setRefresh(!refresh);
    console.log("Nge refresh");
  };

  React.useEffect(() => {
    var array = [];
    if (selectedInventoryType == "Equipment") {
      queryEquipments().then((e) => {
        e.map((x) => {
          if (x.damagestatus == "Undamaged") {
            array.push(x);
          }
        });
        setInventoryList(array);
        setTypeSelected(true);
      });
    } else if (selectedInventoryType == "Facility") {
      queryFacilities().then((e) => {
        e.map((x) => {
          if (x.damagestatus == "Undamaged") {
            array.push(x);
          }
        });
        setInventoryList(array);
        setTypeSelected(true);
      });
    } else {
      setInventoryList([]);
      setTypeSelected(false);
    }
  }, [selectedInventoryType]);
  interface Auth {
    id: string;
    firsName: string;
    lastName: string;
    department: string;
    division: string;
  }

  const setRequestingTrue = async () => {
    setRequesting(true);
    var auth = secureLocalStorage.getItem("credentials") as Auth;

    if (selectedInventoryType == "Equipment") {
      queryEquipmentReportAmount().then((e) => {
        var data: EquipmentReport = {
          id: "ER-" + e.toLocaleString().padStart(3, "0"),
          employeeid: auth.id,
          equipmentid: selectedInventoryId,
          message: reportMessage,
          status: "Pending",
          date: new Date().toDateString(),
        };

        insertEquipmentReport(data);
      });
    } else if (selectedInventoryType == "Facility") {
      queryFacilityAmount().then((e) => {
        var data: FacilityReport = {
          id: "FR-" + e.toLocaleString().padStart(3, "0"),
          employeeid: auth.id,
          facilityid: selectedInventoryId,
          message: reportMessage,
          status: "Pending",
          date: new Date().toDateString(),
        };

        insertFacilityReport(data);
      });
    }
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);
    setRequesting(false);
    setOpenRequestConfirm(false);
    setRequestSuccessful(true);
    setOpenRequestDialog(false);
    setConfirmAdd(false);

    clearFields();
    refreshComponent();
  };

  const clearFields = () => {
    setSelectedInventoryType("");
    setSelectedInventoryId("");
    setReportMessage("");
    setTypeSelected(false);
  };

  const handleSelectedInventoryTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    console.log(event.target.value);
    setSelectedInventoryType(event.target.value as string);
  };

  const handleSelectedInventoryIdChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedInventoryId(event.target.value as string);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReportMessage(event.target.value);
  };

  const handleCloseRequestSuccessful = () => {
    setRequestSuccessful(false);
  };
  const handleOpenRequestConfirm = () => {
    setOpenRequestConfirm(true);
    setConfirmAdd(true);
    setTypeSelected(false);
  };

  const handleCloseRequestConfirm = () => {
    setOpenRequestConfirm(false);
    setConfirmAdd(false);
    setTypeSelected(true);
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
        <title>Manage Inventory Report</title>
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
            Manage Inventory Report
          </Typography>
          <Box style={{ height: 30 }}></Box>
          <Button
            startIcon={<AddIcon />}
            className={classes.createButton}
            onClick={handleOpenRequestDialog}
          >
            Create New Report
          </Button>
          <Box style={{ height: 20 }}></Box>
          <CustomizedTabs
            refreshComponent={refreshComponent}
            refresh={refresh}
          ></CustomizedTabs>

          <Dialog
            maxWidth="sm"
            fullWidth
            open={openRequestDialog}
            onClose={handleCloseRequestDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Inventory Report"}
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <InputLabel
                    style={{ marginTop: "8px" }}
                    shrink
                    id="demo-simple-select-placeholder-label-label"
                  >
                    Inventory Type
                  </InputLabel>
                  <Select
                    disabled={confirmAdd}
                    style={{ width: "47%" }}
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={selectedInventoryType}
                    onChange={handleSelectedInventoryTypeChange}
                    displayEmpty
                    defaultValue="None"
                  >
                    <MenuItem id="None" value="None">
                      None
                    </MenuItem>
                    <MenuItem id="Equipment" value={"Equipment"}>
                      Equipment
                    </MenuItem>
                    <MenuItem id="Facility" value={"Facility"}>
                      Facility
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item>
                  <InputLabel
                    style={{ marginTop: "8px" }}
                    shrink
                    id="demo-simple-select-placeholder-label-label"
                  >
                    Inventory to be reported
                  </InputLabel>
                  <Select
                    disabled={!typeSelected}
                    style={{ width: "47%" }}
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={selectedInventoryId}
                    onChange={handleSelectedInventoryIdChange}
                    displayEmpty
                    defaultValue="None"
                  >
                    <MenuItem value="None">None</MenuItem>

                    {inventoryList.map((e) => {
                      return (
                        <MenuItem id={e.id} value={e.id}>
                          {e.id} - {e.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
                <TextField
                  value={reportMessage}
                  onChange={handleMessageChange}
                  disabled={!typeSelected}
                  multiline
                  margin="dense"
                  id="description"
                  label="Report Detail"
                  type="text"
                  fullWidth
                />
              </Grid>

              <Grid item style={{ marginTop: 20 }}>
                <Typography style={{ color: "gray" }}>
                  *Notes: Please make sure the inputted report detail is
                  correct!
                </Typography>
              </Grid>
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
              You have successfully inserted inventory report!
            </Alert>
          </Snackbar>
        </main>
      </div>
    </React.Fragment>
  );
}

export default withRouter(LeaveRequest);
