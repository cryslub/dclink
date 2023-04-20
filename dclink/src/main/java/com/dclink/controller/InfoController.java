package com.dclink.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.boot.json.JsonParser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dclink.mapper.MainMapper;
import com.dclink.pojo.CandidateInfo;
import com.dclink.pojo.Promise;
import com.dclink.pojo.Result;

@Controller
@RequestMapping("/info")
public class InfoController {
	
	@Autowired
	MainMapper mainMapper;
	
	static String serviceKey = "UnzspBgKJo5J8lqwYJz5k3rXuoZN7hvxnox8ik2V2Emb%2FMp2EGvSyX00DHvjddhof%2FIyaCOWfTXYPHjR585XvA%3D%3D";
	

	
	@RequestMapping(value ="/getInfo.do", produces = "application/json;charset=UTF-8")
	public @ResponseBody String getInfo(@RequestParam(value="type", required=false) String type,@RequestParam(value="state", required=false) String state,@RequestParam(value="date", required=false) String date) throws IOException, KeyManagementException, NoSuchAlgorithmException {
		
		

		String sdNameParam = "";
		if(state!=null) sdNameParam="&sdName="+URLEncoder.encode(state, StandardCharsets.UTF_8.toString());
		
		String address = "https://apis.data.go.kr/9760000/PofelcddInfoInqireService/getPofelcddRegistSttusInfoInqire?serviceKey="+serviceKey
				+"&pageNo=1&numOfRows=1000&sgId="+date+sdNameParam+"&sgTypecode="+type+"&resultType=json";
		
		
		
		
		Map<String,Object> parsed = httpCall(address);
		Map<String,Object> getPofelcddRegistSttusInfoInqire = (Map<String, Object>) parsed.get("getPofelcddRegistSttusInfoInqire");
		List<Map<String,Object>> item = (List<Map<String, Object>>) getPofelcddRegistSttusInfoInqire.get("item");
		for(Map<String,Object> i : item) {
			CandidateInfo info = mainMapper.getCandidateInfoByNecId((String)i.get("HUBOID"));
			if(info==null) {
				mainMapper.addCandidateInfo(i);
//				mainMapper.addResult(i);
			}

			try {
				getPromise(date,type,(String)i.get("HUBOID"));
			}catch(Exception e) {
				
			}
		}
		
        
        return "done";
		
    }
	
	
	public void getPromise(String date, String type, String necId) throws KeyManagementException, NoSuchAlgorithmException, IOException {
		String address = "https://apis.data.go.kr/9760000/ElecPrmsInfoInqireService/getCnddtElecPrmsInfoInqire?serviceKey="+serviceKey
				+"&pageNo=1&numOfRows=1000&sgId="+date+"&sgTypecode="+type+"&resultType=json&cnddtId="+necId;
		Map<String,Object> parsed = httpCall(address);
		Map<String,Object> getCnddtElecPrmsInfoInqire = (Map<String, Object>) parsed.get("getCnddtElecPrmsInfoInqire");
		List<Map<String,Object>> items = (List<Map<String, Object>>) getCnddtElecPrmsInfoInqire.get("item");
		for(Map<String,Object> item : items) {
			for(int i = 1 ;i<=10;i++) {
				String title = (String)item.get("prmsTitle"+i);
				if(!"".equals(title)&&title!=null) {
					String content = (String)item.get("prmmCont"+i);
					Promise promise = new Promise(necId,title,content);
					mainMapper.addPromise(promise);
				}
			}
		}
	}
	
