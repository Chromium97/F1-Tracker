const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const axios = require('axios')

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    //querying api, if succesful, store in drivers variable, send to home page.
    axios.get('http://ergast.com/api/f1/current/driverStandings.json')
        .then(response => {
            let drivers = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
            res.render('home', { drivers: drivers });
        })
        .catch(error => {
            console.log(error);
        });
});

app.get('/constructors', (req, res)=>{
     //querying api, if succesful, store in constructors variable, send to constructors page.
    axios.get('http://ergast.com/api/f1/current/constructorStandings.json')
    .then(response => {
        let constructors = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        res.render('constructors', { constructors: constructors });
    })
    .catch(error => {
        console.log(error);
    });
});

app.get('/races', (req, res)=>{
     //querying api, if succesful, store in races variable, send to races page.
    axios.get('http://ergast.com/api/f1/2023.json')
    .then(response => {
        let races = response.data.MRData.RaceTable.Races;
        res.render('races', { races: races });
    })
    .catch(error => {
        console.log(error);
    });
});

app.get('/raceResults/:round', (req, res)=>{
    //getting the round parameter, passing variable into api call
    let raceRound = req.params.round;

    let url = 'http://ergast.com/api/f1/2023/'+ raceRound+'/results.json';
    //querying api
    axios.get(url)
    .then(response =>{
        //if successful, store results data, create variable that stores data
        //from a higher level in JSON document.
        let results = response.data.MRData.RaceTable;
        let lengthCheck = results.Races.length
        //if the lengthCheck === 0 then no race has occured, redirect to the races page
        if(lengthCheck ===0){
            res.redirect('/races');
        //if a race has occured, store full race results into restults variable
        //store race title into raceTitle, pass both to the view
        }else{
            results = response.data.MRData.RaceTable.Races[0].Results;
            let raceTitle = response.data.MRData.RaceTable.Races[0].raceName;
            res.render('raceResults', {results: results, raceTitle: raceTitle});
        }
       
    }).catch(error =>{
        console.log(error);
    }); 
});


app.listen(port, () => { `Listening on port ${port}` });