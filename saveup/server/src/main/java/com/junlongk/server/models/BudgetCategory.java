package com.junlongk.server.models;

import java.util.List;

public class BudgetCategory {
    private String categoryId;
    private String categoryName;
    private List<BudgetEnvelope> envelopes;

    public BudgetCategory() {
    }

    public BudgetCategory(String categoryId, String categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<BudgetEnvelope> getEnvelopes() {
        return envelopes;
    }

    public void setEnvelopes(List<BudgetEnvelope> envelopes) {
        this.envelopes = envelopes;
    }

    @Override
    public String toString() {
        return "BudgetCategory{categoryId='%s', categoryName='%s', envelopes=%s}"
                .formatted(categoryId, categoryName, envelopes);
    }
}
