
const express = require("express");
const bodyParser = require("body-parser");
const today = require("date-and-time");
const moment = require("moment");
const https = require("https");
const ejs = require("ejs");
const _ = require("lodash");
const ls = require("local-storage");
const nodemailer = require("nodemailer")
const openweather_apis = require("openweather-apis")
const { urlencoded } = require("body-parser");
const { response } = require("express");

const app = express();


var weatherBigData =[];
let dateData = [];
var default_location = ["Kochi", ""];

var error = "happy";
var radioCel = "checked";
var radioFah = "";
var temp_unit = "°C"
var temp_unit_status = "metric";
var mode = "light";
var light = "checked";
var dark = "";
var location = "";
var icon;

const appid = "978ce8ef57de3c22637883d86ae6b028";

var day = moment().format("dddd");
var date = moment().format("MMMM Do YYYY");
var time = moment().format("h:mm:ss a");

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){

    if(default_location[1] === ""){
        location = default_location[0];
    } else {
        if (error === 'error'){
            location = default_location[0];
            default_location[1] = "";
        } else {
            location = default_location[1];
        }
    }

    openweather_apis.setCity(location);
    openweather_apis.setUnits(temp_unit_status);
    openweather_apis.setLang('en');
    openweather_apis.setAPPID(appid);  
    
    openweather_apis.getAllWeather(function(err, data){
        if (err){
            console.log(err);
           
        } else {
            icon = "/image/" + data.weather[0].description + ".svg";
          
        }
        
       
        res.render("home", {
            tab_name: "Z-weather",
            homeDay: day,
            homeDate: date,
            homeTime: time,
            homeData: data,
            error: error,
            temp_unit: temp_unit,
            homeIcon: icon
        })
        if(error === "error"){
            error = "happy"
        }
    });
       
});

app.post("/", function(req,res){
   
    location = req.body.cityName;
    if (location === ""){
        if (default_location[1] === ""){
            location = default_location[0];
        } else{
            location = default_location[1];
        }
    } else {
        default_location[1] = location;
    }

    openweather_apis.setCity(location);
    openweather_apis.setUnits(temp_unit_status);
    openweather_apis.setLang('en');
    openweather_apis.setAPPID(appid);  
    
    openweather_apis.getAllWeather(function(err, data){
        if (err){
            console.log(err);
            error = "error";
            res.redirect("home")
        } else {
           
            icon = "/image/" + data.weather[0].description + ".svg";
        }
        
        console.log(icon);
        res.render("home", {
            tab_name: "Z-weather",
            homeDay: day,
            homeDate: date,
            homeTime: time,
            homeData: data,
            error: error,
            temp_unit: temp_unit,
            homeIcon: icon
        })
    });

});

app.get("/home", function(req, res){
    res.redirect("/");
});

app.get("/settings", function(req, res){
    res.render("settings", {
        tab_name: "Settings",
        radio_cel: radioCel,
        radio_fah: radioFah,
        light: light,
        dark: dark
    });
});

app.post("/settings", function(req, res){
    temp_unit = req.body.tempU;
    mode = req.body.mode;
    // tempreture control
    if (temp_unit === "celsius"){
        radioFah = "";
        radioCel = "checked";
        temp_unit_status = "metric"
        temp_unit = "°C"
    } else {
        radioFah = "checked";
        radioCel = "";
        temp_unit_status = "imperial"
        temp_unit = "°F"
    }

    // mode control
    if(mode === 'light'){
        light = "checked";
        dark = "";
    } else {
        light = "";
        dark = "checked"
    }

    res.redirect("settings"); 
});

app.get("/about", function(req, res){
    res.render("about", {tab_name: "About"});
});

app.get("/contact", function(req, res){
    res.render("contact", {tab_name: "Contact Us"});
});

app.post("/contact", function(req, res){

    var feedback_name = req.body.Fname;
    var feedback_email = req.body.Femail;
    var feedback = req.body.feedback_contact;
    if(feedback === "1"){
        feedback = "Excellent";
    } else if(feedback === "2"){
        feedback = "Average"
    }else {
        feedback = "Poor"
    }

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "abhijith.p.subash@gmail.com",
            pass: "9400895025"

        }
    });
    var mailOptions = {
        from: "abhijith.p.subash@gmail.com",
        to: "zetiny.official@gmail.com",
        subject: "Feedback from Z-weather by" + feedback_name,
        text: "hi Im "+ feedback_name + "and my experience from Z-Weather is " + feedback +", my email: "+ feedback_email

    }
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
        } else {
            console.log("Email sent" + info.response);
        }
    })
    res.redirect("/contact");
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Running on port 3000");
    console.log("Good Night APPU..");
})
