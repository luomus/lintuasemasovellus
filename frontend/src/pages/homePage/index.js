import React from "react";
import { Paper, Grid, Typography, Button } from "@material-ui/core/";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
//import CardMedia from '@material-ui/core/CardMedia';  laitettiin kommenttiin koska github actions ei toiminut. valitti unused-variable erroria.
import CurrentDayForm from "./CurrentDayForm";

const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
    margin: "10px 10px 10px 10px"
  },
  card: {
    background: "white",
    margin: "10px 10px 10px 10px"
  },
});



export const HomePage = () => {
  const classes = useStyles();

  const { t } = useTranslation();


  return (
    <div>

      <Grid container
        alignItems="stretch"
        // alignItems="center"
        justify="flex-end"
      >

        <Grid item xs={8}>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h2" >
              {t("titleExample")}
            </Typography>
            <br />
            {t("intro")} {t("intro")}</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <CurrentDayForm />
            <br />
          </Paper>
        </Grid>
        <Grid>
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {t("manualTitle")}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {t("manualTextShort")}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button component={Link} to="/manual" size="small" color="primary">
                {t("readMore")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

