import React from "react";
import Head from "next/head";
// import LoadingButton from "../pages/additionalComponents/loadingbutton";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Link from "../../../components/Link";
import AddIcon from "@material-ui/icons/Add";
import Table from "../../additionalComponents/tables/employeetable";

import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Toolbar,
} from "@material-ui/core";

import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
} from "@firebase/firestore";
import { app, database } from "../../database/firebaseconfig";
import { comparePassword } from "../../utils/encryptor";
import Router from "next/router";
import { Alert } from "@material-ui/lab";
import secureLocalStorage from "react-secure-storage";
import { SideDrawer } from "../../additionalComponents/drawer/sidedrawer";
import PrimarySearchAppBar from "../../additionalComponents/appbar/customappbar";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { queryDivisions, queryEmployeesAmount } from "../../database/query";
import { DataManager } from "../../additionalComponents/manager/DataManager";
import {
  Department,
  Division,
} from "../../additionalComponents/interfaces/interface";
import { ClipLoader } from "react-spinners";
import { EmployeeBuilder } from "../../models/builder/employeebuilder";
import { generateEmployeeId } from "../../utils/generator";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      paddingTop: theme.spacing(4),
      minHeight: "100vh",
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
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,

      padding: theme.spacing(3),
    },
  })
);

const drawerWidth = 240;

