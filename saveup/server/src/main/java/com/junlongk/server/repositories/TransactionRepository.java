package com.junlongk.server.repositories;

import com.junlongk.server.Utils;
import com.junlongk.server.models.Transaction;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.junlongk.server.Constants.*;

@Repository
public class TransactionRepository {

    @Autowired
    private MongoTemplate template;

    public void addTransaction(Transaction transaction) {
        Document doc = Utils.transactionToDoc(transaction);
        template.insert(doc, COLLECTION_TRANSACTIONS);
    }

    public Optional<List<Transaction>> getAllTransactions(
            String userId, int limit, int skip) {
        Criteria criteria = Criteria.where(FIELD_USER_ID).is(userId);

        MatchOperation matchResult = Aggregation.match(criteria);

//        ProjectionOperation projectResult = Aggregation.project()
//                .andExclude(FIELD_UNDERSCORE_ID, FIELD_USER_ID)
//                .andInclude(FIELD_TRANSACTION_ID, FIELD_ACCOUNT_ID,
//                        FIELD_ACCOUNT_NAME, FIELD_DATE, FIELD_PAYEE,
//                        FIELD_PAYEE_ACCOUNT_ID, FIELD_PAYEE_ACCOUNT_NAME,
//                        FIELD_ENVELOPE_ID, FIELD_ENVELOPE_NAME, FIELD_MEMO,
//                        FIELD_OUTFLOW, FIELD_INFLOW);

        SortOperation sortResult = Aggregation.sort(Sort.Direction.DESC, FIELD_DATE);

        LimitOperation limitResult = Aggregation.limit(limit);

        SkipOperation skipResult = Aggregation.skip(skip);

        Aggregation pipeline = Aggregation.newAggregation(matchResult,
                sortResult, limitResult, skipResult);

        AggregationResults<Document> results = template.aggregate(
                pipeline, COLLECTION_TRANSACTIONS, Document.class);

        if (results.getMappedResults().isEmpty())
            return Optional.empty();
        else
            return Optional.of(results.getMappedResults().stream()
                .map(Utils::docToTransaction)
                .toList());
    }
}
