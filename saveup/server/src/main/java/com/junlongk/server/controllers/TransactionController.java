package com.junlongk.server.controllers;

import com.junlongk.server.Utils;
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
import java.util.Map;
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

        String transactionId = transactionSvc.addTransaction(transaction, userId);

        JsonObject resp = Json.createObjectBuilder()
                .add("message",
                        "Transaction (id: %s) created successfully!"
                                .formatted(transactionId))
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

        Optional<List<Transaction>> opt = transactionSvc.getAllTransactions(
                userId);

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

    @PutMapping(path = "/modify")
    @ResponseBody
    public ResponseEntity<String> modifyTransaction(
            Authentication authentication,
            @RequestBody Transaction transaction) {

        String transactionId = transaction.getTransactionId();

        // Check if transaction belongs to current user
        String userIdFromAuth = authentication.getName();
        String userIdFromDB = transactionSvc.getUserIdByTransactionId(transactionId);

        if (!userIdFromAuth.equals(userIdFromDB)) {
            JsonObject resp = Json.createObjectBuilder()
                    .add("message",
                            "Transaction ID %s does not belong to current user!"
                                    .formatted(transactionId))
                    .build();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(resp.toString());
        }

        // transaction object from client-side do not carry userId info
        transaction.setUserId(userIdFromDB);
        String updated = transactionSvc.modifyTransaction(transactionId, transaction);

        JsonObject resp = Json.createObjectBuilder()
                .add("message", "Transaction ID: %s updated!".formatted(updated))
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(resp.toString());
    }

    @DeleteMapping(path = "/delete/{transactionId}")
    @ResponseBody
    public ResponseEntity<String> deleteTransaction (
        Authentication authentication,
        @PathVariable String transactionId) {

        // Check if transaction belongs to current user
        String userIdFromAuth = authentication.getName();
        String userIdFromDB = transactionSvc.getUserIdByTransactionId(transactionId);

        if (!userIdFromAuth.equals(userIdFromDB)) {
            JsonObject resp = Json.createObjectBuilder()
                    .add("message",
                            "Transaction ID %s does not belong to current user!"
                                    .formatted(transactionId))
                    .build();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(resp.toString());
        }

        String deleted = transactionSvc.deleteTransaction(transactionId);

        JsonObject resp = Json.createObjectBuilder()
                .add("message", "Transaction ID: %s deleted!".formatted(deleted))
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(resp.toString());
    }

    @PutMapping(path = "/modifyaccountname")
    @ResponseBody
    public ResponseEntity<String> modifyAccountName (
            Authentication authentication,
            @RequestBody Map<String, String> modifyDetails) {

        String accountId = modifyDetails.get("accountId");
        String newAccountName = modifyDetails.get("newAccountName");

        int updated = transactionSvc.updateAccountName(accountId, newAccountName);

        JsonObject resp = Json.createObjectBuilder()
                .add("message",
                        "%d transactions updated with new account name!"
                                .formatted(updated))
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(resp.toString());
    }

}
