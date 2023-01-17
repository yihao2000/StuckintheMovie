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
import IconButton from "@material-ui/core/IconButton";
import { SideDrawer } from "../../additionalComponents/drawer/sidedrawer";

import Router from "next/router";
import PrimarySearchAppBar from "../../additionalComponents/appbar/customappbar";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";

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
  Divider,
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

import ProducerTable from "../../additionalComponents/tables/producertable";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { queryEmployees, resetEmployeePassword } from "../../database/query";
import { DataManager } from "../../additionalComponents/manager/DataManager";
import ImageAvatars from "../../additionalComponents/avatar/profilepicture";
import DetailTable from "../../additionalComponents/tables/employeedetailtable";

const drawerWidth = 260;

function AccountGrid() {
  const [employees, setEmployees] = React.useState([]);
  const [departmentList, setDepartmentList] = React.useState([]);
  const [divisionList, setDivisionList] = React.useState([]);
  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);

  const handleOpenSuccessMessage = () => {
    setSuccessMessage(true);
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(false);
  };
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleConfirmUpdate = async () => {
    setUpdating(true);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);

    resetEmployeePassword(selectedEmployee.row).then((e) => {
      setNewPassword(e);
      handleOpenSuccessMessage();
      setUpdating(false);
      handleCloseDetailDialog();
    });
  };

  const handleOpenDetailDialog = () => {
    setOpenDetailDialog(true);
  };

  const handleDetailClick = (data) => {
    setSelectedEmployee(data);

    setOpenDetailDialog(true);
  };

  function getDivisionName(division: string) {
    var name = "None";
    divisionList.filter((e) => {
      if (e.id === division) {
        console.log(e.name);
        name = e.name;
      }
    });
    return name;
  }

  function getDepartmentName(department: string) {
    var name = "None";

    departmentList.find((e) => {
      if (e.id == department) {
        name = e.name;
      }
    });

    return name;
  }

  React.useEffect(() => {
    var dataManager = DataManager.getInstance();
    dataManager.getDivisionList().then((e) => {
      setDivisionList(e);

      dataManager.getDepartmentList().then((x) => {
        setDepartmentList(x);
      });
    });
  }, []);

  React.useEffect(() => {
    queryEmployees().then((y) => {
      y.map((item) => {
        item.department = getDepartmentName(item.department);
        item.division = getDivisionName(item.division);
      });
      setEmployees(y);
    });
  }, [departmentList && divisionList]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Employee ID", width: 170 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "department", headerName: "Department", width: 240 },
    { field: "division", headerName: "Division", width: 240 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <IconButton
            onClick={() => {
              handleDetailClick(cellValues);
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  return (
    <div style={{ height: 620, width: "100%" }}>
      <DataGrid rowHeight={65} rows={employees} columns={columns} />

      {selectedEmployee && (
        <Dialog
          fullWidth
          open={openDetailDialog}
          onClose={handleCloseDetailDialog}
          maxWidth="sm"
          BackdropProps={{
            timeout: 500,
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          closeAfterTransition
        >
          <DialogTitle id="alert-dialog-title" disableTypography>
            <Typography variant="h5">
              <strong>Password Reset</strong>
              <Divider
                style={{
                  marginTop: 10,
                }}
              />
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to reset the selected employee account
              password ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={updating ? undefined : handleConfirmUpdate}
              style={{
                color: "green",
                cursor: updating ? "not-allowed" : "-moz-grab",
              }}
            >
              {updating ? (
                <ClipLoader
                  loading={updating}
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
                cursor: updating ? "not-allowed" : "-moz-grab",
              }}
              onClick={updating ? undefined : handleCloseDetailDialog}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Snackbar
        open={successMessage}
        autoHideDuration={10000}
        onClose={handleCloseSuccessMessage}
      >
        <Alert onClose={handleCloseSuccessMessage} severity="success">
          Successfully Reset Employee Password... Current Employee Password:{" "}
          <span style={{ color: "red" }}>{newPassword}</span>
        </Alert>
      </Snackbar>
    </div>
  );
}

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
          <ProducerTable
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

function Inventory() {
  const [refresh, setRefresh] = React.useState(false);

  const [inserting, setInserting] = React.useState(false);

  const classes = useStyles({});

  return (
    <React.Fragment>
      <Head>
        <title>Manage Employee Accounts</title>
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
            Manage Employees Account
          </Typography>
          <Box height={20}></Box>

          <AccountGrid />
          {/* <ProducerTable
            refreshComponent={refreshComponent}
            refresh={refresh}
          /> */}
        </main>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Inventory);
