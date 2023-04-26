const axios = require('axios');

var env = require("./env.js");

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://cryslub:'+env.password+'@cluster0.yna1nar.mongodb.net/dclink?retryWrites=true&w=majority');

var electionSchema = mongoose.Schema({
    name: String,
    type: String,
    result: String,
    date:String
 });
 var Election = mongoose.model("Election", electionSchema);


 var stateSchema = mongoose.Schema({
    name: String,
    fullName: String,
    election_id : mongoose.Schema.Types.ObjectId
 });
 var State = mongoose.model("State", stateSchema);

 
 var partySchema = mongoose.Schema({
    name: String,
    color: String,
    textColor: String,
    infos : Array,
    infobak: Map 
});

 var Party = mongoose.model("Party", partySchema);
 

 
 var personSchema = mongoose.Schema({
    name: String,
    photo: Boolean,
    chinese: String,
    birth:String,
    legacyId:Number
});
 var Person = mongoose.model("Person", personSchema);


 var itemSchema = mongoose.Schema({
    name: String,
    link: String,
    state_id : mongoose.Schema.Types.ObjectId,
    party_id : mongoose.Schema.Types.ObjectId,
    election_id : mongoose.Schema.Types.ObjectId,
    candidate_id : mongoose.Schema.Types.ObjectId,
    mapCode: String,
    type: String,
    title: String,
    zoneCode:String,
    legacyId:Number,
    coordinate:{
        x:Number,
        y:Number    
    },
    votes:{type:'Array', default :[]}
 });

 var Item = mongoose.model("Item", itemSchema);


 
 var candidateSchema = mongoose.Schema({
    link: String,
    person_id : mongoose.Schema.Types.ObjectId,
    party_id : mongoose.Schema.Types.ObjectId,
    item_id : mongoose.Schema.Types.ObjectId,
    state_id : mongoose.Schema.Types.ObjectId,
    votes: Number,
    text : String,
    legacyId:Number,
    info:{
        necDate : String,
        necType : String,
        necId : String,
        district : String,
        ward : String,
        stateName : String,
        partyName :String,
        name : String,
        chinese : String,
        birth : String,
        age : String,
        address : String,
        job : String,
        education : String,
        career1 : String,
        career2 : String,
        status : String,
        gender : String,
        order : String,
        historyCount : Number,
        promises : {type:'Array', default :[]}
    }
 });

 var Candidate = mongoose.model("Candidate", candidateSchema);



 
 var zoneSchema = mongoose.Schema({
    name: String,
    code: String,
    population: Number,
    fullName:String
});
 var Zone = mongoose.model("Zone", zoneSchema);


const httpCall = async (url)=>{
    const res = await axios.get('http://localhost:8080/dclink/data/'+url+'.do')
    return res.data;

}

var electionMap = {};
var partyMap = {};
var personMap = {};
var stateMap = {};
var itemMap = {};
var candidateMap = {};

