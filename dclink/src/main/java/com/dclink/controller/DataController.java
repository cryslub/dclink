package com.dclink.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dclink.mapper.MainMapper;
import com.dclink.pojo.Candidate;
import com.dclink.pojo.CandidateInfo;
import com.dclink.pojo.Council;
import com.dclink.pojo.Election;
import com.dclink.pojo.History;
import com.dclink.pojo.Inspection;
import com.dclink.pojo.Item;
import com.dclink.pojo.Party;
import com.dclink.pojo.Person;
import com.dclink.pojo.Promise;
import com.dclink.pojo.Rate;
import com.dclink.pojo.State;
import com.dclink.pojo.Sub;
import com.dclink.pojo.Zone;

@CrossOrigin
@Controller
public class DataController {

	@Autowired
	MainMapper mainMapper;
	
	
	@RequestMapping("/elections.do")
	public @ResponseBody List<Election> elections() {
		List<Election> ret = mainMapper.getAllElection();
		
        return ret;
    }

	@RequestMapping("/states.do")
	public @ResponseBody List<State> states(@RequestParam(value="election", required=false) Integer election) {
		List<State> ret = null;
		if(election==null) {
			ret = mainMapper.getAllState();			
		}else {
			ret = mainMapper.getState(election);
		}		
        return ret;
    }

	
	@RequestMapping("/state/election/{election}")
	public @ResponseBody List<State> electionSstates(@PathVariable Integer election) {
		List<State> ret = null;
		ret = mainMapper.getState(election);
			
        return ret;
    }

	@RequestMapping("/persons.do")
	public @ResponseBody List<Person> persons() {
		List<Person> ret = mainMapper.getPerson();
		
        return ret;
    }

	@RequestMapping("/parties.do")
	public @ResponseBody List<Party> parties() {
		List<Party> ret = mainMapper.getParty();
		
        return ret;
    }

	@RequestMapping("/zones.do")
	public @ResponseBody List<Zone> zones() {
		List<Zone> ret = mainMapper.getZone();
		
        return ret;
    }

	
	@RequestMapping("/items.do")
	public @ResponseBody List<Item> items(@RequestParam("state") int state) {
		List<Item> ret = mainMapper.getItem(state);
		
        return ret;
    }

	
	@RequestMapping("/itemsAll.do")
	public @ResponseBody List<Item> itemsAll() {
		List<Item> ret = mainMapper.getItems();
		
        return ret;
    }
	
	@RequestMapping("/item/state/{state}")
	public @ResponseBody List<Item> stateItems(@PathVariable Integer state) {
		List<Item> ret = mainMapper.getItem(state);
        return ret;
    }

	
	@RequestMapping("/item/election/{election}")
	public @ResponseBody List<Item> electionItems(@PathVariable Integer election) {
		List<Item> ret = mainMapper.getElectionItem(election);
        return ret;
    }
	
	
	@RequestMapping("/candidates.do")
	public @ResponseBody List<Candidate> candidates(@RequestParam("state") int state) {
		List<Candidate> ret = mainMapper.getCandidate(state);
		
        return ret;
    }

	@RequestMapping("/candidatesAll.do")
	public @ResponseBody List<Candidate> candidatesAll( ) {
		List<Candidate> ret = mainMapper.getCandidates();
		
        return ret;
    }
	
	
	@RequestMapping("/candidate/state/{state}")
	public @ResponseBody List<Candidate> stateCandidates(@PathVariable Integer state) {
		List<Candidate> ret = mainMapper.getCandidate(state);
        return ret;
    }
	


	@RequestMapping("/candidate/info/{state}/{type}")
	public @ResponseBody List<CandidateInfo> candidateInfo(@PathVariable Integer state,@PathVariable String type) {
		List<CandidateInfo> ret = mainMapper.getCandidateInfo(state,type);
		
        return ret;
    }
	
	@RequestMapping("/candidate/info.do")
	public @ResponseBody List<CandidateInfo> candidateInfoAll( ) {
		List<CandidateInfo> ret = mainMapper.getCandidateInfos();
		
        return ret;
    }

	@RequestMapping("/candidate/promise/{state}")
	public @ResponseBody List<Promise> promise(@PathVariable Integer state) {
		List<Promise> ret = mainMapper.getPromise(state);
		
        return ret;
    }

	@RequestMapping("/candidate/promise.do")
	public @ResponseBody List<Promise> promiseAll( ) {
		List<Promise> ret = mainMapper.getPromises();
		
        return ret;
    }
	
	
	@RequestMapping("/result/{state}/{type}")
	public @ResponseBody List<CandidateInfo> result(@PathVariable Integer state,@PathVariable String type) {
		List<CandidateInfo> ret = mainMapper.getResult(state,type);
		
        return ret;
    }

	@RequestMapping("/result.do")
	public @ResponseBody List<CandidateInfo> resultAll() {
		List<CandidateInfo> ret = mainMapper.getResults();
		
        return ret;
    }	
	
