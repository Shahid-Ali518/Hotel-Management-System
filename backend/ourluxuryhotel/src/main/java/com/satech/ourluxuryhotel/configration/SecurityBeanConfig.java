package com.satech.ourluxuryhotel.configration;

import com.satech.ourluxuryhotel.service.CustomUserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.CachingUserDetailsService;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collections;

@Configuration
public class SecurityBeanConfig {


    @Autowired
    CustomUserDetailService customUserDetailService;

    // to implement caching user details
    @Bean
    public CachingUserDetailsService cachingUserDetailsService(UserDetailsService userDetailsService) {
        return new CachingUserDetailsService(customUserDetailService);
    }

}
