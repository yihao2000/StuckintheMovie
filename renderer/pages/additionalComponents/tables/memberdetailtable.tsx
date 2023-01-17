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
} from "@material-ui/core";
import { GenerateQr } from "../../utils/qrgenerator";
import { Member } from "../interfaces/interface";

const useStyles = makeStyles({
  table: {},
});

interface Data {
  selectedMember: Member;
}

export default function MemberDetailTable(props: Data) {
  const classes = useStyles();

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
              <strong>{props.selectedMember.id}</strong>
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
              {props.selectedMember.name}
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
              Date of Birth
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedMember.dob.toLocaleString()}
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
              {props.selectedMember.email}
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
              {props.selectedMember.phone}
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
              Points
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedMember.points}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
