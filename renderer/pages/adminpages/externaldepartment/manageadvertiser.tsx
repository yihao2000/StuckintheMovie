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
} from "@material-ui/pickers";
import { ClipLoader } from "react-spinners";
import { Alert, TabPanel } from "@material-ui/lab";
import FundRequestTable from "../../additionalComponents/tables/fundrequeststable";
import Tooltip from "@material-ui/core/Tooltip";
import InventoryTable from "../../additionalComponents/tables/inventorytable";
import {
  insertAdvertiser,
  insertInventoryPurchaseData,
  insertProducer,
  insertSupplier,
  queryAdvertiserAmount,
  queryAllFundRequest,
  queryAllInventoryPurchase,
  queryProducerAmount,
  queryProducers,
  querySupplierAmount,
} from "../../database/query";
import {
  Advertiser,
  Producer,
  Supplier,
} from "../../additionalComponents/interfaces/interface";
import ProducerTable from "../../additionalComponents/tables/producertable";
import { seedAgeRatings, seedMovieGenres } from "../../seeder/seeder";
import SupplierTable from "../../additionalComponents/tables/suppliertable";
import AdvertiserTable from "../../additionalComponents/tables/externaldepartmenttables/advertisertable";

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
  refreshComponent: Function;
  refresh: boolean;
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
        </AntTabs>

        {value == 0 && (
          <AdvertiserTable
            refreshComponent={props.refreshComponent}
            refresh={props.refresh}
          />
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

function ManageAdvertiser() {
  const [openAddInventoryDialog, setOpenAddInventoryDialog] =
    React.useState(false);

  const [confirmAdd, setConfirmAdd] = React.useState(false);

  const [advertiserName, setadvertiserName] = React.useState("");
  const [advertiserDescription, setadvertiserDescription] = React.useState("");
  const [advertiserEmail, setadvertiserEmail] = React.useState("");
  const [advertiserPhone, setadvertiserPhone] = React.useState("");
  const [advertiserAddress, setadvertiserAddress] = React.useState("");

  const [refresh, setRefresh] = React.useState(false);

  const [successMessage, setSuccessMessage] = React.useState(false);
  const [inserting, setInserting] = React.useState(false);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  const handleOpenSuccessMessage = () => {
    setSuccessMessage(true);
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(false);
  };

  const clearFields = () => {
    setadvertiserName("");
    setadvertiserAddress("");
    setadvertiserEmail("");
    setadvertiserPhone("");
    setadvertiserDescription("");
  };

  const handleConfirmInserting = () => {
    setInserting(true);

    queryAdvertiserAmount().then((e) => {
      var data: Advertiser = {
        id: "AP-" + e.toLocaleString().padStart(3, "0"),
        name: advertiserName,
        description: advertiserDescription,
        email: advertiserEmail,
        address: advertiserAddress,
        phone: advertiserPhone,
      };

      insertAdvertiser(data).then(async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(2000);

        handleOpenSuccessMessage();
        handleCancelInserting();
        handleCloseAddInventoryDialog();
        setConfirmAdd(false);
        handleCancelConfirmAdd();
        handleCancelInserting();
        clearFields();

        refreshComponent();
      });
    });
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

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setadvertiserDescription(event.target.value);
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setadvertiserName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setadvertiserEmail(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setadvertiserAddress(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setadvertiserPhone(event.target.value);
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
        <title>Manage Advertiser</title>
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
            Advertiser
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
            Add Advertiser
          </Button>
          <Dialog
            maxWidth="sm"
            fullWidth
            open={openAddInventoryDialog}
            onClose={handleCloseAddInventoryDialog}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add New Advertiser</DialogTitle>
            <Divider style={{ marginInline: "2%" }} />
            <DialogContent>
              <Typography variant="h6">General Information</Typography>
              <TextField
                value={advertiserName}
                onChange={handleNameChange}
                disabled={confirmAdd}
                margin="dense"
                id="name"
                label="Advertiser Name"
                type="text"
                fullWidth
              />
              <TextField
                value={advertiserDescription}
                onChange={handleDescriptionChange}
                disabled={confirmAdd}
                margin="dense"
                id="name"
                label="Advertiser Description"
                type="text"
                fullWidth
              />
              <Box style={{ height: 30 }} />
              <Typography variant="h6">Contact Information</Typography>
              <TextField
                value={advertiserEmail}
                onChange={handleEmailChange}
                disabled={confirmAdd}
                multiline
                margin="dense"
                id="description"
                label="Advertiser Email"
                type="text"
                fullWidth
              />

              <TextField
                value={advertiserPhone}
                onChange={handlePhoneChange}
                disabled={confirmAdd}
                margin="dense"
                id="name"
                label="Advertiser Phone"
                type="text"
                fullWidth
              />

              <TextField
                value={advertiserAddress}
                onChange={handleAddressChange}
                disabled={confirmAdd}
                margin="dense"
                id="name"
                label="Advertiser Address"
                type="text"
                fullWidth
              />

              <DialogContentText style={{ marginTop: "20px", marginBottom: 0 }}>
                Notes: Submitted Advertiser Detail will be recorded as the
                company advertiser !
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
          <Snackbar
            open={successMessage}
            autoHideDuration={6000}
            onClose={handleCloseSuccessMessage}
          >
            <Alert onClose={handleCloseSuccessMessage} severity="success">
              Successfully insert Advertiser!
            </Alert>
          </Snackbar>
          <Box height={20}></Box>
          <CustomizedTabs
            refresh={refresh}
            refreshComponent={refreshComponent}
          />
        </main>
      </div>
    </React.Fragment>
  );
}

export default withRouter(ManageAdvertiser);