	@RequestMapping(value ="/getResult.do", produces = "application/json;charset=UTF-8")
	public @ResponseBody String getResult(@RequestParam(value="type", required=false) String type,@RequestParam(value="state", required=false) String state,@RequestParam(value="date", required=false) String date) throws IOException, KeyManagementException, NoSuchAlgorithmException {
		
		

		String sdNameParam = "";
		if(state!=null) sdNameParam="&sdName="+URLEncoder.encode(state, StandardCharsets.UTF_8.toString());
		
		String address = "https://apis.data.go.kr/9760000/VoteXmntckInfoInqireService2/getXmntckSttusInfoInqire?serviceKey="+serviceKey
				+"&pageNo=1&numOfRows=1000&sgId="+date+sdNameParam+"&sgTypecode="+type+"&resultType=json&wiwName="+URLEncoder.encode("합계", StandardCharsets.UTF_8.toString());
		
		
		Map<String,Object> parsed = httpCall(address);
		Map<String,Object> getXmntckSttusInfoInqire = (Map<String, Object>) parsed.get("getXmntckSttusInfoInqire");
		List<Map<String,Object>> items = (List<Map<String, Object>>) getXmntckSttusInfoInqire.get("item");
		for(Map<String,Object> item : items) {
			String ward = (String)item.get("SGG_NAME");
			
			for(int i = 1 ;i<=50;i++) {
				String index = padLeftZeros(i+"",2);
//				System.out.println(index);
				String candidateName = (String)item.get("HBJ"+index);
				if(candidateName!="") {
					String partyName = (String)item.get("JD"+index);					
					int votes = Integer.parseInt((String)item.get("DUGSU"+index));					
					Result result = new Result(date,type,ward,partyName,candidateName,votes,state);
					if("8".equals(type) || "9".equals(type)) {
						mainMapper.insertResult(result);
					}else if("2".equals(type) || "3".equals(type) || "4".equals(type)|| "11".equals(type)) {
						mainMapper.updateCandidateVotes(result);						
					}else {
						mainMapper.updateVotes(result);
					}
				}
			}
		}

		
		
		address = "https://apis.data.go.kr/9760000/WinnerInfoInqireService2/getWinnerInfoInqire?serviceKey="+serviceKey
				+"&pageNo=1&numOfRows=1000&sgId="+date+sdNameParam+"&sgTypecode="+type+"&resultType=json&wiwName="+URLEncoder.encode("합계", StandardCharsets.UTF_8.toString());
		
		
		parsed = httpCall(address);
		Map<String,Object> getWinnerInfoInqire = (Map<String, Object>) parsed.get("getWinnerInfoInqire");
		items = (List<Map<String, Object>>) getWinnerInfoInqire.get("item");
		for(Map<String,Object> item : items) {
			if("2".equals(type) || "3".equals(type) || "4".equals(type)|| "11".equals(type)) {				
				mainMapper.setCandidateElected(item);
			}else {
				mainMapper.setElected(item);				
			}
		}

		
        return "done";
		
    }
	

	@RequestMapping(value ="/getElected.do", produces = "application/json;charset=UTF-8")
	public @ResponseBody String getElected(@RequestParam(value="type", required=false) String type,@RequestParam(value="state", required=false) String state,@RequestParam(value="date", required=false) String date) throws IOException, KeyManagementException, NoSuchAlgorithmException {
		
		

		String sdNameParam = "";
		if(state!=null) sdNameParam="&sdName="+URLEncoder.encode(state, StandardCharsets.UTF_8.toString());
		
		String address = "https://apis.data.go.kr/9760000/WinnerInfoInqireService2/getWinnerInfoInqire?serviceKey="+serviceKey
				+"&pageNo=1&numOfRows=1000&sgId="+date+sdNameParam+"&sgTypecode="+type+"&resultType=json&wiwName="+URLEncoder.encode("합계", StandardCharsets.UTF_8.toString());
		
		
		Map<String,Object> parsed = httpCall(address);
		Map<String,Object> getWinnerInfoInqire = (Map<String, Object>) parsed.get("getWinnerInfoInqire");
		List<Map<String,Object>> items = (List<Map<String, Object>>) getWinnerInfoInqire.get("item");
		for(Map<String,Object> item : items) {
			mainMapper.setElected(item);
		}
        
		
        return "done";
		
    }
	
	
	public String padLeftZeros(String inputString, int length) {
	    if (inputString.length() >= length) {
	        return inputString;
	    }
	    StringBuilder sb = new StringBuilder();
	    while (sb.length() < length - inputString.length()) {
	        sb.append('0');
	    }
	    sb.append(inputString);

	    return sb.toString();
	}
	
	
	private Map<String,Object> httpCall(String address) throws NoSuchAlgorithmException, KeyManagementException, IOException {
		 // Create a trust manager that does not validate certificate chains
        TrustManager[] trustAllCerts = new TrustManager[] {new X509TrustManager() {
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }
                public void checkClientTrusted(X509Certificate[] certs, String authType) {
                }
                public void checkServerTrusted(X509Certificate[] certs, String authType) {
                }
            }
        };
 
