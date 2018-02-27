package com.yang.testpiwik.web;

/**
 * Created by Administrator on 2018/2/27.
 */

import com.yang.testpiwik.util.ApiService;
import org.apache.http.client.ClientProtocolException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Controller
@RequestMapping
public class IndexController {


    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private org.apache.log4j.Logger log4j = org.apache.log4j.Logger.getLogger(this.getClass().getName());
    private org.slf4j.Logger logback = org.slf4j.LoggerFactory.getLogger(IndexController.class);

    @Autowired
    ApiService apiService;

    @RequestMapping("/index")
    public String list(HttpServletRequest request) {
        return "index";
    }


    @RequestMapping("/test")
    @ResponseBody
    public Map<String, String> test(String hostPort) {
        if (hostPort != null && hostPort.length() != 0) {
            if (hostPort.split(":")[0].split("\\.").length == 4) return test1(hostPort);
        }
        return test2();
    }

    private Map<String, String> test1(String hostPort) {
        log4j.info("继续请求远程应用：" + hostPort);
        logback.info("继续请求远程应用：" + hostPort);
        try {
            String res = apiService.doGet("http://" + hostPort + "/web/test");
            log4j.info("继续请求结果：" + res);
            log4j.info("PtxId: " + org.apache.log4j.MDC.get("PtxId"));
            log4j.info("PspanId: " + org.apache.log4j.MDC.get("PspanId"));

            logback.info("继续请求结果：" + res);
            logback.info("PtxId: " + org.slf4j.MDC.get("PtxId"));
            logback.info("PspanId: " + org.slf4j.MDC.get("PspanId"));
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        Map<String, String> dataMap = new HashMap<String, String>();
        dataMap.put("state", "success " + sdf.format(new Date()));
        dataMap.put("msg", org.apache.log4j.MDC.get("PtxId") == null ? (String) org.slf4j.MDC.get("PtxId") : (String) org.apache.log4j.MDC.get("PtxId"));
        return dataMap;
    }

    public Map<String, String> test2() {
        log4j.info("直接处理请求！");
        log4j.info("PtxId: " + org.apache.log4j.MDC.get("PtxId"));
        log4j.info("PspanId: " + org.apache.log4j.MDC.get("PspanId"));

        logback.info("直接处理请求！");
        logback.info("PtxId: " + org.slf4j.MDC.get("PtxId"));
        logback.info("PspanId: " + org.slf4j.MDC.get("PspanId"));
        Map<String, String> dataMap = new HashMap<String, String>();
        dataMap.put("state", "success " + sdf.format(new Date()));
        dataMap.put("msg", org.apache.log4j.MDC.get("PtxId") == null ? (String) org.slf4j.MDC.get("PtxId") : (String) org.apache.log4j.MDC.get("PtxId"));
        return dataMap;
    }

}