	@RequestMapping("/councils.do")
	public @ResponseBody List<Council> councils(@RequestParam("state") int state) {
		List<Council> ret = mainMapper.getCouncil(state);
		
        return ret;
    }


	@RequestMapping("/council/state/{state}")
	public @ResponseBody List<Council> stateCouncils(@PathVariable Integer state) {
		List<Council> ret = mainMapper.getCouncil(state);
        return ret;
    }
	
	
	@RequestMapping("/zoneCandidates.do")
	public @ResponseBody List<Candidate> zoneCandidates(@RequestParam("zone") String zone) {
		List<Candidate> ret = mainMapper.getZoneCandidate(zone);
		
        return ret;
    }

	
	@RequestMapping("/candidate/zone/{zone}")
	public @ResponseBody List<Candidate> getZoneCandidate(@PathVariable String zone) {
		List<Candidate> ret = mainMapper.getZoneCandidate(zone);
        return ret;
    }
	
	
	@RequestMapping("/zoneCouncils.do")
	public @ResponseBody List<Council> zoneCouncils(@RequestParam("zone") String zone) {
		List<Council> ret = mainMapper.getZoneCouncil(zone);
		
        return ret;
    }
	
	
	@RequestMapping("/council/zone/{zone}")
	public @ResponseBody List<Council> getZoneCouncil(@PathVariable String zone) {
		List<Council> ret = mainMapper.getZoneCouncil(zone);
        return ret;
    }
	
	@RequestMapping("/council/basic/{zone}")
	public @ResponseBody List<Council> getBasicZoneCouncil(@PathVariable String zone) {
		List<Council> ret = mainMapper.getBasicZoneCouncil(zone);
        return ret;
    }
	@RequestMapping("/council/metro/{zone}")
	public @ResponseBody List<Council> getMetroZoneCouncil(@PathVariable String zone) {
		List<Council> ret = mainMapper.getMetroZoneCouncil(zone);
        return ret;
    }

	@RequestMapping("/council/rate/{zone}")
	public @ResponseBody List<Council> getZoneRate(@PathVariable String zone) {
		List<Council> ret = mainMapper.getZoneRate(zone);
        return ret;
    }
	
	@RequestMapping("/party/subs.do")
	public @ResponseBody List<Sub> partySubs() {
		List<Sub> ret = mainMapper.getPartySubs();
		
        return ret;
    }

	@RequestMapping("/subs.do")
	public @ResponseBody List<Sub> subs(@RequestParam("candidate") int candidate) {
		List<Sub> ret = mainMapper.getSubs(candidate);
		
        return ret;
    }
	
	@RequestMapping("/subsAll.do")
	public @ResponseBody List<Sub> subsAll() {
		List<Sub> ret = mainMapper.getSubsAll();
		
        return ret;
    }

	
	@RequestMapping("/sub/state/{state}")
	public @ResponseBody List<Sub> stateSubs(@PathVariable Integer state) {
		List<Sub> ret = mainMapper.getStateSubs(state);
        return ret;
    }
	
	@RequestMapping("/history.do")
	public @ResponseBody List<History> history(@RequestParam("person") int person) {
		List<History> ret = mainMapper.getHistory(person);
		
        return ret;
    }

	
	@RequestMapping("/info/{id}/history")
	public @ResponseBody List<History> infoHistory(@PathVariable String id) {
		List<History> ret = mainMapper.getInfoHistory(id);
		
        return ret;
    }
	
	@RequestMapping("/history/person/{person}")
	public @ResponseBody List<History> personHistory(@PathVariable int person) {
		List<History> ret = mainMapper.getHistory(person);
        return ret;
    }
	
	
	
	@RequestMapping("/zoneHistory.do")
	public @ResponseBody List<Item> zoneHistory(@RequestParam("code") String code) {
		List<Item> ret = mainMapper.getZoneHistory(code);
		
        return ret;
    }

	
	@RequestMapping("/history/zone/{zone}")
	public @ResponseBody List<Item> getZoneHistory(@PathVariable String zone) {
		List<Item> ret = mainMapper.getZoneHistory(zone);
        return ret;
    }
	
	@RequestMapping(value="/inspection.do",method=RequestMethod.GET,params={"person"})
	public @ResponseBody List<Inspection> inspection(@RequestParam("person") int person) {
		List<Inspection> ret = mainMapper.getInspection(person);
		
        return ret;
    }
	
	@RequestMapping("/inspection/person/{person}")
	public @ResponseBody List<Inspection> personInspection(@PathVariable int person) {
		List<Inspection> ret = mainMapper.getInspection(person);
        return ret;
    }
	
	
	
	
	@RequestMapping(value="/inspection.do",method=RequestMethod.GET,params={})
	public @ResponseBody List<Inspection> allInspection() {
		List<Inspection> ret = mainMapper.getAllInspections();
		
        return ret;
    }

	
	@RequestMapping(value="/search.do")
	public @ResponseBody List<History> search(@RequestParam("name") String name) {
		List<History> ret = mainMapper.search(name);
		
        return ret;
    }
	
