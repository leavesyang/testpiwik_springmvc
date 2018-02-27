package com.yang.testpiwik.util;

/**
 * http执行post请求返回的封装类
 * 
 * @author huangyk Created on 2016年12月2日 下午3:38:27
 */
public class HttpResult {

	private Integer code;

	private String body;

	public HttpResult() {

	}

	public HttpResult(Integer code, String body) {
		this.code = code;
		this.body = body;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

}
