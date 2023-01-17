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
import Typography from "@material-ui/core/Typography";
import DetailTable from "./employeedetailtable";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from "@material-ui/core";

import { SalaryAdjustmentRequest } from "../interfaces/interface";
import { querySpecificEmployee } from "../../database/query";

const useStyles = makeStyles({
  table: {},
});

interface Data {
  selectedSalaryAdjustmentRequest: SalaryAdjustmentRequest;
}

export default function SalaryAdjustmentRequestDetailTable(props: Data) {
  const classes = useStyles();

  const [openEmployeeDetailDialog, setOpenEmployeeDetailDialog] =
    React.useState(false);

  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [inserting, setInserting] = React.useState(false);
  React.useEffect(() => {
    querySpecificEmployee(
      props.selectedSalaryAdjustmentRequest.employeeid
    ).then((e) => {
      setSelectedEmployee(e);
    });
  }, []);

  const handleOpenEmployeeDetailDialog = () => {
    setOpenEmployeeDetailDialog(true);
  };

  const handleCloseEmployeeDetailDialog = () => {
    setOpenEmployeeDetailDialog(false);
  };

  const getColor = (status: string) => {
    if (status == "true") {
      return "green";
    } else if (status == "false") {
      return "blue";
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
              {props.selectedSalaryAdjustmentRequest.id}
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
              Adjustment Request Date
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedSalaryAdjustmentRequest.requestdate}
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
              Employee ID
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              <IconButton
                style={{ padding: 0, color: "#EB4F47", fontSize: 15 }}
                onClick={handleOpenEmployeeDetailDialog}
              >
                {props.selectedSalaryAdjustmentRequest.employeeid}
              </IconButton>
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
              Requester ID
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedSalaryAdjustmentRequest.requesterid}
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
              Current Salary
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              <Typography
                variant="subtitle2"
                style={{
                  fontWeight: "bold",
                }}
              >
                $ {props.selectedSalaryAdjustmentRequest.salary}
              </Typography>
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
              Adjusted Salary
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              <Typography
                variant="subtitle2"
                style={{
                  fontWeight: "bold",
                }}
              >
                $ {props.selectedSalaryAdjustmentRequest.salaryadjustment}
              </Typography>
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
                style={{
                  color: getColor(
                    props.selectedSalaryAdjustmentRequest.adjusted
                  ),
                }}
              >
                {props.selectedSalaryAdjustmentRequest.adjusted == "false"
                  ? "Pending"
                  : "Adjusted"}
              </Typography>{" "}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Dialog
        maxWidth="md"
        fullWidth
        open={openEmployeeDetailDialog}
        onClose={handleCloseEmployeeDetailDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Employee Detail"}</DialogTitle>
        <Divider style={{ marginInline: 10 }} />
        <DialogContent>
          <DetailTable
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
          />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </TableContainer>
  );
}
