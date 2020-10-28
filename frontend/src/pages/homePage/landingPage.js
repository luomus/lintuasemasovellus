import React, { useState } from "react";
import {
    Paper, makeStyles, Button, Grid
} from "@material-ui/core/";
import { useTranslation } from "react-i18next";
import { loginUrl } from "../../services";
import { AccountCircle } from "@material-ui/icons";


const LandingPage = () => {


    const useStyles = makeStyles({
        root: {
            display: "flex",
            justifyContent: "center",
        },
        paper: {
            background: "white",
            padding: "20px 30px",
            margin: "10px 10px 10px 10px",
            width: "70%",
            alignItems: 'center'

        },
        userButton: {
            float: "right",
            size: "small",
            color: "black",
            backgroundColor: "olivegreen",

        },
    });

    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={classes.root}>

            <Paper className={classes.paper} square={false}>
                <Grid container spacing={3}>
                <Grid item xs={12}>
                    Tähän banneri
                    </Grid>
                    <Grid item xs={12}>
                    <Button
                        className={classes.userButton}
                        id="login-link"
                        href={loginUrl}
                        startIcon={<AccountCircle />}
                    >
                        {t("login")}
                    </Button>
                    </Grid>


                    <Grid item xs={12}>
                    {t("intro")}
                    </Grid>

                    <Grid item xs={12}>
                    Tähän laji.fi logo ja Luomus logo
                    </Grid>
                </ Grid>
            </Paper>

        </div>
    );
};

export default LandingPage