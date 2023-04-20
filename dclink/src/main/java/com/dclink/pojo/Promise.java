package com.dclink.pojo;

public class Promise {

	String necId;
	String title;
	String content;
	int candidate;
	
	public Promise() {
		// TODO Auto-generated constructor stub
	}
	
	public Promise(String necId, String title, String content) {
		// TODO Auto-generated constructor stub
		this.necId = necId;
		this.title = title;
		this.content = content;
	}
	public String getNecId() {
		return necId;
	}
	public void setNecId(String necId) {
		this.necId = necId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public int getCandidate() {
		return candidate;
	}
	public void setCandidate(int candidate) {
		this.candidate = candidate;
	}
	
	
}
