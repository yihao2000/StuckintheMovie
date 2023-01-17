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
import { InventoryReport } from "../interfaces/interface";

const useStyles = makeStyles({
  table: {},
});

interface Data {
  selectedReport: InventoryReport;
  setSelectedReport: Function;
}

export default function ReportDetailTable(props: Data) {
  const classes = useStyles();

  const getColor = (status: string) => {
    if (status === "Pending") {
      return "blue";
    } else if (status == "Reviewed") {
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
              <strong>{props.selectedReport.id}</strong>
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
              {props.selectedReport.date}
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
              Employee
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedReport.employeeid}
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
              Item
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedReport.itemid}
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
              Message
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedReport.message}
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
                style={{ color: getColor(props.selectedReport.status) }}
              >
                {props.selectedReport.status}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
