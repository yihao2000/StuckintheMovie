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
  queryEmployeeWorkingTime,
  queryWorkingTime,
} from "../../database/query";
import { MenuItem, Select } from "@material-ui/core";
import Menu from "@material-ui/icons/Menu";

const useStyles = makeStyles({
  table: {
    minWidth: 850,
  },
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
  employee: Employee;
  setAdjustedSchedule: Function;
}

export default function WorkingTimeTable(props: Data) {
  const classes = useStyles();

  React.useEffect(() => {
    queryEmployeeWorkingTime(props.employee.id).then((result) => {
      setEmployeeWorkingTime(result);
      setAdjustedWorkingTime(result);

      const arr = [];
      result.map((e) => {
        arr.push(e.workingtimeid);
      });
      console.log(arr);
      setCurrentWorkingTimeId(arr);
    });

    queryWorkingTime().then((result) => {
      setWorkingTime(result);
    });
  }, []);

  const [employeeWorkingTime, setEmployeeWorkingTime] = React.useState([]);
  const [workingTime, setWorkingTime] = React.useState([]);
  const [adjustedWorkingTime, setAdjustedWorkingTime] = React.useState([]);

  const [currentWorkingTimeId, setCurrentWorkingTimeId] = React.useState([]);

  const getCurrentDayWorkingTime = (workingtimeid: string) => {
    var array = [];

    array = workingTime.filter((item) => {
      return item.workingday == getWorkingTimeDay(workingtimeid);
    });

    return array;
  };

  const getCurrentWorkingTime = (workingtimeid: string) => {
    var array = [];

    array = workingTime.filter((item) => {
      return item.id == workingtimeid;
    });

    return array;
  };

  const handleSelectionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    var arr = adjustedWorkingTime;

    var curr = arr.find((e) => {
      return (
        getWorkingTimeDay(event.target.value as string) ==
        getWorkingTimeDay(e.workingtimeid)
      );
    });

    var index = arr.findIndex((e) => curr.workingtimeid == e.workingtimeid);

    arr[index].workingtimeid = event.target.value;

    setAdjustedWorkingTime(arr);
    props.setAdjustedSchedule(arr);
  };

  const getWorkingTimeDay = (workingtimeid: string) => {
    var day;
    workingTime.find((e) => {
      if (e.id == workingtimeid) {
        day = e.workingday;
      }
    });
    return day;
  };

  const getDayName = (workingtimeid: string) => {
    var day = getWorkingTimeDay(workingtimeid);

    var dayName;
    if (day === 1) {
      dayName = "Monday";
    } else if (day === 2) {
      dayName = "Tuesday";
    } else if (day === 3) {
      dayName = "Wednesday";
    } else if (day === 4) {
      dayName = "Thursday";
    } else if (day === 5) {
      dayName = "Friday";
    } else if (day === 6) {
      dayName = "Saturday";
    }

    return dayName;
  };

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <colgroup>
          <col style={{ width: "33%" }} />
          <col style={{ width: "33%" }} />
          <col style={{ width: "33%" }} />
        </colgroup>
        <TableBody>
          <TableRow>
            <TableCell>Day</TableCell>
            <TableCell align="left">Current Working Time</TableCell>
            <TableCell align="left">Adjusted Working Time</TableCell>
          </TableRow>
          {employeeWorkingTime.map((e, i) => {
            return (
              <TableRow>
                <TableCell
                  style={{
                    borderBottom: "none",
                  }}
                  align="left"
                  component="th"
                  scope="row"
                >
                  {getDayName(e.workingtimeid)}
                </TableCell>

                <TableCell
                  style={{
                    borderBottom: "none",
                  }}
                  align="left"
                  component="th"
                  scope="row"
                >
                  {getCurrentWorkingTime(currentWorkingTimeId[i]).map((e) => {
                    return (
                      e.starthour +
                      ":" +
                      e.startminute +
                      " - " +
                      e.endhour +
                      ":" +
                      e.endminute +
                      " "
                    );
                  })}
                </TableCell>

                <TableCell
                  style={{
                    borderBottom: "none",
                  }}
                  align="left"
                  component="th"
                  scope="row"
                >
                  <Select
                    style={{ minWidth: "100%" }}
                    onChange={handleSelectionChange}
                    defaultValue={""}
                  >
                    {getCurrentDayWorkingTime(e.workingtimeid).map((option) => {
                      return (
                        <MenuItem value={option.id}>
                          {option.starthour}:{option.startminute} -{" "}
                          {option.endhour}:{option.endminute}
                          {"  "}(
                          {parseInt(option.id) % 2 == 0 ? "Night" : "Morning"})
                        </MenuItem>
                      );
                    })}
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
          {/* <TableRow>
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
          </TableRow> */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
