package com.junlongk.server.models;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Transaction {

    private String transactionId;
    private String accountId;
    private String accountName;
    private LocalDate date;
    private String category;
    private String transferId;
    private String transferAccountId;
    private String transferAccountName;
    private String memo;
    private BigDecimal outflow;
    private BigDecimal inflow;
    private String userId;

    public Transaction() {
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTransferId() {
        return transferId;
    }

    public void setTransferId(String transferId) {
        this.transferId = transferId;
    }

    public String getTransferAccountId() {
        return transferAccountId;
    }

    public void setTransferAccountId(String transferAccountId) {
        this.transferAccountId = transferAccountId;
    }

    public String getTransferAccountName() {
        return transferAccountName;
    }

    public void setTransferAccountName(String transferAccountName) {
        this.transferAccountName = transferAccountName;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public BigDecimal getOutflow() {
        return outflow;
    }

    public void setOutflow(BigDecimal outflow) {
        this.outflow = outflow;
    }

    public BigDecimal getInflow() {
        return inflow;
    }

    public void setInflow(BigDecimal inflow) {
        this.inflow = inflow;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return ("Transaction{transactionId='%s', accountId='%s', accountName='%s'," +
                " date=%s, category='%s', transferId='%s', transferAccountId='%s', " +
                "transferAccountName='%s', memo='%s', outflow=%s, inflow=%s, userId='%s'}")
                .formatted(transactionId, accountId, accountName, date, category,
                        transferId, transferAccountId, transferAccountName, memo,
                        outflow, inflow, userId);
    }
}
