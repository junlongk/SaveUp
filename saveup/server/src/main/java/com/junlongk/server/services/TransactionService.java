package com.junlongk.server.services;

import com.junlongk.server.models.Transaction;
import com.junlongk.server.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepo;

    public String addTransaction(Transaction transaction, String userId) {
        // Generate transaction ID
        String transactionId = UUID.randomUUID().toString();
        transaction.setTransactionId(transactionId);

        transaction.setUserId(userId);

        transactionRepo.addTransaction(transaction);

        return transactionId;
    }

    public Optional<List<Transaction>> getAllTransactions(
            String userId, int limit, int skip) {
        return transactionRepo.getAllTransactions(userId, limit, skip);
    }
}