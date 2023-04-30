package com.junlongk.server.services;

import com.junlongk.server.models.Account;
import com.junlongk.server.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepo;

    public String addAccount(String accountName, float balance, String userId) {
        String accountId = UUID.randomUUID().toString();

        Account account = new Account(accountId, accountName,
                balance, userId);

        accountRepo.addAccount(account);

        return accountId;
    }

    public Optional<List<Account>> getAccountsByUserId(String userId) {
        return accountRepo.getAccountsByUserId(userId);
    }

    public boolean updateBalance(float amount, String accountId) {
        return accountRepo.updateBalance(amount, accountId);
    }
}
