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
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from "@material-ui/core";
import { GenerateQr } from "../../utils/qrgenerator";
import { Member, Producer, Supplier } from "../interfaces/interface";

const useStyles = makeStyles({
  table: {},
});

interface Data {
  selectedSupplier: Supplier;
}

export default function SupplierDetailTable(props: Data) {
  const classes = useStyles();

  return (
    <Box style={{ marginTop: 20 }}>
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
                <strong>{props.selectedSupplier.id}</strong>
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
                Name
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {props.selectedSupplier.name}
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
                Description
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {props.selectedSupplier.description}
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
                Email
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {props.selectedSupplier.email}
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
                Phone
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {props.selectedSupplier.phone}
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
                Address
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {props.selectedSupplier.address}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
