package com.dclink.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class MainController {

	@RequestMapping("/main.do")
	public String index() {
        return "index";
    }
	
	@RequestMapping("/admin.do")
	public String admin() {
        return "admin";
    }
	
	@RequestMapping("/meta.do")
	public String meta() {
        return "meta";
    }
	
	@RequestMapping("/test.do")
	public String test() {
        return "test";
    }
	
	@RequestMapping("/makeFile.do")
	public String makeFile() {
        return "makeFile";
    }
	
		

}