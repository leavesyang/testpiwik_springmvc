package com.yang.testpiwik.log4j;

import org.apache.log4j.MDC;

import javax.servlet.*;
import java.io.IOException;
import java.net.InetAddress;

/**
 * Created by Administrator on 2018/2/26.
 */
public class Log4jFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        String ip = InetAddress.getLocalHost().getHostAddress().toString();
        String userName = InetAddress.getLocalHost().getHostName().toString();
        MDC.put("ip", ip);
        MDC.put("hostName", userName);
        chain.doFilter(req, res);
        MDC.remove("ip");
        MDC.remove("hostName");
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {
    }

    @Override
    public void destroy() {
    }
}