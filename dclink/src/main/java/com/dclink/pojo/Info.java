package com.dclink.pojo;

public class Info {
	int id;
	String category;
	String date;
	String type;
	String json;
	
	public Info() {
		
	}
	
	public Info(String category, String date,String type,String json) {
		this.category = category;
		this.date = date;
		this.type = type;
		this.type = type;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
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
	public String getJson() {
		return json;
	}
	public void setJson(String json) {
		this.json = json;
	}
	
	
}