	@RequestMapping(value="/searchInfo.do")
	public @ResponseBody List<CandidateInfo> searchInfo(@RequestParam("name") String name) {
		List<CandidateInfo> ret = mainMapper.searchInfo(name);
		
        return ret;
    }
	
	@RequestMapping("/search/name/{name}")
	public @ResponseBody List<History> searchName(@PathVariable String name) {
		List<History> ret = mainMapper.search(name);
        return ret;
    }
	
	
	
	@RequestMapping(value="/rates.do")
	public @ResponseBody List<Rate> rates(@RequestParam("election") int election) {
		List<Rate> ret = mainMapper.getRates(election);
		
        return ret;
    }
	
	@RequestMapping("/rates/election/{election}")
	public @ResponseBody List<Rate> electionRates(@PathVariable int election) {
		List<Rate> ret = mainMapper.getRates(election);
        return ret;
    }
	
	@RequestMapping("/proportion/election/{election}")
	public @ResponseBody List<Rate> proportions(@PathVariable int election) {
		List<Rate> ret = mainMapper.getProportion(election);
        return ret;
    }
	
	
	@RequestMapping(value="/rrates.do")
	public @ResponseBody List<Rate> rrates(@RequestParam("election") int election) {
		List<Rate> ret = mainMapper.getRRates(election);
		
        return ret;
    }
	
	@RequestMapping(value="/photo.do",method=RequestMethod.PUT)
	public @ResponseBody String photo(@RequestBody int id) {
		mainMapper.photo(id);
		
        return "";
    }

	
	
	@RequestMapping(value="/item.do",method=RequestMethod.POST)
	public @ResponseBody String addItem(@RequestBody State state) {
		mainMapper.addItem(state);
		
        return "";
    }

	@RequestMapping(value="/item.do",method=RequestMethod.PUT)
	public @ResponseBody String editItem(@RequestBody Item item) {
		mainMapper.editItem(item);
		
        return "";
    }

	
	
	@RequestMapping(value="/candidate.do",method=RequestMethod.POST)
	public @ResponseBody String addCandidate(@RequestBody Item item) {
		mainMapper.addCandidate(item);
		
        return "";
    }
	
	@RequestMapping(value="/candidate.do",method=RequestMethod.PUT)
	public @ResponseBody String editCandidate(@RequestBody Candidate candidate) {
		mainMapper.editCandidate(candidate);
		
        return "";
    }
	
	
	@RequestMapping(value="/council.do",method=RequestMethod.POST)
	public @ResponseBody String addCouncil(@RequestBody Item item) {
		mainMapper.addCouncil(item);
		
        return "";
    }
	
	
	
	@RequestMapping(value="/council.do",method=RequestMethod.PUT)
	public @ResponseBody String editCouncil(@RequestBody Council council) {
		mainMapper.editCouncil(council);
		
        return "";
    }
	
	@RequestMapping(value="/person.do",method=RequestMethod.POST)
	public @ResponseBody String addPerson(@RequestBody Person person) {
		mainMapper.addPerson(person);
		
        return "";
    }
	
	@RequestMapping(value="/party.do",method=RequestMethod.POST)
	public @ResponseBody String addParty(@RequestBody Party party) {
		mainMapper.addParty(party);
		
        return "";
    }
	
	@RequestMapping(value="/zone.do",method=RequestMethod.POST)
	public @ResponseBody String addZone(@RequestBody Zone zone) {
		mainMapper.addZone(zone);
		
        return "";
    }

	
	@RequestMapping(value="/inspection.do",method=RequestMethod.POST)
	public @ResponseBody String addInspection() {
		
		mainMapper.addInspection(new Inspection());
		
        return "";
    }

	@RequestMapping(value="/copy.do",method=RequestMethod.POST)
	public @ResponseBody String copy(@RequestBody Inspection inspection) {
		mainMapper.addInspection(inspection);
		
        return "";
    }

	@RequestMapping(value="/inspection.do",method=RequestMethod.PUT)
	public @ResponseBody String editInspection(@RequestBody Inspection inspection) {
		mainMapper.editInspection(inspection);
		
        return "";
    }

	
	@RequestMapping(value="/sub.do",method=RequestMethod.POST)
	public @ResponseBody String addSub(@RequestBody Candidate candidate) {
		mainMapper.addSub(candidate.getId());
		
        return "";
    }
	
	@RequestMapping(value="/sub.do",method=RequestMethod.PUT)
	public @ResponseBody String editSub(@RequestBody Sub sub) {
		mainMapper.editSub(sub);
		
        return "";
    }

	
	
}