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
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { ClipLoader } from "react-spinners";
import { Alert, TabPanel } from "@material-ui/lab";
import FundRequestTable from "../../additionalComponents/tables/fundrequeststable";
import Tooltip from "@material-ui/core/Tooltip";
import InventoryTable from "../../additionalComponents/tables/inventorytable";
import {
  insertEvent,
  insertInventoryPurchaseData,
  insertPromotion,
  queryAllFundRequest,
  queryEventAmount,
  queryPromotionAmount,
  queryPromotionEvents,
} from "../../database/query";
import MemberTable from "../../additionalComponents/tables/membertable";
import PromotionEventTable from "../../additionalComponents/tables/promotioneventtable";
import { PromotionEvent } from "../../additionalComponents/interfaces/interface";

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
      backgroundColor: "#EB4F47",
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

interface Data {
  promotionevent: PromotionEvent[];
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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo1}>
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="Promotion & Event" />
          <AntTab label="Members" />
          <AntTab label="Accepted" />
          <AntTab label="Rejected" />
        </AntTabs>

        {value == 0 && (
          <PromotionEventTable promotionevent={props.promotionevent} />
        )}

        {value == 1 && <MemberTable />}

        {/* {value == 2 && (

        )}

        {value == 3 && (
    
        )} */}
      </div>
    </div>
  );
}

interface Parameter {
  setPromoEventName: Function;
  setPromoEventDescription: Function;
  setPromoEventReleaseDate: Function;
  setPromoEventEndDate: Function;
  setPromoEventType: Function;

  promoEventReleaseDate: Date;
  promoEventEndDate: Date;

  confirmAdd: boolean;
  setConfirmAdd: Function;
}

export function AddTabs(props: Parameter) {
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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [value, setValue] = React.useState(0);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setPromoEventName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.setPromoEventDescription(event.target.value);
  };

  const handleReleaseDateChange = (date: Date | null) => {
    props.setPromoEventReleaseDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    props.setPromoEventEndDate(date);
  };

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    props.setPromoEventType(event.target.value as string);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo1}>
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="Event / Promotion" />
          <AntTab label="Voucher" />
        </AntTabs>

        {value == 0 && (
          <Box>
            <Box style={{ height: 5 }} />

            <TextField
              // value={inventoryName}
              onChange={handleNameChange}
              disabled={props.confirmAdd}
              margin="dense"
              id="name"
              label="Event / Promotion Name"
              type="text"
              fullWidth
            />
            <TextField
              // value={inventoryDescription}
              onChange={handleDescriptionChange}
              disabled={props.confirmAdd}
              multiline
              margin="dense"
              id="description"
              label="Event / Promotion Description"
              type="text"
              fullWidth
            />
            <InputLabel
              style={{ marginTop: "8px" }}
              shrink
              id="demo-simple-select-placeholder-label-label"
            >
              Type
            </InputLabel>
            <Select
              disabled={props.confirmAdd}
              style={{ width: "45%" }}
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              // value={selectedInventoryType}
              onChange={handleTypeChange}
              displayEmpty
              // className={classes.selectEmpty}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value={"Promotion"}>Promotion</MenuItem>
              <MenuItem value={"Event"}>Event</MenuItem>
            </Select>
            <Grid container spacing={3} style={{ width: "100%" }}>
              <Grid item style={{ width: "50%" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    disabled={props.confirmAdd}
                    value={props.promoEventReleaseDate}
                    onChange={handleReleaseDateChange}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Start Date"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item style={{ width: "50%" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    disabled={props.confirmAdd}
                    value={props.promoEventEndDate}
                    onChange={handleEndDateChange}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="End Date"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Box style={{ height: 10, paddingBottom: 0 }} />
            <Typography style={{ color: "gray" }}>
              Notes: You are going to add new Promotion / Event for the member !
            </Typography>
          </Box>
        )}

        {value == 1 && <MemberTable />}

        {/* {value == 2 && (

        )}

        {value == 3 && (
    
        )} */}
      </div>
    </div>
  );
}

