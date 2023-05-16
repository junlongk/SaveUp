package com.junlongk.server.models;

import java.math.BigDecimal;
import java.util.List;

public class BudgetEnvelope {
    private String envelopeId;
    private String envelopeName;
    private BigDecimal assigned;
    private BigDecimal available;
    private List<Transaction> transactions;

    public BudgetEnvelope() {
    }

    public BudgetEnvelope(String envelopeId, String envelopeName) {
        this.envelopeId = envelopeId;
        this.envelopeName = envelopeName;
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

    public BigDecimal getAssigned() {
        return assigned;
    }

    public void setAssigned(BigDecimal assigned) {
        this.assigned = assigned;
    }

    public BigDecimal getAvailable() {
        return available;
    }

    public void setAvailable(BigDecimal available) {
        this.available = available;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    @Override
    public String toString() {
        return ("BudgetEnvelope{envelopeId='%s', envelopeName='%s', assigned=%s, " +
                "available=%s, transactions=%s}")
                .formatted(envelopeId, envelopeName, assigned, available, transactions);
    }
}
