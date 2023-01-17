import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Timestamp } from "firebase/firestore";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@material-ui/core";
import { GenerateQr } from "../../utils/qrgenerator";
import { InventoryRepair, InventoryReport } from "../interfaces/interface";

const useStyles = makeStyles({
  table: {},
});

interface Data {
  selectedRepair: InventoryRepair;
  setSelectedRepair: Function;
}

export default function RepairDetailTable(props: Data) {
  const classes = useStyles();

  const getColor = (status: string) => {
    if (status === "Pending") {
      return "blue";
    } else if (status == "Finished") {
      return "green";
    }
  };
  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="left"
              component="th"
              scope="row"
            >
              ID
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              <strong>{props.selectedRepair.id}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="left"
              component="th"
              scope="row"
            >
              Date
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedRepair.date}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="left"
              component="th"
              scope="row"
            >
              Reporter ID
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedRepair.reporterid}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="left"
              component="th"
              scope="row"
            >
              Responder ID
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedRepair.responderid}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="left"
              component="th"
              scope="row"
            >
              Item ID
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedRepair.itemid}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="left"
              component="th"
              scope="row"
            >
              Type
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedRepair.type}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="left"
              component="th"
              scope="row"
            >
              Status
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              <Typography
                variant="subtitle2"
                style={{ color: getColor(props.selectedRepair.status) }}
              >
                {props.selectedRepair.status}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
