package com.junlongk.server.models;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Transaction {

    private String transactionId;
    private String accountId;
    private String accountName;
    private LocalDate date;
    private String payee;
    private String payeeAccountId;
    private String payeeAccountName;
    private String envelopeId;
    private String envelopeName;
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

    public String getPayee() {
        return payee;
    }

    public void setPayee(String payee) {
        this.payee = payee;
    }

    public String getPayeeAccountId() {
        return payeeAccountId;
    }

    public void setPayeeAccountId(String payeeAccountId) {
        this.payeeAccountId = payeeAccountId;
    }

    public String getPayeeAccountName() {
        return payeeAccountName;
    }

    public void setPayeeAccountName(String payeeAccountName) {
        this.payeeAccountName = payeeAccountName;
    }

    public String getEnvelopeId() {
        return envelopeId;
    }

    public void setEnvelopeId(String envelopeId) {
        this.envelopeId = envelopeId;
    }

    public String getEnvelopeName() {
        return envelopeName;
    }

    public void setEnvelopeName(String envelopeName) {
        this.envelopeName = envelopeName;
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
        return ("Transaction{transactionId='%s', accountId='%s', accountName='%s', " +
                "date=%s, payee='%s', payeeAccountId='%s', payeeAccountName='%s', " +
                "envelopeId='%s', envelopeName='%s', memo='%s', outflow=%s, " +
                "inflow=%s, userId='%s'}")
                .formatted(transactionId, accountId, accountName, date, payee,
                        payeeAccountId, payeeAccountName, envelopeId, envelopeName,
                        memo, outflow, inflow, userId);
    }
}