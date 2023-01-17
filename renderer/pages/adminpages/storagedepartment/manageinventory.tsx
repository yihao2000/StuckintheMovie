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
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { ClipLoader } from "react-spinners";
import { Alert, TabPanel } from "@material-ui/lab";
import FundRequestTable from "../../additionalComponents/tables/fundrequeststable";
import Tooltip from "@material-ui/core/Tooltip";
import InventoryTable from "../../additionalComponents/tables/inventorytable";
import {
  insertInventoryPurchaseData,
  queryAllFundRequest,
  queryAllInventoryPurchase,
  querySpecificEmployee,
  querySpecificFundRequest,
} from "../../database/query";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import FundRequestDetail from "../../additionalComponents/tables/fundrequestdetailtable";
import FundRequestDetailTable from "../../additionalComponents/tables/fundrequestdetailtable";

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
  successmessage: boolean;
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
          <AntTab label="All" />
          <AntTab label="Outgoing" />
          <AntTab label="Accepted" />
          <AntTab label="Rejected" />
        </AntTabs>
        <Box style={{ height: "40px" }}></Box>
        {value == 0 && (
          <InventoryTable filter="All" successMessage={props.successmessage} />
        )}

        {/* {value == 1 && (

        )}

        {value == 2 && (

        )}

        {value == 3 && (
    
        )} */}
      </div>
    </div>
  );
}