const migrationService = {
    migrateElections:async ()=>{

        mongoose.connection.db.dropCollection("elections")

        const elections = await httpCall('elections');
        for(election of elections) {
            var newElection = new Election({
                name: election.name,
                type: election.type,
                result: election.result,
                date:election.date
            });

            await newElection.save();
            electionMap[election.id] = newElection;                 
        }    
        console.log("elections")
    },
    migrateStates:async ()=>{

        mongoose.connection.db.dropCollection("states")

        const states = await httpCall('states')

        for(state of states) {

            var newState = new State({
                name: state.name,
                fullName: state.fullName,
                election_id: electionMap[state.election]._id
            });

            await newState.save()
            stateMap[state.id] = newState._id;               
        }  
        console.log("states")
 
    },
    migrateParties:async ()=>{

        mongoose.connection.db.dropCollection("parties")

        const parties = await httpCall('parties')

        for(party of parties) {

            var newParty = new Party({
                name: party.name,
                color: party.color,
                textColor: party.textColor,
                infos:{}
            });

            await newParty.save()
            partyMap[party.id] = newParty._id;        
        }    

        console.log("parties")

    },
    migratePartySubs:async ()=>{


        const subs = await httpCall('party/subs')

        for(sub of subs) {

            var party_id = partyMap[sub.party]
            var party = await Party.findOne({_id:party_id})
            var infos = party.infos;

            var election_id = electionMap[sub.election]._id;
            infos.set(election_id,sub.link)
//            console.log(infos)
             

            await Party.updateOne({_id:party_id},{
                infos:infos   
            })

        }    

        console.log("party subs")

    },
    migratePersons:async ()=>{

        mongoose.connection.db.dropCollection("people")


        const persons = await httpCall('persons')

        for(person of persons) {

            var newPerson = new Person({
                name: person.name,
                photo: person.photo,
                chinese: person.chinese,
                birth: person.birth,
                legacyId:person.id
            });

            await newPerson.save()
            personMap[person.id] = newPerson._id;        
        }    

        console.log("persons")
    },
    migrateItems:async ()=>{

        mongoose.connection.db.dropCollection("items")


        const items = await httpCall('itemsAll')

        for(item of items) {

            var election = electionMap[item.election];
            var candidate_id;

            if(election.type==='presidential'){

            }


            var newItem = new Item({
                name: item.name,
                link: item.link,
                mapCode: item.code,
                type: item.type,
                title: item.title,
                zoneCode: item.zone,
                election_id: election._id,
                state_id: stateMap[item.state],
                party_id: partyMap[item.party],
                candidate_id:candidate_id,
                legacyId:item.id,
                coordinate:{
                    x:item.x,
                    y:item.y
                }
            });

            await newItem.save()
            itemMap[item.id] = newItem._id;   

        }    

        console.log("items")
    },
    migrateCandidates:async ()=>{
        
        mongoose.connection.db.dropCollection("candidates")


        const candidates = await httpCall('candidatesAll')

        for(candidate of candidates) {


            var newCandidate = new Candidate({
                link: candidate.link,
                votes: candidate.rate,
                text: candidate.txt,
                person_id: personMap[candidate.person],
                state_id: stateMap[candidate.state],
                party_id: partyMap[candidate.party],
                item_id: itemMap[candidate.item],
                legacyId : candidate.id
            });

            await newCandidate.save()
          //  candidateMap[candidate.id] = newCandidate._id;   
            
        }    

        console.log("candidates")
    },
    migrateCandidateInfos:async ()=>{
        const infos = await httpCall('candidate/info')

        for(info of infos) {

           // console.log(info.candidate)

            var candidate = {
              
                person_id: personMap[info.person],
                party_id: partyMap[info.party],
                item_id: itemMap[info.item],
                info:{
                    necDate : info.date,
                    necType : info.type,
                    necId : info.necId,
                    district : info.district,
                    ward : info.ward,
                    stateName : info.state,
                    partyName :info.partyName,
                    name : info.name,
                    chinese : info.chinese,
                    birth : info.birth,
                    age : info.age,
                    address : info.address,
                    job : info.job,
                    education : info.education,
                    career1 : info.career1,
                    career2 : info.career2,
                    status : info.status,
                    gender : info.gender,
                    order : info.number,
                    historyCount : info.history,
                    promises :[]
                }
            }

            if(info.votes){
                candidate.votes = info.votes
            }
            if(info.result){
                candidate.text = info.result
            }
 

            if(info.candidate == 0){
                var newCandidate = new Candidate(candidate);
                await newCandidate.save()
            }else{
                await Candidate.findOneAndUpdate({legacyId:info.candidate},candidate)
            }

        }    

        console.log("infos")
    },
    migrateCandidatePromises:async ()=>{
        const promises = await httpCall('candidate/promise')

        for(promise of promises) {

            var candidate = await Candidate.findOne({"info.necId":promise.necId})
            var info = candidate.info;
            info.promises.push({
                title:promise.title,
                content : promise.content
            });

            await Candidate.updateOne({_id:candidate._id},{
                info:info
            })
 

        }    

        console.log("promises")
    },
    migrateResults:async ()=>{
        const results = await httpCall('result')

        for(result of results) {

            var item = await Item.findOne({legacyId:result.item})
//            console.log(item)
//            console.log(item.votes)

            item.votes.push({
                type:result.type,
                votes:result.votes,
                party_id : partyMap[result.party]
            })

            await Item.updateOne({_id:item._id},{votes:item.votes})
        }    

        console.log("results")
    }
    ,
    migrateZones:async ()=>{

        
        mongoose.connection.db.dropCollection("zones")

        const zones = await httpCall('zones')

        for(zone of zones) {
            var newZone = new Zone({
                name: zone.name,
                fullName: zone.fullName,
                code: zone.code,
                population:zone.pop
            });

            await newZone.save();
        }    

        console.log("zones")
    }
    ,
    adjustPartyInfo:async()=>{
        var parties = await Party.find({})
        for(party of parties){
            const infos = []
           
            for (const key of party.infobak.keys()) {
//                console.log(party.infos.get(key))

                infos.push({
                    eleciton_id :key,
                    election : key,
                    link : party.infobak.get(key)
                })
            }

            console.log(infos)
            await Party.updateOne({_id:party._id},{
                infos:infos
            })
        }
    }

}

module.exports = migrationService;