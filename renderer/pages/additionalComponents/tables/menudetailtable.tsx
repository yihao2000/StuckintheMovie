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
import { Menu } from "../interfaces/interface";
import { DataManager } from "../manager/DataManager";

const useStyles = makeStyles({
  table: {},
});

interface Data {
  selectedMenu: Menu;
}

export default function MenuDetailTable(props: Data) {
  const classes = useStyles();

  const [typeList, setTypeList] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);

  React.useEffect(() => {
    const dataManager = DataManager.getInstance();

    dataManager.getTypeList().then((e) => {
      setTypeList(e);

      dataManager.getCategoryList().then((e) => {
        setCategoryList(e);
      });
    });
  });

  const getType = (id: string) => {
    var name;
    typeList.map((e) => {
      if (e.id == id) {
        name = e.name;
      }
    });

    return name;
  };

  const getCategory = (id: string) => {
    var name;
    categoryList.map((e) => {
      if (e.id == id) {
        name = e.name;
      }
    });

    return name;
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
                <strong>{props.selectedMenu.id}</strong>
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
                {props.selectedMenu.name}
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
                {props.selectedMenu.description}
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
                Price
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                <strong>$ {props.selectedMenu.price}</strong>
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
                Stock
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {props.selectedMenu.stock}
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
                Category
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                }}
                align="right"
              >
                {getCategory(props.selectedMenu.categoryid)}
              </TableCell>
            </TableRow>
          </TableBody>

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
              {getType(props.selectedMenu.typeid)}
            </TableCell>
          </TableRow>
        </Table>
      </TableContainer>
    </Box>
  );
}
