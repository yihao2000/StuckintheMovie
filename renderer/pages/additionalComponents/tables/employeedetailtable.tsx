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

const useStyles = makeStyles({
  table: {},
});

interface Employee {
  name: string;
  phone: string;
  salary: number;
  address: string;
  department: string;
  division: string;
  dob: Timestamp;
  email: string;
  id: string;
}

interface Data {
  selectedEmployee: Employee;
  setSelectedEmployee: Function;
}

export default function DetailTable(props: Data) {
  const classes = useStyles();

  if (props.selectedEmployee) {
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
                Name
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                <strong>{props.selectedEmployee.name}</strong>
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
                Date Of Birth
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                <strong>
                  {props.selectedEmployee.dob.toDate().toLocaleDateString()}
                </strong>
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
                <strong>{props.selectedEmployee.phone}</strong>
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
                <strong>{props.selectedEmployee.email}</strong>
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
                <strong>{props.selectedEmployee.address}</strong>
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
                Department
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                <strong>{props.selectedEmployee.department}</strong>
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
                Division
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                <strong>{props.selectedEmployee.division}</strong>
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
                Salary
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                $ <strong>{props.selectedEmployee.salary}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
