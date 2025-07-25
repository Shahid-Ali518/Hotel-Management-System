package com.satech.ourluxuryhotel.configration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud.name}")
    String cloudName;

    @Value("${cloudinary.api.key}")
    String apiKey;

    @Value("${cloudinary.api.key.secret}")
    String apiKeySecret;

    @Bean
    public Cloudinary cloudinary(){

        return new Cloudinary(
                ObjectUtils.asMap(
                        "cloud_name", cloudName,
                        "api_key", apiKey,
                        "api_secret", apiKeySecret,
                        "secure", true
                )
        );
    }

}
