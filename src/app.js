const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (_req, res)=> {
    res.send("Welcome to the Spent API");
})


app.use((_req, res)=> {
    res.status(404).send({
        message: "Route not found"
    })
})

module.exports = app;