        // Install the all-trusting trust manager
        SSLContext sc = SSLContext.getInstance("SSL");
        sc.init(null, trustAllCerts, new java.security.SecureRandom());
        HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
 
        // Create all-trusting host name verifier
        HostnameVerifier allHostsValid = new HostnameVerifier() {
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };
 
        // Install the all-trusting host verifier
        HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
 

		
		
		System.out.println(address);
		
		
		
		URL url = new URL(address);
		HttpsURLConnection con = (HttpsURLConnection) url.openConnection();
		con.setRequestMethod("GET");
		int status = con.getResponseCode();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(con.getInputStream()));
		String inputLine;
		String content ="";
//		StringBuffer content = new StringBuffer();
		while ((inputLine = in.readLine()) != null) {
			content+=inputLine;
//				content.append(inputLine);
		}
		in.close();
				
		con.disconnect();
		
		String json = content.toString();

		JsonParser parser = new JacksonJsonParser();
		
		return parser.parseMap(json);		
		
	}
	
	@RequestMapping(value ="/match.do", produces = "application/json;charset=UTF-8")
	public @ResponseBody String match(@RequestParam(value="election", required=false) int election) {
		
		
	
		
		mainMapper.matchPresident(election);

		matchCongress(election);
//		mainMapper.matchCongress(election);
//		mainMapper.matchProportional(election);
		
		mainMapper.matchMetro(election);
		
		mainMapper.matchBasic(election);
		
		mainMapper.matchEdu(election);
		
		mainMapper.matchParty(election);
		
		mainMapper.matchItem(election);
		mainMapper.matchByItem(election);
		
		
		
		mainMapper.matchMetroItem(election);

		mainMapper.matchResult(election);
		
		mainMapper.matchResultItem(election);
		mainMapper.matchMetroResultItem(election);
		
		
		mainMapper.matchPerson(election);
		mainMapper.matchPresidentialPerson(election);
//		mainMapper.matchCandidate(election);
		
		
		return "done";
	}
	
	private void matchCongress(int election) {
		
		Pattern pattern = Pattern.compile("[^\\x00-\\x7F]+시|[^\\x00-\\x7F]+군|[^\\x00-\\x7F]+구");
		
		List<CandidateInfo> candidateInfos = mainMapper.getCandidateInfoByElection(election);
		for(CandidateInfo candidateInfo : candidateInfos) {

			String ward= candidateInfo.getWard();

			ward = ward.replace("특별자치시", "");
			
			if(ward.length()>2) {

				List<String> allMatches = new ArrayList<String>();
				
				int pivot = 0;
				for(int i=3;i<=ward.length();i++) {
					String sub = ward.substring(pivot,i);
	
					 
					
					 java.util.regex.Matcher m = Pattern.compile("[^\\\\x00-\\\\x7F]+시|[^\\\\x00-\\\\x7F]+군|[^\\\\x00-\\\\x7F]+구")
						     .matcher(sub);
					 
					 if(m.find()) {
						 String result = m.group();
						 if(!"양구".equals(result)) {
							 allMatches.add(result);
							 pivot+= result.length();
						 }
					 }	
				}

				for(String name : allMatches) {
					if(name.length()>2) {
						ward = ward.replace(name, name.substring(0,name.length()-1));
					}
				}					

				
				
				
			}
			candidateInfo.setWard(ward);
			
			mainMapper.matchCongress(candidateInfo);
			 
			
		}
		
	}

}