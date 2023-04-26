var express = require('express');
var app = express();

var migrationService = require('./migrationService.js');


app.get('/', function(req, res){
   res.send("Hello world!");
});
app.get('/adjustPartyInfo', async function(req, res){

   await migrationService.adjustPartyInfo();
   res.send("Hello world!");

});

app.get('/migrate', async function(req, res){

  // await migrationService.migrateZones();
 //  await migrationService.migrateElections();
 //  await migrationService.migrateStates();
//   await migrationService.migrateParties();
//   await migrationService.migratePartySubs();
//   await migrationService.migratePersons();
//   await migrationService.migrateItems();
//   await migrationService.migrateResults();
   
//   await migrationService.migrateCandidates();
//   await migrationService.migrateCandidateInfos();
   await migrationService.migrateCandidatePromises();
   
   res.send("Hello world!");
 });
 

app.listen(3000);