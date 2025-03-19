package com.example.shipping_service.configuration;


import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.client.RestTemplate;

@Getter
@Configuration
public class GhtkConfig {

    @Value("${GHTK_API_URL}")
    private String ghtkApiUrl;

    @Value("${GHTK_TOKEN}")
    private String ghtkToken;

    @Value("${GHTK_PARTNER_CODE}")
    private String ghtkPartnerCode;

    @Bean()
    @Primary
    public RestTemplate ghtkRestTemplate() {
        return new RestTemplate();
    }

}

