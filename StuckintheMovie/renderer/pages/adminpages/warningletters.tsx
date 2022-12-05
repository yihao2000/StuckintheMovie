import React from "react";
import Head from "next/head";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  ButtonBase,
  Card,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Input,
  List,
  Modal,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { SideDrawer } from "../additionalComponents/drawer/sidedrawer";
import {
  queryDepartments,
  queryDivisions,
  queryEmployees,
} from "../database/query";
import CloseIcon from "@material-ui/icons/Close";

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
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: "50%",
      height: "70%",
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
      backgroundColor: "#181414",
      padding: theme.spacing(3),
    },
  })
);

function WarningLetters() {
  const classes = useStyles({});

  const [open, setOpen] = React.useState(false);
  const [employees, setEmployees] = React.useState([]);
  const [employeeMatch, setEmployeeMatch] = React.useState([]);
  const [employeeSelected, setEmployeeSelected] = React.useState(null);
  const [textValue, setTextValue] = React.useState("");

  const [invalidCharacter, setInvalidCharacter] = React.useState(false);

  const handleEmployeeClicked = (employee) => {
    setTextValue(employee.name);
    // setEmployeeSelected(employee);
  };

  React.useEffect(() => {
    if (employees.length == 0) {
      var employeeList = [];
      const loadEmployees = queryEmployees();
      loadEmployees.then((e) => {
        e.map((e) => {
          employeeList.push(e);
        });
        setEmployees(employeeList);
      });
    }
  }, []);

  const searchEmployee = (text) => {
    if (!text) {
      setInvalidCharacter(false);
      setEmployeeMatch([]);
    } else if (!/[^a-zA-Z]/.test(text)) {
      setInvalidCharacter(false);
      let matches = employees.filter((employee) => {
        const regex = new RegExp(`${text}`, "gi");

        return employee.name.match(regex);
      });

      setEmployeeMatch(matches);
    } else {
      setInvalidCharacter(true);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmployeeMatch([]);
  };

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-typescript-material-ui)</title>
      </Head>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap color="primary">
              Stuck in the Movie
            </Typography>
          </Toolbar>
        </AppBar>
        <SideDrawer />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Typography variant="h4" gutterBottom>
            My Requests
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            style={{
              backgroundColor: "#38b4fc",
            }}
            onClick={handleOpen}
          >
            Create New Warning Letter
          </Button>
          <Dialog
            fullWidth
            maxWidth="sm"
            BackdropProps={{
              timeout: 500,
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
          >
            <DialogTitle id="alert-dialog-title" disableTypography>
              <Typography variant="h5">
                <strong>Issue a Warning Letter</strong>
              </Typography>
            </DialogTitle>

            <DialogContent>
              <Typography variant="h6">Employee Name</Typography>
              <TextField
                error={invalidCharacter}
                id="outlined-error-helper-text"
                // label="Error"
                helperText={invalidCharacter ? "Invalid Input" : ""}
                inputProps={{ pattern: "[A-Za-z]" }}
                style={{ width: "100%", marginTop: 10 }}
                placeholder="Enter Employee Name"
                onChange={(e) => searchEmployee(e.target.value)}
                variant="outlined"
              ></TextField>
              {employeeMatch &&
                employeeMatch.map((item, index) => (
                  <Paper style={{ maxHeight: 100, overflow: "auto" }}>
                    <Button
                      onClick={() => {
                        handleEmployeeClicked(item);
                      }}
                      style={{
                        width: "100%",
                        padding: 0,
                      }}
                    >
                      <Box
                        key={index}
                        style={{
                          borderRadius: "3px",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          height: 30,
                          backgroundColor: "#212121",
                        }}
                        title={item.name}
                      >
                        <Typography
                          style={{
                            marginLeft: 9,
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>
                    </Button>
                  </Paper>
                ))}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </React.Fragment>
  );
}

export default WarningLetters;
