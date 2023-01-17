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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  setRef,
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
  insertAdvertisement,
  insertInventoryPurchaseData,
  insertMovie,
  queryAllFundRequest,
  queryAllInventoryPurchase,
  queryProducerMovies,
} from "../../database/query";
import {
  Advertisement,
  Advertiser,
  Movie,
  Producer,
} from "../interfaces/interface";
import ProducerMoviesTable from "../tables/producermoviestable";
import { DataManager } from "../manager/DataManager";
import {
  generateAdvertisementId,
  generateMovieId,
} from "../../utils/generator";
import AdvertiserAdvertisementTable from "../tables/externaldepartmenttables/advertiseradvertisementtable";

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

interface Parameter {
  selectedAdvertiser: Advertiser;
}

export function AdvertiserTab(props: Parameter) {
  const [openAddInventoryDialog, setOpenAddInventoryDialog] =
    React.useState(false);

  const [confirmAdd, setConfirmAdd] = React.useState(false);

  const [advertisementName, setadvertisementName] = React.useState("");
  const [advertisementDescription, setadvertisementDescription] =
    React.useState("");
  const [advertisementDuration, setadvertisementDuration] = React.useState(0);
  const [advertisementAgeRating, setadvertisementAgeRating] =
    React.useState("");
  const [advertisementStartDate, setadvertisementStartDate] =
    React.useState<Date | null>(new Date("2022-12-21T00:00:00"));

  const [advertisementEndDate, setadvertisementEndDate] =
    React.useState<Date | null>(new Date("2022-12-21T00:00:00"));

  const [successMessage, setSuccessMessage] = React.useState(false);
  const [inserting, setInserting] = React.useState(false);

  const [refresh, setRefresh] = React.useState(false);

  const [ageRatingList, setAgeRagingList] = React.useState([]);

  React.useEffect(() => {
    var manager = DataManager.getInstance();

    manager.getAgeRatingList().then((e) => {
      setAgeRagingList(e);
    });
  }, []);

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
    setadvertisementName("");
    setadvertisementDescription("");
    setadvertisementDuration(0);

    setadvertisementAgeRating("");
    setadvertisementStartDate(new Date("2022-12-21T00:00:00"));
    setadvertisementEndDate(new Date("2022-12-21T00:00:00"));
  };

  const handleConfirmInserting = () => {
    setInserting(true);

    generateAdvertisementId().then((e) => {
      var data: Advertisement = {
        id: e,
        name: advertisementName,
        description: advertisementDescription,
        duration: advertisementDuration,
        advertiserid: props.selectedAdvertiser.id,
        ageratingid: advertisementAgeRating,
        startdate: advertisementStartDate.toDateString(),
        enddate: advertisementEndDate.toDateString(),
      };

      insertAdvertisement(data).then(async (e) => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(2000);

        handleOpenSuccessMessage();
        handleCancelInserting();
        handleCloseAddInventoryDialog();
        setConfirmAdd(false);
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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setadvertisementName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setadvertisementDescription(event.target.value);
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setadvertisementDuration(Number(event.target.value));
  };

  const handleAgeRatingChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setadvertisementAgeRating(event.target.value as string);
  };

  const handleStartDateChange = (date: Date | null) => {
    setadvertisementStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setadvertisementEndDate(date);
  };

  const handleOpenAddInventoryDialog = () => {
    setOpenAddInventoryDialog(true);
  };

  const handleCloseAddInventoryDialog = () => {
    setOpenAddInventoryDialog(false);
  };
  const classes = useStyles({});

  return (
    <Box>
      <Box style={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <Tooltip title={"Add Advertisement"}>
          <IconButton
            onClick={handleOpenAddInventoryDialog}
            style={{
              color: "#EB4F47",
              // backgroundColor: "#EB4F47",
              textTransform: "none",
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <AdvertiserAdvertisementTable
        refreshComponent={refreshComponent}
        refresh={refresh}
        advertiserDetail={props.selectedAdvertiser}
      />

      <Dialog
        maxWidth="sm"
        fullWidth
        open={openAddInventoryDialog}
        onClose={handleCloseAddInventoryDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Advertisement</DialogTitle>
        <Divider style={{ marginInline: "2%" }} />
        <DialogContent>
          <Typography variant="h6">Advertisement Information</Typography>
          <TextField
            value={advertisementName}
            onChange={handleNameChange}
            disabled={confirmAdd}
            margin="dense"
            id="name"
            label="Advertisement Name"
            type="text"
            fullWidth
          />
          <TextField
            value={advertisementDescription}
            onChange={handleDescriptionChange}
            disabled={confirmAdd}
            margin="dense"
            id="name"
            label="Advertisement Description"
            type="text"
            fullWidth
          />

          <TextField
            style={{ width: "50%" }}
            value={advertisementDuration}
            onChange={handleDurationChange}
            disabled={confirmAdd}
            margin="dense"
            id="duration"
            label="Advertisement Duration (minutes)"
            type="number"
            fullWidth
          />
          <InputLabel
            style={{ marginTop: "8px" }}
            shrink
            id="demo-simple-select-placeholder-label-label"
          >
            Age Rating
          </InputLabel>
          <Select
            style={{ width: "50%" }}
            disabled={confirmAdd}
            labelId="demo-simple-select-placeholder-label-label"
            id="demo-simple-select-placeholder-label"
            value={advertisementAgeRating}
            onChange={handleAgeRatingChange}
            displayEmpty
          >
            {ageRatingList.map((e) => {
              return <MenuItem value={e.id}>{e.agerating}</MenuItem>;
            })}
          </Select>

          <Box style={{ height: 30 }} />
          <Typography variant="h6">Showing Information</Typography>

          <Grid container spacing={3} style={{ width: "100%" }}>
            <Grid item style={{ width: "50%" }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disabled={confirmAdd}
                  value={advertisementStartDate}
                  onChange={handleStartDateChange}
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
                <KeyboardDatePicker
                  disabled={confirmAdd}
                  value={advertisementEndDate}
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

          <DialogContentText style={{ marginTop: "20px", marginBottom: 0 }}>
            Notes: Please make sure inputted advertisement detail is correct!
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
          Successfully insert advertiser advertisement!
        </Alert>
      </Snackbar>
    </Box>
  );
}