function Inventory() {
  const [openAddInventoryDialog, setOpenAddInventoryDialog] =
    React.useState(false);

  const [availableFundRequest, setAvailableFundRequest] = React.useState([]);

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date("2022-12-21T00:00:00")
  );

  const [confirmAdd, setConfirmAdd] = React.useState(false);
  const [selectedFundRequestId, setSelectedFundRequestId] = React.useState("");
  const [selectedInventoryType, setSelectedInventoryType] = React.useState("");
  const [selectedFundRequest, setSelectedFundRequest] = React.useState(null);

  const [inventoryName, setInventoryName] = React.useState("");
  const [inventoryDescription, setInventoryDescription] = React.useState("");
  const [inventoryPrice, setInventoryPrice] = React.useState(0);
  const [inventoryQuantity, setInventoryQuantity] = React.useState(0);

  const [successMessage, setSuccessMessage] = React.useState(false);
  const [inserting, setInserting] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [openFundRequestDetailDialog, setOpenFundRequestDetailDialog] =
    React.useState(false);

  React.useEffect(() => {
    if (selectedFundRequestId != "") {
      querySpecificFundRequest(selectedFundRequestId).then((e) => {
        setSelectedFundRequest(e);
        console.log(e);
      });
    }
  }, [selectedFundRequestId]);
  const handleOpenSuccessMessage = () => {
    setSuccessMessage(true);
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(false);
  };

  const handleConfirmInserting = () => {
    setInserting(true);

    const clearFields = () => {
      setInventoryName("");
      setInventoryDescription("");
      setInventoryPrice(0);
      setInventoryQuantity(0);
      setSelectedInventoryType("");
      setSelectedFundRequestId("");
    };
    var data = {
      inventoryname: inventoryName,
      inventorydescription: inventoryDescription,
      inventoryprice: inventoryPrice,
      inventoryquantity: inventoryQuantity,
      inventorytype: selectedInventoryType,
      fundrequestid: selectedFundRequestId,
      transactiondate: selectedDate.toDateString(),
    };

    insertInventoryPurchaseData(data).then(async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(2000);

      handleOpenSuccessMessage();
      handleCancelInserting();
      handleCloseAddInventoryDialog();
      setConfirmAdd(false);
      clearFields();
      setRefresh(!refresh);
    });
  };

  const handleOpenFundRequestDetailDialog = () => {
    setOpenFundRequestDetailDialog(true);
  };

  const handleCloseFundRequestDetailDialog = () => {
    setOpenFundRequestDetailDialog(false);
  };
  const handleCancelInserting = () => {
    setInserting(true);
  };

  const handleConfirmConfirmAdd = () => {
    setConfirmAdd(true);
  };

  const handleCancelConfirmAdd = () => {
    setConfirmAdd(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInventoryName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInventoryDescription(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInventoryPrice(Number(event.target.value));
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInventoryQuantity(Number(event.target.value));
  };

  const handleSelectedInventoryTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedInventoryType(event.target.value as string);
  };

  const handleSelectedFundRequestChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedFundRequestId(event.target.value as string);
  };

  React.useEffect(() => {
    var array = [];
    var arrayFilter = [];

    queryAllFundRequest().then((requests) => {
      array = requests;
      queryAllInventoryPurchase().then((e) => {
        console.log(e);
        arrayFilter = e;

        const filteredArray = array.filter((el) => {
          return arrayFilter.every((f) => {
            return el.id !== f.fundrequestid;
          });
        });
        setAvailableFundRequest(filteredArray);
      });
    });
  }, [refresh]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleOpenAddInventoryDialog = () => {
    setOpenAddInventoryDialog(true);
  };

  const handleCloseAddInventoryDialog = () => {
    setOpenAddInventoryDialog(false);
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
            Inventories
          </Typography>
          <Box height={20}></Box>
          <Button
            onClick={handleOpenAddInventoryDialog}
            startIcon={<AddIcon />}
            style={{
              color: "white ",
              backgroundColor: "#EB4F47",
              textTransform: "none",
            }}
          >
            Add Inventory
          </Button>

          <Dialog
            maxWidth="sm"
            fullWidth
            open={openAddInventoryDialog}
            onClose={handleCloseAddInventoryDialog}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add New Inventory</DialogTitle>
            <Divider style={{ marginInline: "2%" }} />
            <DialogContent>
              <Typography variant="h6">Inventory Information</Typography>
              <TextField
                value={inventoryName}
                onChange={handleNameChange}
                disabled={confirmAdd}
                margin="dense"
                id="name"
                label="Inventory Name"
                type="text"
                fullWidth
              />
              <TextField
                value={inventoryDescription}
                onChange={handleDescriptionChange}
                disabled={confirmAdd}
                multiline
                margin="dense"
                id="description"
                label="Inventory Description"
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
                disabled={confirmAdd}
                style={{ width: "47%" }}
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={selectedInventoryType}
                onChange={handleSelectedInventoryTypeChange}
                displayEmpty
                // className={classes.selectEmpty}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value={"Equipment"}>Equipment</MenuItem>
                <MenuItem value={"Facility"}>Facility</MenuItem>
              </Select>
              <Grid container spacing={3} style={{ width: "100%" }}>
                <Grid item style={{ width: "51%" }}>
                  <TextField
                    value={inventoryPrice}
                    onChange={handlePriceChange}
                    disabled={confirmAdd}
                    margin="dense"
                    id="name"
                    label="Inventory Price per Item ($)"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item style={{ width: "49%" }}>
                  <TextField
                    value={inventoryQuantity}
                    onChange={handleQuantityChange}
                    disabled={confirmAdd}
                    margin="dense"
                    id="name"
                    label="Quantity"
                    type="number"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Typography variant="h6" style={{ marginTop: "5%" }}>
                Additional Information
              </Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disabled={confirmAdd}
                  value={selectedDate}
                  onChange={handleDateChange}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Purchase Date"
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <InputLabel
                style={{ marginTop: "8px" }}
                shrink
                id="demo-simple-select-placeholder-label-label"
              >
                Fund Request ID
              </InputLabel>

              <Box style={{ display: "flex" }}>
                <Select
                  disabled={confirmAdd}
                  style={{ width: "47%", marginBottom: "8px" }}
                  labelId="demo-simple-select-placeholder-label-label"
                  id="demo-simple-select-placeholder-label"
                  value={selectedFundRequestId}
                  onChange={handleSelectedFundRequestChange}
                  displayEmpty
                  // className={classes.selectEmpty}
                >
                  {availableFundRequest.map((e) => {
                    if (
                      e.anfstatus == "Accepted" &&
                      e.managerstatus == "Accepted"
                    ) {
                      return <MenuItem value={e.id}>{e.id}</MenuItem>;
                    }
                  })}
                </Select>
                {selectedFundRequestId != "" && (
                  <IconButton onClick={handleOpenFundRequestDetailDialog}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <DialogContentText style={{ marginTop: "20px", marginBottom: 0 }}>
                Notes: Submitted Inventory Information can't be changed
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              {confirmAdd == false && (
                <Box>
                  <Button
                    onClick={handleCloseAddInventoryDialog}
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
          {selectedFundRequest && (
            <Dialog
              maxWidth="sm"
              fullWidth
              open={openFundRequestDetailDialog}
              onClose={handleCloseFundRequestDetailDialog}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Fund Request Detail
              </DialogTitle>
              <Divider style={{ marginInline: "2%" }} />
              <DialogContent>
                <FundRequestDetailTable
                  selectedFundRequest={selectedFundRequest}
                  setSelectedFundRequest={setSelectedFundRequest}
                />
              </DialogContent>

              <DialogActions>
                <Box>
                  <Button
                    onClick={handleCloseFundRequestDetailDialog}
                    style={{ color: "#EB4F47" }}
                  >
                    Close
                  </Button>
                </Box>
              </DialogActions>
            </Dialog>
          )}

          <Snackbar
            open={successMessage}
            autoHideDuration={6000}
            onClose={handleCloseSuccessMessage}
          >
            <Alert onClose={handleCloseSuccessMessage} severity="success">
              Successfully insert Inventory!
            </Alert>
          </Snackbar>
          <Box height={40}></Box>
          <CustomizedTabs successmessage={successMessage} />
        </main>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Inventory);
