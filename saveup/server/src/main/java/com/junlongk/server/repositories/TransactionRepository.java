package com.junlongk.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import static com.junlongk.server.Constants.*;

@Repository
public class TransactionRepository {

    @Autowired
    private MongoTemplate template;


}
