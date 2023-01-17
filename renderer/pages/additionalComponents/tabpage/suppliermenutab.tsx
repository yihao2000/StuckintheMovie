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
  insertInventoryPurchaseData,
  insertMenu,
  insertMovie,
  queryAllFundRequest,
  queryAllInventoryPurchase,
  queryProducerMovies,
} from "../../database/query";
import { Menu, Movie, Producer, Supplier } from "../interfaces/interface";
import ProducerMoviesTable from "../tables/producermoviestable";
import { DataManager } from "../manager/DataManager";
import { generateMenuId, generateMovieId } from "../../utils/generator";
import SupplierMenusTable from "../tables/suppliermenustable";

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
  selectedSupplier: Supplier;
}

export function SupplierMenuTab(props: Parameter) {
  const [openAddInventoryDialog, setOpenAddInventoryDialog] =
    React.useState(false);

  const [confirmAdd, setConfirmAdd] = React.useState(false);

  const [menuName, setMenuName] = React.useState("");
  const [menuDescription, setMenuDescription] = React.useState("");
  const [menuPrice, setMenuPrice] = React.useState(0);
  const [menuType, setMenuType] = React.useState("");
  const [menuStock, setMenuStock] = React.useState(0);
  const [menuCategory, setMenuCategory] = React.useState("");

  const [successMessage, setSuccessMessage] = React.useState(false);
  const [inserting, setInserting] = React.useState(false);

  const [refresh, setRefresh] = React.useState(false);

  const [categoryList, setCategoryList] = React.useState([]);
  const [typeList, setTypeList] = React.useState([]);

  React.useEffect(() => {
    var manager = DataManager.getInstance();

    manager.getCategoryList().then((e) => {
      setCategoryList(e);

      manager.getTypeList().then((e) => {
        setTypeList(e);
      });
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
    setMenuName("");
    setMenuDescription("");
    setMenuPrice(0);
    setMenuStock(0);
    setMenuCategory("");
    setMenuType("");
  };

  const handleConfirmInserting = () => {
    setInserting(true);

    generateMenuId().then((e) => {
      var data: Menu = {
        id: e,
        name: menuName,
        description: menuDescription,
        price: menuPrice,
        stock: menuStock,
        supplierid: props.selectedSupplier.id,
        typeid: menuType,
        categoryid: menuCategory,
      };

      insertMenu(data).then(async (e) => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(2000);

        handleOpenSuccessMessage();
        handleCancelInserting();
        handleCloseAddInventoryDialog();
        setConfirmAdd(false);
        clearFields();
        refreshComponent();
        setInserting(false);
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
    setMenuName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMenuDescription(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMenuPrice(Number(event.target.value));
  };

  const handleStockChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMenuStock(Number(event.target.value));
  };

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMenuType(event.target.value as string);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setMenuCategory(event.target.value as string);
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
        <Tooltip title={"Add Movie"}>
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
      <SupplierMenusTable
        refreshComponent={refreshComponent}
        refresh={refresh}
        supplierDetail={props.selectedSupplier}
      />

      <Dialog
        maxWidth="sm"
        fullWidth
        open={openAddInventoryDialog}
        onClose={handleCloseAddInventoryDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Menu</DialogTitle>
        <Divider style={{ marginInline: "2%" }} />
        <DialogContent>
          <Typography variant="h6">Menu Information</Typography>
          <TextField
            value={menuName}
            onChange={handleNameChange}
            disabled={confirmAdd}
            margin="dense"
            id="name"
            label="Menu Name"
            type="text"
            fullWidth
          />
          <TextField
            value={menuDescription}
            onChange={handleDescriptionChange}
            disabled={confirmAdd}
            margin="dense"
            id="name"
            label="Menu Description"
            type="text"
            fullWidth
          />
          <Grid container spacing={3} style={{ width: "100%" }}>
            <Grid item style={{ width: "51%" }}>
              <TextField
                value={menuPrice}
                onChange={handlePriceChange}
                disabled={confirmAdd}
                margin="dense"
                id="duration"
                label="Menu Price ($)"
                type="number"
                fullWidth
              />
            </Grid>

            <Grid item style={{ width: "49%" }}>
              <TextField
                value={menuStock}
                onChange={handleStockChange}
                disabled={confirmAdd}
                margin="dense"
                id="duration"
                label="Menu Stock"
                type="number"
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} style={{ width: "100%" }}>
            <Grid item style={{ width: "51%" }}>
              <InputLabel
                style={{ marginTop: "8px" }}
                shrink
                id="demo-simple-select-placeholder-label-label"
              >
                Category
              </InputLabel>
              <Select
                style={{ width: "100%" }}
                disabled={confirmAdd}
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={menuCategory}
                onChange={handleCategoryChange}
                displayEmpty
              >
                {categoryList.map((e) => {
                  return (
                    <MenuItem id={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>

            <Grid item style={{ width: "49%" }}>
              <InputLabel
                style={{ marginTop: "8px" }}
                shrink
                id="demo-simple-select-placeholder-label-label"
              >
                Type
              </InputLabel>
              <Select
                style={{ width: "100%" }}
                disabled={confirmAdd}
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={menuType}
                onChange={handleTypeChange}
                displayEmpty
              >
                {typeList.map((e) => {
                  return (
                    <MenuItem id={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
          </Grid>

          <Box style={{ height: 30 }} />

          <DialogContentText style={{ marginTop: "20px", marginBottom: 0 }}>
            Notes: Please make sure inputted menu detail is correct!
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
          Successfully insert supplier menu!
        </Alert>
      </Snackbar>
    </Box>
  );
}
