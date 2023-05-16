package com.junlongk.server.configs;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import static com.junlongk.server.Constants.*;

@Configuration
public class MongoConfig {

    @Value("${mongo.url}")
    private String mongoUrl;

    @Bean
    public MongoTemplate createMongoTemplate() {
        // Create a MongoClient with the mongo connection string
        MongoClient client = MongoClients.create(mongoUrl);
        return new MongoTemplate(client, DATABASE_SAVEUP);
    }
}
