
//const host =  "/dclink/";

//const host = "http://localhost:8001/dclink/";
const host =  "http://localhost:8080/dclink/";

const getData = async (url) => {
//	 if(isAndroid){
//		 return JSON.parse(window.Android.getData(url))
//	 }else{
		 const res = await  fetch(host+url)
		 return res.json();
//	 }
}

 const DataService = {
	// host: "http://localhost:8001/dclink/",
	//host: "",

	// this.host = "";
	//host = "http://cryslub.cafe24app.com/dclink/";


	 getParty :  async () =>{
		 			
		  const res = await  fetch(host+"data/parties.do")
		   
		  return res.json();		    	
			
		},
	 getPartySub :  async () =>{
		 
		  
			
		  const res = await  fetch(host+"data/party/subs.do")
		   
		  return res.json();		    	
			
	},

	getZone :  async () =>{
			 
			  
			
		  const res = await  fetch(host+"data/zones.do")
		   
		  return res.json();		    	
			
		},
		
	 getElection :  async () =>{
		 
		  
		 	return getData("data/elections.do");
		     	
			
		},
 
	
	 getState :  async (election) =>{
		 
			
		  const res = await  fetch(host+"data/state/election/"+election)
		   
		  return res.json();		    	
			
		},
	 getAllState :  async (election) =>{
		 
			
		  const res = await  fetch(host+"data/states.do")
		   
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
		 
		
		  const res = await  fetch(host+"data/search.do?name="+name)
		   
		  return res.json();		    	
			
	},	
	searchInfo :  async (name) =>{
		
	
		const res = await  fetch(host+"data/searchInfo.do?name="+name)
			
		return res.json();		    	
			
	},	
	getHistory :  async (person) =>{
		 
		
	  const res = await  fetch(host+"data/history/person/"+person)
	   
	  return res.json();		    	
		
	},
	getInfoHistory :  async (id) =>{
		 
		
		const res = await  fetch(host+"data/info/"+id+"/history")
		 
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
	getBasicZoneCouncil :  async (zone) =>{
		 
		
		const res = await  fetch(host+"data/council/basic/"+zone)
		 
		return res.json();		    	
		  
	},
	getMetroZoneCouncil :  async (zone) =>{
			
			
		const res = await  fetch(host+"data/council/metro/"+zone)
		
		return res.json();		    	
		
	},
	getZoneRate :  async (zone) =>{
			
			
		const res = await  fetch(host+"data/council/rate/"+zone)
		
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
			
	},
	getCandidateInfo : 	async (type,state) =>{
		 
		
		const res = await  fetch(host+"data/candidate/info/"+state+"/"+type)
		 
		return res.json();		    			  
  	},  
	getResult : 	async (type,state) =>{
		 
		
		const res = await  fetch(host+"data/result/"+state+"/"+type)
		 
		return res.json();		    			  
  	},  
	getPromise : 	async (state) =>{
		 
		
		const res = await  fetch(host+"data/candidate/promise/"+state)
		 
		return res.json();		    			  
  	},  
	
}
 
 
 export default DataService