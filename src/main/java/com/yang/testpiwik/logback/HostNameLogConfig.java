package com.yang.testpiwik.logback;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Created by Administrator on 2018/2/24.
 */
public class HostNameLogConfig  extends ClassicConverter {
    @Override
    public String convert(ILoggingEvent event) {
        try {
            return InetAddress.getLocalHost().getHostName().toString();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        return null;
    }
}
