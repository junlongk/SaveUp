package com.junlongk.server.models;

public class Account {
    private String accountId;

    private String accountName;

    private float balance;

    private String userId;

    public Account(String accountId, String accountName,
                   float balance, String userId) {
        this.accountId = accountId;
        this.accountName = accountName;
        this.balance = balance;
        this.userId = userId;
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

    public float getBalance() {
        return balance;
    }

    public void setBalance(float balance) {
        this.balance = balance;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Account{accountId='%s', accountName='%s', balance=%s, userId='%s'}"
                .formatted(accountId, accountName, balance, userId);
    }
}
