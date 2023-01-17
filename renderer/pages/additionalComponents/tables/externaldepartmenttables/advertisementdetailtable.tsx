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

import {
  Advertisement,
  Member,
  Producer,
  Supplier,
} from "../../interfaces/interface";
import { DataManager } from "../../manager/DataManager";

const useStyles = makeStyles({
  table: {},
});

interface Data {
  selectedAdvertisement: Advertisement;
}

export default function AdvertisementDetailTable(props: Data) {
  const classes = useStyles();

  const [ageRatingList, setAgeRatingList] = React.useState([]);

  React.useEffect(() => {
    const dataManager = DataManager.getInstance();

    dataManager.getAgeRatingList().then((e) => {
      setAgeRatingList(e);
    });
  });
  const getAgeRating = (id: string) => {
    var agerating;
    ageRatingList.map((e) => {
      if (e.id == id) {
        agerating = e.agerating;
      }
    });

    return agerating;
  };
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
                <strong>{props.selectedAdvertisement.id}</strong>
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
                {props.selectedAdvertisement.name}
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
                {props.selectedAdvertisement.description}
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
                Duration
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {props.selectedAdvertisement.duration} Minute(s)
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
                Age Rating
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {getAgeRating(props.selectedAdvertisement.ageratingid)}
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
                Start Date
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {props.selectedAdvertisement.startdate}
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
                {props.selectedAdvertisement.enddate}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
