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
import Link from "../components/Link";
import { Box, Grid, Snackbar, TextField } from "@material-ui/core";
import {
  seedEmployee,
  seedDepartments,
  seedDivisions,
  seedWorkingTime,
  seedExtraEmployee,
} from "../pages/seeder/seeder";
import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
} from "@firebase/firestore";
import { app, database } from "../pages/database/firebaseconfig";
import { comparePassword } from "./utils/encryptor";
import Router from "next/router";
import { Alert } from "@material-ui/lab";
import secureLocalStorage from "react-secure-storage";
import { DataManager } from "./additionalComponents/manager/DataManager";

const coll_employees = collection(database, "employees");
const coll_departments = collection(database, "departments");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      paddingTop: theme.spacing(4),
      backgroundColor: "#e6e6e6",
      width: "100vw",
      height: "100vh",
    },

    textStyle: {
      color: "#FFFFFF",
    },

    form: {
      textAlign: "center",
    },
  })
);

function Home() {
  const classes = useStyles({});
  const [open, setOpen] = React.useState(false);

  const openSnackbar = () => {
    setOpen(true);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const id = event.target.id.value + "";
    const password = event.target.password.value;

    var qemployee;
    if (id && password) {
      const qid = query(coll_employees, where("id", "==", id));
      var qpw;
      getDocs(qid).then((e) => {
        if (!e.empty) {
          qpw = e.docs[0].data().password;
          console.log(e.docs[0].data().password);

          const result = comparePassword(password, qpw);

          result.then((res) => {
            console.log(result);
            if (res) {
              qemployee = e.docs[0].data();

              secureLocalStorage.setItem("credentials", qemployee);
              Router.push("/dashboard");
            }
          });
        } else {
          openSnackbar();
        }
      });
    } else {
      openSnackbar();
    }
  };

  React.useEffect(() => {
    DataManager.getInstance();
  });

  // Seeder;
  // React.useEffect(() => {
  //   seedEmployee();
  //   seedDivisions();
  //   seedDepartments();
  //   seedWorkingTime();
  // }, []);

  // React.useEffect(() => {
  //   seedExtraEmployee();
  // }, []);
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-material-ui)</title>
      </Head>

      <Snackbar open={open} autoHideDuration={3000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="error">
          Invalid Account Credentials !
        </Alert>
      </Snackbar>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Box
          className={classes.root}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ backgroundColor: "white", borderRadius: 20 }}
          >
            <Grid
              style={{ padding: 70 }}
              container
              direction={"column"}
              spacing={1}
              className={classes.form}
            >
              <Grid item>
                <Typography
                  className={classes.textStyle}
                  variant="h4"
                  gutterBottom
                  style={{ color: "#F79A1F", fontFamily: "cursive" }}
                >
                  <strong>Stuck in the Movie Management App</strong>
                </Typography>
              </Grid>

              <Grid item>
                <TextField
                  className={classes.textStyle}
                  id="id"
                  name="id"
                  fullWidth={true}
                  // inputProps="blue"
                  disabled={false}
                  label="Username"
                  placeholder="Employee ID"
                  size="medium"
                  variant="outlined"
                />
              </Grid>

              <Grid item>
                <TextField
                  className={classes.textStyle}
                  id="password"
                  name="password"
                  fullWidth={true}
                  type="password"
                  // inputProps="blue"
                  disabled={false}
                  label="Password"
                  placeholder="Password"
                  size="medium"
                  variant="outlined"
                />
              </Grid>

              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </React.Fragment>
  );
}

export default Home;
