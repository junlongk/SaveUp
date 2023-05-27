package com.junlongk.server;

import com.junlongk.server.models.Account;
import com.junlongk.server.models.Transaction;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.bson.Document;

import java.math.BigDecimal;
import java.time.LocalDate;

import static com.junlongk.server.Constants.*;

public class Utils {

    public static JsonObject accountToJson(Account account) {
        return Json.createObjectBuilder()
                .add("accountId", account.getAccountId())
                .add("accountName", account.getAccountName())
                .add("balance", account.getBalance())
                .build();
    }

    public static JsonObject transactionToJson(Transaction transaction) {
        return Json.createObjectBuilder()
                .add("transactionId", transaction.getTransactionId())
                .add("accountId", transaction.getAccountId())
                .add("accountName", transaction.getAccountName())
                .add("date", String.valueOf(transaction.getDate()))
                .add("payee", transaction.getPayee())
                .add("payeeAccountId", transaction.getPayeeAccountId())
                .add("payeeAccountName", transaction.getPayeeAccountName())
                .add("envelopeId", transaction.getEnvelopeId())
                .add("envelopeName", transaction.getEnvelopeName())
                .add("memo", transaction.getMemo())
                .add("outflow", transaction.getOutflow())
                .add("inflow", transaction.getInflow())
                .build();
    }

    public static Document transactionToDoc(Transaction transaction) {
        Document document = new Document();
        document.put("transactionId", transaction.getTransactionId());
        document.put("accountId", transaction.getAccountId());
        document.put("accountName", transaction.getAccountName());
        document.put("date", transaction.getDate().toString());
        document.put("payee", transaction.getPayee());
        document.put("payeeAccountId", transaction.getPayeeAccountId());
        document.put("payeeAccountName", transaction.getPayeeAccountName());
        document.put("envelopeId", transaction.getEnvelopeId());
        document.put("envelopeName", transaction.getEnvelopeName());
        document.put("memo", transaction.getMemo());
        document.put("outflow", transaction.getOutflow());
        document.put("inflow", transaction.getInflow());
        document.put("userId", transaction.getUserId());
        return document;
    }

    public static Transaction docToTransaction(Document doc) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(doc.getString(FIELD_TRANSACTION_ID));
        transaction.setAccountId(doc.getString(FIELD_ACCOUNT_ID));
        transaction.setAccountName(doc.getString(FIELD_ACCOUNT_NAME));
        transaction.setDate(LocalDate.parse(doc.getString(FIELD_DATE)));
        transaction.setPayee(doc.getString(FIELD_PAYEE));
        transaction.setPayeeAccountId(doc.getString(FIELD_PAYEE_ACCOUNT_ID));
        transaction.setPayeeAccountName(doc.getString(FIELD_PAYEE_ACCOUNT_NAME));
        transaction.setEnvelopeId(doc.getString(FIELD_ENVELOPE_ID));
        transaction.setEnvelopeName(doc.getString(FIELD_ENVELOPE_NAME));
        transaction.setMemo(doc.getString(FIELD_MEMO));
        transaction.setOutflow(new BigDecimal(doc.getString(FIELD_OUTFLOW)));
        transaction.setInflow(new BigDecimal(doc.getString(FIELD_INFLOW)));
        return transaction;
    }
}
