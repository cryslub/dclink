package com.dclink.pojo;

public class Inspection {

	int id;
	int person = 0;
	int party;
	String txt ="";
	String name = "";
	String link = "";
	String department = "";
	String date = "";
	String type;
	int election;

	public int getParty() {
		return party;
	}
	public void setParty(int party) {
		this.party = party;
	}

	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getPerson() {
		return person;
	}
	public void setPerson(int person) {
		this.person = person;
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
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
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
	public int getElection() {
		return election;
	}
	public void setElection(int election) {
		this.election = election;
	}
	
	
	
}
