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
import { Member, PromotionEvent } from "../interfaces/interface";

const useStyles = makeStyles({
  table: {},
});

interface Data {
  selectedPromotionEvent: PromotionEvent;
}

export default function PromotionEventDetailTable(props: Data) {
  const classes = useStyles();

  const [openQrDialog, setOpenQrDialog] = React.useState(false);

  const handleOpenQrDialog = () => {
    setOpenQrDialog(true);
  };

  const handleCloseQrDialog = () => {
    setOpenQrDialog(false);
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
              <IconButton
                size="small"
                style={{ padding: 0, color: "#EB4F47" }}
                onClick={handleOpenQrDialog}
              >
                <strong>{props.selectedPromotionEvent.id}</strong>
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
              Name
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedPromotionEvent.name}
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
              {props.selectedPromotionEvent.description}
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
              Release Date
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedPromotionEvent.releasedate}
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
              End Date
            </TableCell>
            <TableCell
              style={{
                borderBottom: "none",
              }}
              align="right"
            >
              {props.selectedPromotionEvent.enddate}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Dialog
        open={openQrDialog}
        onClose={handleCloseQrDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Generated QR"}</DialogTitle>
        <Divider style={{ marginInline: 10 }} />
        <DialogContent>
          <GenerateQr text={props.selectedPromotionEvent.id} />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </TableContainer>
  );
}
