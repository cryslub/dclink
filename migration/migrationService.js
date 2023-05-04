const axios = require('axios');

var env = require("./env.js");

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://cryslub:'+env.password+'@cluster0.yna1nar.mongodb.net/dclink?retryWrites=true&w=majority');

var electionSchema = mongoose.Schema({
    name: String,
    type: String,
    result: String,
    date:String,
    legacyId:Number
 });
 var Election = mongoose.model("Election", electionSchema);


 var stateSchema = mongoose.Schema({
    name: String,
    fullName: String,
    election_id : mongoose.Schema.Types.ObjectId,
    election : mongoose.Schema.Types.ObjectId,
    legacyId:Number
 });
 var State = mongoose.model("State", stateSchema);

 
 var partySchema = mongoose.Schema({
    name: String,
    color: String,
    textColor: String,
    infos : Array,
    legacyId:Number
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
    state : mongoose.Schema.Types.ObjectId,
    party: mongoose.Schema.Types.ObjectId,
    election : mongoose.Schema.Types.ObjectId,
    candidate : mongoose.Schema.Types.ObjectId,
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
    person : mongoose.Schema.Types.ObjectId,
    party : mongoose.Schema.Types.ObjectId,
    item : mongoose.Schema.Types.ObjectId,
    state : mongoose.Schema.Types.ObjectId,
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
    },
    subs:Array
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
                date:election.date,
                legacyId:election.id
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
                election_id: electionMap[state.election]._id,
                election: electionMap[state.election]._id,
                legacyId:state.id
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
                infos:[],
                legacyId:party.id
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
            infos.push({
                election_id:election_id,
                link:sub.link
            })
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
                election: election._id,
                state: stateMap[item.state],
                party: partyMap[item.party],
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
                person: personMap[candidate.person],
                state: stateMap[candidate.state],
                party: partyMap[candidate.party],
                item: itemMap[candidate.item],  
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
                candidate.person_id= personMap[info.person]
                candidate.party_id=partyMap[info.party]
                candidate.item_id= itemMap[info.item]
                candidate.person= personMap[info.person]
                candidate.party= partyMap[info.party]
                candidate.item= itemMap[info.item]

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
    migrateCandidateSubs:async ()=>{
        const subs = await httpCall('subsAll')

        for(sub of subs) {

            var candidate = await Candidate.findOne({"legacyId":sub.candidate})
            candidate.subs.push({
                title:sub.txt,
                link : sub.link
            });

            await Candidate.updateOne({_id:candidate._id},{
                subs:candidate.subs
            })
 

        }    

        console.log("subs")
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
    },
    addPresidentialCandidate:async()=>{
        const items = await httpCall('presidentialItems')

        for(item of items){
            const person = await Person.findOne({legacyId:item.person})

            const candidate = await Candidate.findOne(                {
                "info.necDate":item.date,
                "info.necType":"1",
                "info.name":person.name
            })

           // console.log(candidate)

            if(candidate){

               await Item.updateOne({legacyId:item.id},{
                    candidate_id : candidate._id,
                    candidate : candidate._id
                })

                await Candidate.updateOne({_id:candidate._id},
                    {
                        person_id : person._id,
                        votes: item.code,
                        text : item.type
                    }
                )
            }
        }

    }

}

module.exports = migrationService;