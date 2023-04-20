package com.dclink.pojo;

public class Result {
	int id;
	String date;
	String type;
	String ward;
	String partyName;
	String candidateName;
	String state;
	int votes;
	
	public Result() {
		
	}
	
	public Result(String date,String type,String ward,String partyName, String candidateName, int votes,String state) {
		this.date = date;
		this.type = type;
		this.ward = ward;
		this.partyName = partyName;
		this.candidateName = candidateName;
		this.votes = votes;
		this.state = state;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getWard() {
		return ward;
	}

	public void setWard(String ward) {
		this.ward = ward;
	}

	public String getPartyName() {
		return partyName;
	}

	public void setPartyName(String partyName) {
		this.partyName = partyName;
	}

	public String getCandidateName() {
		return candidateName;
	}

	public void setCandidateName(String candidateName) {
		this.candidateName = candidateName;
	}

	public int getVotes() {
		return votes;
	}

	public void setVotes(int votes) {
		this.votes = votes;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
	
	
	
}