function ManagePromotionEvent() {
  const [openAddPromoEventDialog, setOpenAddPromoEventDialog] =
    React.useState(false);

  const [confirmAdd, setConfirmAdd] = React.useState(false);
  const [selectedFundRequestId, setSelectedFundRequestId] = React.useState("");
  const [selectedInventoryType, setSelectedInventoryType] = React.useState("");

  const [promoEventName, setPromoEventName] = React.useState("");
  const [promoEventDescription, setPromoEventDescription] = React.useState("");
  const [promoEventReleaseDate, setPromoEventReleaseDate] =
    React.useState<Date | null>(new Date("2022-12-21T00:00:00"));
  const [promoEventEndDate, setPromoEventEndDate] = React.useState<Date | null>(
    new Date("2022-12-21T00:00:00")
  );

  const [promoEventType, setPromoEventType] = React.useState("");

  const [successMessage, setSuccessMessage] = React.useState(false);
  const [inserting, setInserting] = React.useState(false);

  const [promotionEvent, setPromotionEvent] = React.useState([]);

  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {
    queryPromotionEvents().then((e) => {
      setPromotionEvent(e);
    });
  }, [refresh]);
  const handleOpenSuccessMessage = () => {
    setSuccessMessage(true);
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(false);
  };

  const refreshComponent = () => {
    setRefresh(!refresh);
  };
  const clearFields = () => {
    setPromoEventName("");
    setPromoEventDescription("");
    setPromoEventReleaseDate(new Date("2022-12-21T00:00:00"));
    setPromoEventEndDate(new Date("2022-12-21T00:00:00"));
    setSelectedInventoryType("");
    setSelectedFundRequestId("");
    setPromoEventType("");
  };

  const handleConfirmInserting = async () => {
    setInserting(true);

    var data: PromotionEvent = {
      id: "",
      name: promoEventName,
      type: promoEventType,
      description: promoEventDescription,
      releasedate: promoEventReleaseDate.toDateString(),
      enddate: promoEventEndDate.toDateString(),
    };

    if (promoEventType == "Promotion") {
      queryPromotionAmount().then((e) => {
        data.id = "PR-" + e.toLocaleString().padStart(3, "0");

        insertPromotion(data);
      });
    } else if (promoEventType == "Event") {
      queryEventAmount().then((e) => {
        data.id = "EV-" + e.toLocaleString().padStart(3, "0");

        insertEvent(data);
      });
    }
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);

    setConfirmAdd(false);

    handleCloseAddPromoEventDialog();
    handleCancelInserting();

    handleOpenSuccessMessage();
    clearFields();

    refreshComponent();
    // insertInventoryPurchaseData(data).then(async () => {
    //   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    //   await delay(2000);

    //   handleCancelInserting();
    //   handleCloseAddPromoEventDialog();

    //   setConfirmAdd(false);
    //   clearFields();
    // });
  };
  const handleCancelInserting = () => {
    setInserting(true);
  };

  const handleConfirmConfirmAdd = () => {
    setConfirmAdd(true);

    console.log(promoEventName);
    console.log(promoEventDescription);
    console.log(promoEventType);
  };

  const handleCancelConfirmAdd = () => {
    setConfirmAdd(false);
  };

  // React.useEffect(() => {
  //   var array = [];
  //   var arrayFilter = [];

  //   queryAllFundRequest().then((requests) => {
  //     array = requests;
  //     queryAllInventoryPurchase().then((e) => {
  //       arrayFilter = e;

  //       const filteredArray = array.filter((el) => {
  //         return arrayFilter.every((f) => {
  //           return el.id !== f.fundrequestid;
  //         });
  //       });
  //       setAvailableFundRequest(filteredArray);
  //     });
  //   });
  // }, []);

  const handleOpenAddPromoEventDialog = () => {
    setOpenAddPromoEventDialog(true);
  };

  const handleCloseAddPromoEventDialog = () => {
    setOpenAddPromoEventDialog(false);
  };

  const classes = useStyles({});

  return (
    <React.Fragment>
      <Head>
        <title>Manage Inventory</title>
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
            Manage Events & Promotion
          </Typography>
          <Box height={20}></Box>
          <Button
            onClick={handleOpenAddPromoEventDialog}
            startIcon={<AddIcon />}
            style={{
              color: "white ",
              backgroundColor: "#EB4F47",
              textTransform: "none",
            }}
          >
            Add New Event / Promotion
          </Button>
          <Dialog
            maxWidth="sm"
            fullWidth
            open={openAddPromoEventDialog}
            onClose={handleCloseAddPromoEventDialog}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Add New Event / Promotion
            </DialogTitle>
            <Divider style={{ marginInline: "2%" }} />
            <DialogContent>
              <AddTabs
                setPromoEventName={setPromoEventName}
                setPromoEventDescription={setPromoEventDescription}
                setPromoEventReleaseDate={setPromoEventReleaseDate}
                setPromoEventEndDate={setPromoEventEndDate}
                setPromoEventType={setPromoEventType}
                promoEventReleaseDate={promoEventReleaseDate}
                promoEventEndDate={promoEventEndDate}
                confirmAdd={confirmAdd}
                setConfirmAdd={setConfirmAdd}
              />
            </DialogContent>

            <DialogActions>
              {confirmAdd == false && (
                <Box>
                  <Button
                    onClick={handleCloseAddPromoEventDialog}
                    style={{ color: "#EB4F47" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ color: "green" }}
                    onClick={handleConfirmConfirmAdd}
                  >
                    Submit
                  </Button>
                </Box>
              )}

              {confirmAdd == true && (
                <Box
                  display="flex"
                  flexDirection="row"
                  gridGap={5}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="primary">Are you sure ?</Typography>
                  <Button
                    onClick={inserting ? undefined : handleConfirmInserting}
                    style={{
                      color: "green",
                      cursor: inserting ? "not-allowed" : "-moz-grab",
                    }}
                  >
                    {inserting ? (
                      <ClipLoader
                        loading={inserting}
                        size={20}
                        // style={{ color: "greenyellow" }}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    ) : (
                      "Yes"
                    )}
                  </Button>
                  <Button
                    style={{
                      color: "#EB4F47",
                      cursor: inserting ? "not-allowed" : "-moz-grab",
                    }}
                    onClick={inserting ? undefined : handleCancelConfirmAdd}
                  >
                    No
                  </Button>
                </Box>
              )}
            </DialogActions>
          </Dialog>
          <Snackbar
            open={successMessage}
            autoHideDuration={6000}
            onClose={handleCloseSuccessMessage}
          >
            <Alert onClose={handleCloseSuccessMessage} severity="success">
              Successfully insert selected Promo/Event!
            </Alert>
          </Snackbar>
          <Box height={20}></Box>
          <CustomizedTabs promotionevent={promotionEvent} />
        </main>
      </div>
    </React.Fragment>
  );
}

export default withRouter(ManagePromotionEvent);
