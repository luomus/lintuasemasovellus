import React from "react";
import { Paper, Grid, Typography, Button } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';


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

      <Grid container>

        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h2" >
              {t("titleExample")}
            </Typography>
            <br />
            {t("intro")} {t("intro")}</Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h2" >
              {t("titleExample")} 2
        </Typography>
            <br />
            {t("intro")} {t("intro")}</Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {t("titleExample")} 3
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {t("intro")}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                {t("readMore")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {t("titleExample")} 4
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {t("intro")}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                {t("readMore")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {t("titleExample")} 5
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {t("intro")}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                {t("readMore")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {t("titleExample")} 6
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {t("intro")}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                {t("readMore")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

