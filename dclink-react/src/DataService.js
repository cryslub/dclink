const host =  "http://localhost:8001/dclink/";
//const host = "";

 const DataService = {
// host: "http://localhost:8001/dclink/",
	host: "",

	// this.host = "";
	// this.host = "http://cryslub.cafe24app.com/ytlink/";


	 getParty :  async () =>{
		 			
		  const res = await  fetch(host+"data/party")
		   
		  return res.json();		    	
			
		},
	 getPartySub :  async () =>{
		 
		  
			
		  const res = await  fetch(host+"data/party/sub")
		   
		  return res.json();		    	
			
	},

	getZone :  async () =>{
			 
			  
			
		  const res = await  fetch(host+"data/zone")
		   
		  return res.json();		    	
			
		},
		
	 getElection :  async () =>{
		 
		  
			
		  const res = await  fetch(host+"data/election")
		   
		  return res.json();		    	
			
		},
 
	
	 getState :  async (election) =>{
		 
			
		  const res = await  fetch(host+"data/state/election/"+election)
		   
		  return res.json();		    	
			
		},

	 getItem :  async (state) =>{
		 
			
		  const res = await  fetch(host+"data/item/state/"+state)
		   
		  return res.json();		    	
			
		},
	 getElectionItem :  async (election) =>{
		 
			
		  const res = await  fetch(host+"data/item/election/"+election)
		   
		  return res.json();		    	
			
		},
		
	getCandidate :  async (state) =>{
		 
		
	  const res = await  fetch(host+"data/candidate/state/"+state)
	   
	  return res.json();		    	
		
	},

	getSub :  async (state) =>{
	 
	
		const res = await  fetch(host+"data/sub/state/"+state)
	   
		return res.json();		    	
		
	},
 
	
	search :  async (name) =>{
		 
		
		  const res = await  fetch(host+"data/search/name/"+name)
		   
		  return res.json();		    	
			
		},	
	getHistory :  async (person) =>{
		 
		
	  const res = await  fetch(host+"data/history/person/"+person)
	   
	  return res.json();		    	
		
	},
	getInspection :  async (person) =>{
		 
		
	  const res = await  fetch(host+"data/inspection/person/"+person)
	   
	  return res.json();		    	
		
	},

	getZoneHistory :  async (zone) =>{
		 
		
		  const res = await  fetch(host+"data/history/zone/"+zone)
		   
		  return res.json();		    	
			
	},
	getZoneCandidate :  async (zone) =>{
		 
		
		  const res = await  fetch(host+"data/candidate/zone/"+zone)
		   
		  return res.json();		    	
			
	},
	getZoneCouncil :  async (zone) =>{
		 
		
		  const res = await  fetch(host+"data/council/zone/"+zone)
		   
		  return res.json();		    	
			
	},

	getCouncil :  async (state) =>{
		 
		
		  const res = await  fetch(host+"data/council/state/"+state)
		   
		  return res.json();		    	
			
	},
	getRates :  async (election) =>{
		 
		
		  const res = await  fetch(host+"data/rates/election/"+election)
		   
		  return res.json();		    	
			
	},
	getProportion :  async (election) =>{
		 
		
		  const res = await  fetch(host+"data/proportion/election/"+election)
		   
		  return res.json();		    	
			
	}
	
	
}
 
 
 export default DataService