function ViewEmployee() {
  const classes = useStyles({});

  const [addEmployee, setAddEmployee] = React.useState(false);
  const [confirmAdd, setConfirmAdd] = React.useState(false);
  const [inserting, setInserting] = React.useState(false);

  const [successMessage, setSuccessMessage] = React.useState(false);

  const [employeeName, setEmployeeName] = React.useState("");
  const [employeeAddress, setEmployeeAddress] = React.useState("");
  const [employeeEmail, setEmployeeEmail] = React.useState("");
  const [employeeDivision, setEmployeeDivision] = React.useState("");
  const [employeeDepartment, setEmployeeDepartment] = React.useState("");
  const [employeePhone, setEmployeePhone] = React.useState("");
  const [employeeSalary, setEmployeeSalary] = React.useState(0);

  const [departmentList, setDepartmentList] = React.useState<Department[]>([]);
  const [divisionList, setDivisionList] = React.useState<Division[]>([]);

  const [refresh, setRefresh] = React.useState(false);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  React.useEffect(() => {
    const dataManager = DataManager.getInstance();
    dataManager.getDepartmentList().then((e) => {
      setDepartmentList(e);
    });
  }, [DataManager.getInstance().getDepartmentList()]);

  const handleOpenSuccessMessage = () => {
    setSuccessMessage(true);
  };
  const handleCloseSuccessMessage = () => {
    setSuccessMessage(false);
  };

  const buildEmployee = () => {
    queryEmployeesAmount().then((amount) => {
      var employeeBuilder = new EmployeeBuilder();
      var employee = employeeBuilder;
      employeeBuilder
        .setId(
          generateEmployeeId(employeeDepartment, employeeDivision, amount + 1)
        )
        .setDepartment(employeeDepartment)
        .setAddress(employeeAddress)
        .setDivision(employeeDivision)
        .setDob(selectedDate)
        .setEmail(employeeEmail)
        .setName(employeeName)
        .setPhone(employeePhone)
        .setSalary(employeeSalary)
        .build()
        .insert();
    });
  };
  const handleConfirmInserting = async () => {
    setInserting(true);

    buildEmployee();

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000);

    resetFields();

    closeAll();

    refreshComponent();
  };

  const closeAll = () => {
    handleCloseAddEmployee();
    handleCancelConfirmAdd();
    handleCancelInserting();
  };
  const handleCancelInserting = () => {
    setInserting(false);
  };

  const resetFields = () => {
    setEmployeeName("");
    setEmployeeAddress("");
    setEmployeeEmail("");
    setEmployeeDepartment("");
    setEmployeeDivision("");
    setEmployeePhone("");
    setEmployeeSalary(0);
  };

  function getDepartmentName(department: string) {
    var name = "None";
    departmentList.find((e) => {
      if (e.id == department) name = e.name;
    });
    return name;
  }

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );

  const handleConfirmConfirmAdd = () => {
    setConfirmAdd(true);
  };

  const handleCancelConfirmAdd = () => {
    setConfirmAdd(false);
  };
  const handleOpenAddEmployee = () => {
    setAddEmployee(true);
  };
  const handleCloseAddEmployee = () => {
    setAddEmployee(false);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeName(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeePhone(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeAddress(event.target.value);
  };

  const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeSalary(Number(event.target.value));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeEmail(event.target.value);
  };

  const handleDivisionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setEmployeeDivision(event.target.value as string);
  };
  const handleDepartmentChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setEmployeeDepartment(event.target.value as string);
    var array: Division[] = [];
    if (event.target.value == "7") {
      array.push(
        {
          id: "1",
          name: "Schedule Division",
        },
        {
          id: "2",
          name: "Front Office Division",
        },
        {
          id: "3",
          name: "Operation Division",
        }
      );
    } else if (event.target.value == "8") {
      array.push(
        {
          id: "2",
          name: "Front Office Division",
        },
        {
          id: "4",
          name: "Kitchen Division",
        }
      );
    }

    setDivisionList(array);
  };

  if (departmentList.length != 0) {
    return (
      <React.Fragment>
        <Head>
          <title>Manage Employees</title>
        </Head>
        <div className={classes.root}>
          <CssBaseline />
          <PrimarySearchAppBar></PrimarySearchAppBar>
          <SideDrawer />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Typography
              variant="h4"
              style={{ fontWeight: "bold", marginLeft: "20" }}
            >
              View Employees
            </Typography>
            <Box height={30}></Box>
            <Button
              startIcon={<AddIcon />}
              style={{
                color: "white ",
                backgroundColor: "#EB4F47",
                textTransform: "none",
              }}
              onClick={handleOpenAddEmployee}
            >
              Add New Employee
            </Button>
            <Box height={30}></Box>
            <Table refreshComponent={refreshComponent} refresh={refresh} />

            <Dialog
              maxWidth="sm"
              fullWidth
              open={addEmployee}
              onClose={handleCloseAddEmployee}
              aria-labelledby="form-dialog-title"
              style={{ maxHeight: "100vh" }}
            >
              <DialogTitle id="form-dialog-title">
                Add New Inventory
              </DialogTitle>
              <Divider style={{ marginInline: "2%" }} />
              <DialogContent style={{ maxHeight: "100vh" }}>
                <Typography variant="h6">Personal Information</Typography>
                <TextField
                  value={employeeName}
                  onChange={handleNameChange}
                  disabled={confirmAdd}
                  margin="dense"
                  id="name"
                  label="Employee Name"
                  type="text"
                  fullWidth
                />

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
                    label="Employee DOB"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>

                <TextField
                  value={employeeEmail}
                  onChange={handleEmailChange}
                  disabled={confirmAdd}
                  margin="dense"
                  id="description"
                  label="Employee Email"
                  type="text"
                  fullWidth
                />

                <TextField
                  value={employeePhone}
                  onChange={handlePhoneChange}
                  disabled={confirmAdd}
                  margin="dense"
                  id="description"
                  label="Employee Phone"
                  type="text"
                  fullWidth
                />

                <TextField
                  value={employeeAddress}
                  onChange={handleAddressChange}
                  disabled={confirmAdd}
                  multiline
                  margin="dense"
                  id="description"
                  label="Employee Address"
                  type="text"
                  fullWidth
                />

                <Typography variant="h6" style={{ marginTop: "5%" }}>
                  Additional Information
                </Typography>
                <InputLabel
                  style={{ marginTop: "8px" }}
                  shrink
                  id="demo-simple-select-placeholder-label-label"
                >
                  Department
                </InputLabel>
                <Select
                  disabled={confirmAdd}
                  style={{ width: "51%" }}
                  labelId="demo-simple-select-placeholder-label-label"
                  id="demo-simple-select-placeholder-label"
                  value={employeeDepartment}
                  onChange={handleDepartmentChange}
                  displayEmpty
                  // className={classes.selectEmpty}
                >
                  {departmentList.map((e) => {
                    return (
                      <MenuItem id={e.id} value={e.id}>
                        {e.name}
                      </MenuItem>
                    );
                  })}
                </Select>

                <InputLabel
                  style={{ marginTop: "8px" }}
                  shrink
                  id="demo-simple-select-placeholder-label-label"
                >
                  Division
                </InputLabel>
                <Select
                  defaultValue="None"
                  disabled={confirmAdd}
                  style={{ width: "51%" }}
                  labelId="demo-simple-select-placeholder-label-label"
                  id="demo-simple-select-placeholder-label"
                  value={employeeDivision}
                  onChange={handleDivisionChange}
                  displayEmpty
                  // className={classes.selectEmpty}
                >
                  <MenuItem id="None" value="None">
                    None
                  </MenuItem>
                  {divisionList.map((e) => {
                    return (
                      <MenuItem id={e.id} value={e.id}>
                        {e.name}
                      </MenuItem>
                    );
                  })}
                </Select>

                <TextField
                  style={{ width: "51%" }}
                  value={employeeSalary}
                  onChange={handleSalaryChange}
                  disabled={confirmAdd}
                  margin="dense"
                  id="description"
                  label="Employee Salary ($)"
                  type="number"
                  fullWidth
                />

                <DialogContentText
                  style={{ marginTop: "20px", marginBottom: 0 }}
                >
                  Notes: Please make sure the entered employee detail is correct
                  !
                </DialogContentText>
              </DialogContent>

              <DialogActions>
                {confirmAdd == false && (
                  <Box>
                    <Button
                      onClick={handleCloseAddEmployee}
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
                Successfully insert new Employee!
              </Alert>
            </Snackbar>
          </main>
        </div>
      </React.Fragment>
    );
  }
}
export default ViewEmployee;
