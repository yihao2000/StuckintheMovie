import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  SvgIconClassKey,
} from "@material-ui/core";
import ExtensionIcon from "@material-ui/icons/Extension";
import InventoryTable from "../../additionalComponents/tables/inventorytable";
import ReportIcon from "@material-ui/icons/Report";
import InventoryReportTable from "../tables/inventoryreporttable";
import BuildIcon from "@material-ui/icons/Build";
import InventoryRepairTable from "../tables/inventoryrepairtable";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

const useStyles = makeStyles({
  root: {
    marginTop: "5px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#eee",
    },
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {},
});

interface Data {
  title: string;
  type: string;
  content: string;
  description: string;
  refresh: boolean;
  refreshComponent: Function;
}

export default function ReportDetailCard(props: Data) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const getIcon = () => {
    if (props.type == "TotalEquipmentandFacility") {
      return (
        <ExtensionIcon
          fontSize="large"
          style={{
            padding: 3,
            borderRadius: 5,
            color: "orange",
          }}
        />
      );
    } else if (props.type == "TotalEquipmentandFacilityReport") {
      return (
        <ReportIcon
          fontSize="large"
          style={{
            padding: 3,
            borderRadius: 5,
            color: "red",
          }}
        />
      );
    } else if (props.type == "TotalEquipmentandFacilityRepair") {
      return (
        <BuildIcon
          fontSize="large"
          style={{
            padding: 3,
            borderRadius: 5,
            color: "blue",
          }}
        />
      );
    } else if (props.type == "TotalPurchases") {
      return (
        <ShoppingBasketIcon
          fontSize="large"
          style={{
            padding: 3,
            borderRadius: 5,
            color: "blue",
          }}
        />
      );
    } else if (props.type == "TotalEquipmentandFacilityPrice") {
      return (
        <AttachMoneyIcon
          fontSize="large"
          style={{
            padding: 3,
            borderRadius: 5,
            color: "green",
          }}
        />
      );
    }
  };

  const [openDetail, setOpenDetail] = React.useState(false);

  const handleOpenDetail = () => {
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  return (
    <Box>
      <Card
        className={classes.root}
        onClick={
          props.type == "TotalPurchases" ||
          props.type == "TotalEquipmentandFacilityPrice"
            ? undefined
            : handleOpenDetail
        }
      >
        <CardContent>
          <Box>{getIcon()}</Box>
          <Typography
            variant="subtitle1"
            component="h2"
            style={{ color: "grey" }}
          >
            {props.title}
          </Typography>
          <Typography
            className={classes.pos}
            style={{ color: "black", marginTop: 10 }}
            variant="h5"
          >
            {props.content}
          </Typography>
          <Typography
            variant="subtitle1"
            component="h2"
            style={{ color: "grey" }}
          >
            {props.description}
          </Typography>
        </CardContent>
      </Card>
      <Dialog
        maxWidth="md"
        fullWidth
        open={openDetail}
        onClose={handleCloseDetail}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.title} Detail</DialogTitle>
        <Divider style={{ marginInline: "2%" }} />
        <DialogContent>
          {props.type == "TotalEquipmentandFacility" && (
            <InventoryTable filter="All" successMessage={props.refresh} />
          )}

          {props.type == "TotalEquipmentandFacilityReport" && (
            <InventoryReportTable
              filter="All"
              type="Manager"
              refresh={props.refresh}
              refreshComponent={props.refreshComponent}
            />
          )}

          {props.type == "TotalEquipmentandFacilityRepair" && (
            <InventoryRepairTable
              filter="All"
              type="Manager"
              refresh={props.refresh}
              refreshComponent={props.refreshComponent}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Box>
            <Button onClick={handleCloseDetail} style={{ color: "#EB4F47" }}>
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
