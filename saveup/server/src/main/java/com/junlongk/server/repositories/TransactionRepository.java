package com.junlongk.server.repositories;

import com.junlongk.server.Utils;
import com.junlongk.server.models.Transaction;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndReplaceOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
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

    public Optional<List<Transaction>> getAllTransactions(String userId) {
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

//        LimitOperation limitResult = Aggregation.limit(limit);
//
//        SkipOperation skipResult = Aggregation.skip(skip);

        Aggregation pipeline = Aggregation.newAggregation(matchResult,
                sortResult);

        AggregationResults<Document> results = template.aggregate(
                pipeline, COLLECTION_TRANSACTIONS, Document.class);

        if (results.getMappedResults().isEmpty())
            return Optional.empty();
        else
            return Optional.of(results.getMappedResults().stream()
                .map(Utils::docToTransaction)
                .toList());
    }

    public Transaction modifyTransaction(
            String transactionId, Transaction transaction) {
        Query query = Query.query(
                Criteria.where(FIELD_TRANSACTION_ID).is(transactionId));

        FindAndReplaceOptions options = new FindAndReplaceOptions()
                .upsert().returnNew();

        // convert transaction to Document, so that date can be formatted properly
        Document doc = Utils.transactionToDoc(transaction);

        return template.findAndReplace(query, doc, options,
                Document.class, COLLECTION_TRANSACTIONS, Transaction.class);
    }

    public Transaction deleteTransaction(String transactionId) {
        Query query = Query.query(
                Criteria.where(FIELD_TRANSACTION_ID).is(transactionId));

        return template.findAndRemove(
                query, Transaction.class, COLLECTION_TRANSACTIONS);
    }

    // used for validating transactionId for update & delete operations
    //
    //    db.transactions.findOne(
    //        { transactionId: "fd12d477-f346-4faa-8efc-fb1a7d8ee02f" },
    //        { _id: 0, userId: 1 }
    //    )
    public String getUserIdFromTransactionId(String transactionId) {
        Query query = Query.query(
                Criteria.where(FIELD_TRANSACTION_ID).is(transactionId));

        query.fields()
                .exclude(FIELD_UNDERSCORE_ID)
                .include(FIELD_USER_ID);

        return template.findOne(query, Document.class, COLLECTION_TRANSACTIONS)
                .getString(FIELD_USER_ID);
    }

    public int updateAccountName(String accountId, String newAccountName) {
        Query query = Query.query(
                Criteria.where(FIELD_ACCOUNT_ID).is(accountId));

        Update updateOps = new Update()
                .set(FIELD_ACCOUNT_NAME, newAccountName);

        UpdateResult updateResult = template.updateMulti(
                query, updateOps, Document.class, COLLECTION_TRANSACTIONS);

        return (int) updateResult.getModifiedCount();
    }

    public Optional<String> getAllCategories(String userId) {
        Criteria criteria = Criteria.where(FIELD_USER_ID).is(userId);

        MatchOperation matchResult = Aggregation.match(criteria);

        GroupOperation groupOperation = Aggregation.group()
                .addToSet(FIELD_CATEGORY).as(FIELD_CATEGORIES);

        ProjectionOperation projectResult = Aggregation.project()
                .andExclude(FIELD_UNDERSCORE_ID)
                .andInclude(FIELD_CATEGORIES);

        Aggregation pipeline = Aggregation.newAggregation(matchResult,
                groupOperation, projectResult);

        AggregationResults<String> results = template.aggregate(
                pipeline, COLLECTION_TRANSACTIONS, String.class);

        if (results.getMappedResults().isEmpty())
            return Optional.empty();
        else {
            return Optional.of(results.getMappedResults().get(0));
        }
    }

    public int deleteTransactionByTransferId(String transferId) {
        Query query = Query.query(
                Criteria.where(FIELD_TRANSFER_ID).is(transferId));

        return (int) template.remove(
                query, Transaction.class, COLLECTION_TRANSACTIONS).getDeletedCount();
    }
}