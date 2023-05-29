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
                .add("category", transaction.getCategory())
                .add("transferId", transaction.getTransferId())
                .add("transferAccountId", transaction.getTransferAccountId())
                .add("transferAccountName", transaction.getTransferAccountName())
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
        document.put("category", transaction.getCategory());
        document.put("transferId", transaction.getTransferId());
        document.put("transferAccountId", transaction.getTransferAccountId());
        document.put("transferAccountName", transaction.getTransferAccountName());
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
        transaction.setCategory(doc.getString(FIELD_CATEGORY));
        transaction.setTransferId(doc.getString(FIELD_TRANSFER_ID));
        transaction.setTransferAccountId(doc.getString(FIELD_TRANSFER_ACCOUNT_ID));
        transaction.setTransferAccountName(doc.getString(FIELD_TRANSFER_ACCOUNT_NAME));
        transaction.setMemo(doc.getString(FIELD_MEMO));
        transaction.setOutflow(new BigDecimal(doc.getString(FIELD_OUTFLOW)));
        transaction.setInflow(new BigDecimal(doc.getString(FIELD_INFLOW)));
        return transaction;
    }
}
