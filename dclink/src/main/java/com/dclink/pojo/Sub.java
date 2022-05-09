package com.dclink.pojo;

import java.util.List;

public class Sub {
	
	int id;
	String txt;
	String link;
	int state;
	int party;
	int person;
	int candidate;
	int election;
	
	List<Candidate> candidates;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}

	
	
	public String getTxt() {
		return txt;
	}
	public void setTxt(String txt) {
		this.txt = txt;
	}
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public int getParty() {
		return party;
	}
	public void setParty(int party) {
		this.party = party;
	}
	public List<Candidate> getCandidates() {
		return candidates;
	}
	public void setCandidates(List<Candidate> candidates) {
		this.candidates = candidates;
	}
	public int getPerson() {
		return person;
	}
	public void setPerson(int person) {
		this.person = person;
	}
	public int getCandidate() {
		return candidate;
	}
	public void setCandidate(int candidate) {
		this.candidate = candidate;
	}
	public int getElection() {
		return election;
	}
	public void setElection(int election) {
		this.election = election;
	}
	
	
}
