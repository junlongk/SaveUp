package com.junlongk.server.models;

import java.util.List;

public class Budget {

    private String budgetId;

    private String monthYear;

    private List<BudgetCategory> categories;

    private String userId;

    public Budget() {
    }

    public Budget(String budgetId, String monthYear, String userId) {
        this.budgetId = budgetId;
        this.monthYear = monthYear;
        this.userId = userId;
    }

    public String getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(String budgetId) {
        this.budgetId = budgetId;
    }

    public String getMonthYear() {
        return monthYear;
    }

    public void setMonthYear(String monthYear) {
        this.monthYear = monthYear;
    }

    public List<BudgetCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<BudgetCategory> categories) {
        this.categories = categories;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Budget{budgetId='%s', monthYear='%s', categories=%s, userId='%s'}"
                .formatted(budgetId, monthYear, categories, userId);
    }
}
