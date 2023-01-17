import React from "react";
import Head from "next/head";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
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
import ExtensionIcon from "@material-ui/icons/Extension";

import { useQRCode } from "next-qrcode";

import { SideDrawer } from "../../../additionalComponents/drawer/sidedrawer";

import Router from "next/router";
import PrimarySearchAppBar from "../../../additionalComponents/appbar/customappbar";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import ReportDetailCard from "../../../additionalComponents/card/reportdetailcard";
import {
  queryEquipmentAmount,
  queryEquipmentPurchaseAmount,
  queryEquipmentPurchasePriceTotal,
  queryEquipmentRepairAmount,
  queryEquipmentReportAmount,
  queryFacilityAmount,
  queryFacilityPurchaseAmount,
  queryFacilityPurchasePriceTotal,
  queryFacilityRepairAmount,
  queryFacilityReportAmount,
} from "../../../database/query";
import InventoryPurchaseTable from "../../../additionalComponents/tables/inventorypurchasetable";

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

function Next() {
  const classes = useStyles({});

  const [refresh, setRefresh] = React.useState(false);
  const [
    totalEquipmentAndFacilitiesPurchase,
    setTotalEquipmentAndFacilitiesPurhcase,
  ] = React.useState("");

  const [
    totalSeparatedEquipmentsAndFacilitiesPurchase,
    setTotalSeparatedEquipmentsAndFacilitiesPurchase,
  ] = React.useState("");

  const [
    totalEquipmentsAndFacilitiesReport,
    setTotalEquipmentsAndFacilitiesReport,
  ] = React.useState("");
  const [
    totalSeparatedEquipmentsAndFacilitiesReport,
    setTotalSeparatedEquipmentsAndFacilitiesReport,
  ] = React.useState("");

  const [
    totalEquipmentsAndFacilitiesRepair,
    setTotalEquipmentsAndFacilitiesRepair,
  ] = React.useState("");
  const [
    totalSeparatedEquipmentsAndFacilitiesRepair,
    setTotalSeparatedEquipmentsAndFacilitiesRepair,
  ] = React.useState("");

  const [
    totalEquipmentsAndFacilitiesPriceTotal,
    setTotalEquipmentsAndFacilitiesPriceTotal,
  ] = React.useState("");
  const [
    totalSeparatedEquipmentsAndFacilitiesPriceTotal,
    setTotalSeparatedEquipmentsAndFacilitiesPriceTotal,
  ] = React.useState("");

  const [openAllPurchaseDialog, setOpenAllPurchaseDialog] =
    React.useState(false);

  const handleOpenAllPurchaseDialog = () => {
    setOpenAllPurchaseDialog(true);
  };

  const handleCloseAllPurchaseDialog = () => {
    setOpenAllPurchaseDialog(false);
  };

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  React.useEffect(() => {
    queryEquipmentPurchasePriceTotal().then((e) => {
      queryFacilityPurchasePriceTotal().then((x) => {
        var total = e + x;
        setTotalEquipmentsAndFacilitiesPriceTotal("$" + total + " spent");
        setTotalSeparatedEquipmentsAndFacilitiesPriceTotal(
          "$" + e + " for Equipments & $" + x + " for Facilities"
        );
      });
    });

    queryEquipmentPurchaseAmount().then((e) => {
      queryFacilityPurchaseAmount().then((x) => {
        setTotalEquipmentAndFacilitiesPurhcase(e + x + " purchase(s)");
        setTotalSeparatedEquipmentsAndFacilitiesPurchase(
          e + " Equipments & " + x + " Facilities Purchase"
        );
      });
    });

    queryEquipmentReportAmount().then((e) => {
      queryFacilityReportAmount().then((x) => {
        setTotalEquipmentsAndFacilitiesReport(e + x + " report(s)");
        setTotalSeparatedEquipmentsAndFacilitiesReport(
          e + " Equipments & " + x + " Facilities Report"
        );
      });
    });

    queryEquipmentRepairAmount().then((e) => {
      queryFacilityRepairAmount().then((x) => {
        setTotalEquipmentsAndFacilitiesRepair(e + x + " repair(s)");
        setTotalSeparatedEquipmentsAndFacilitiesRepair(
          e + " Equipments & " + x + " Facilities Repair"
        );
      });
    });
  }, [refresh]);

  return (
    <React.Fragment>
      <Head>
        <title>Purchase Report</title>
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
            Purchase Report
          </Typography>

          <Box height={20}></Box>
          <Grid container direction="column">
            <Grid spacing={2} container direction="row">
              <Grid item style={{ width: "50%" }}>
                <ReportDetailCard
                  refreshComponent={refreshComponent}
                  description={totalSeparatedEquipmentsAndFacilitiesPurchase}
                  title="Total Purchases"
                  type="TotalPurchases"
                  content={totalEquipmentAndFacilitiesPurchase}
                  refresh={refresh}
                />
              </Grid>
              <Grid item style={{ width: "50%" }}>
                <ReportDetailCard
                  refreshComponent={refreshComponent}
                  description={totalSeparatedEquipmentsAndFacilitiesPriceTotal}
                  title="Total Equipments & Facilities Price"
                  type="TotalEquipmentandFacilityPrice"
                  content={totalEquipmentsAndFacilitiesPriceTotal}
                  refresh={refresh}
                />
              </Grid>
            </Grid>
            <Box style={{ height: 40 }} />
            <Grid container direction="row">
              <Grid item style={{ width: "93%" }}>
                <Typography variant="h5">Recent Purchases</Typography>
              </Grid>
              <Grid item>
                <Button
                  style={{ textTransform: "none", color: "red" }}
                  onClick={handleOpenAllPurchaseDialog}
                >
                  View All
                </Button>
              </Grid>
            </Grid>
            <Box style={{ height: 20 }} />
            <Grid container direction="row">
              <InventoryPurchaseTable
                filter="Few"
                refresh={refresh}
                refreshComponent={refreshComponent}
              />
            </Grid>
          </Grid>

          <Dialog
            maxWidth="md"
            fullWidth
            open={openAllPurchaseDialog}
            onClose={handleCloseAllPurchaseDialog}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Inventory Purchases
            </DialogTitle>
            <Divider style={{ marginInline: "2%" }} />
            <DialogContent>
              <InventoryPurchaseTable
                filter="All"
                refresh={refresh}
                refreshComponent={refreshComponent}
              />
            </DialogContent>

            <DialogActions>
              <Box>
                <Button
                  onClick={handleCloseAllPurchaseDialog}
                  style={{ color: "#EB4F47" }}
                >
                  Close
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
        </main>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Next);
