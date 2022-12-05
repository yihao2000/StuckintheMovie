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

const coll_employees = collection(database, "employees");
const coll_departments = collection(database, "departments");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      paddingTop: theme.spacing(4),
      backgroundColor: "#181414",
      width: "100vw",
      height: "100vh",
    },

    textStyle: {
      color: "#FFFFFF",
    },

    form: {
      textAlign: "center",

      maxWidth: "40%",
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

  // Seeder;
  // React.useEffect(() => {
  //   seedEmployee();
  //   seedDivisions();
  //   seedDepartments();
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
          gridGap={10}
          justifyContent="center"
          alignItems="center"
        >
          <Grid
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
              >
                Stuck in the Movie Management App
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
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: "#38b4fc",
                }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </React.Fragment>
  );
}

export default Home;
