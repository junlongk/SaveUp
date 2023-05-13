package com.junlongk.server.services;

import com.junlongk.server.exceptions.TransferException;
import com.junlongk.server.models.Account;
import com.junlongk.server.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepo;

    public String addAccount(String accountName, BigDecimal balance, String userId) {
        String accountId = UUID.randomUUID().toString();

        Account account = new Account(accountId, accountName,
                balance, userId);

        accountRepo.addAccount(account);

        return accountId;
    }

    public Optional<List<Account>> getAccountsByUserId(String userId) {
        return accountRepo.getAccountsByUserId(userId);
    }

    public boolean modifyAccount(String accountName, BigDecimal balance, String accountId) {
        return accountRepo.modifyAccount(accountName, balance, accountId);
    }

    public boolean deleteAccount(String accountId) {
        return accountRepo.deleteAccount(accountId);
    }

    @Transactional(rollbackFor = TransferException.class)
    public void updateBalanceByTransfer(BigDecimal amount,
                                 String fromAccountId,
                                 String toAccountId) throws TransferException {
        boolean statusOfFromAcct = accountRepo.updateFromBalance(amount, fromAccountId);
        boolean statusOfToAcct = accountRepo.updateToBalance(amount, toAccountId);

        if (!statusOfFromAcct || !statusOfToAcct)
            throw new TransferException("Error in account transfer!");
    }
}
