import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    marginTop: "5px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {},
});

interface Data {
  date: string;
  amount: number;
  reason: string;
  color: string;
}

export default function FundRequestCard(props: Data) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  React.useEffect(() => {
    {
      console.log(props.date);
    }
  });

  return (
    <Card
      className={classes.root}
      style={{ backgroundColor: props.color, border: "1px" }}
    >
      <CardContent>
        <Typography
          className={classes.title}
          style={{ color: "lightgrey" }}
          gutterBottom
        >
          {props.date}
        </Typography>
        <Typography variant="h5" component="h2" style={{ color: "lightgrey" }}>
          $ {props.amount}
        </Typography>
        <Typography className={classes.pos} style={{ color: "lightgrey" }}>
          {props.reason}
        </Typography>
      </CardContent>
    </Card>
  );
}
