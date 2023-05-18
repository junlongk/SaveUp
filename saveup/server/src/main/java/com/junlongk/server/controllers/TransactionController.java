package com.junlongk.server.controllers;

import com.junlongk.server.Utils;
import com.junlongk.server.models.Account;
import com.junlongk.server.models.Transaction;
import com.junlongk.server.services.TransactionService;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/transactions",
        produces = MediaType.APPLICATION_JSON_VALUE)
public class TransactionController {

    @Autowired
    private TransactionService transactionSvc;

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> addTransaction(
            Authentication authentication,
            @RequestBody Transaction transaction) {
        String userId = authentication.getName();

        String accountId = transactionSvc.addTransaction(transaction);

        JsonObject resp = Json.createObjectBuilder()
                .add("message",
                        "Transaction (id: %s) created successfully!"
                                .formatted(transaction.getTransactionId()))
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resp.toString());
    }

    @GetMapping(path ="")
    @ResponseBody
    public ResponseEntity<String> getAllTransactions(
            Authentication authentication,
            @RequestParam String userId) {
        String userIdFromAuth = authentication.getName();
        List<Transaction> transactions;
        JsonArrayBuilder arrBuilder = Json.createArrayBuilder();

        // Check if requested userId belongs to current user
        if (!userIdFromAuth.equals(userId)) {
            JsonObject resp = Json.createObjectBuilder()
                    .add("message", "UserId does not belong to current user!")
                    .build();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(resp.toString());
        }

        // need to get limit and offset from client-side
        // currently hard-coded limit of 10 & offset of 0
        Optional<List<Transaction>> opt = transactionSvc.getAllTransactions(
                userId, 10, 0);

        if (opt.isPresent()) {
            transactions = opt.get();
            transactions.forEach(t -> arrBuilder.add(Utils.transactionToJson(t)));

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(arrBuilder.build().toString());
        }

        JsonObject resp = Json.createObjectBuilder()
                .add("message", "No transaction found under %s".formatted(userId))
                .build();

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(resp.toString());
    }
}
