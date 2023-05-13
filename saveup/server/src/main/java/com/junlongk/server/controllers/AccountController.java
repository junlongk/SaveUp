package com.junlongk.server.controllers;

import com.junlongk.server.Utils;
import com.junlongk.server.exceptions.TransferException;
import com.junlongk.server.models.Account;
import com.junlongk.server.services.AccountService;
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

import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/accounts",
        produces = MediaType.APPLICATION_JSON_VALUE)
public class AccountController {
    @Autowired
    private AccountService accountSvc;

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> addAccount(
            Authentication authentication,
            @RequestBody Account account) {
        String userId = authentication.getName();

        String accountId = accountSvc.addAccount(
                account.getAccountName(), account.getBalance(), userId);

        JsonObject resp = Json.createObjectBuilder()
                .add("message",
                        "Account '%s' (%s) created successfully!"
                        .formatted(account.getAccountName(), accountId))
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resp.toString());
    }

    @GetMapping(path = "")
    @ResponseBody
    public ResponseEntity<String> getAccounts(
            Authentication authentication,
            @RequestParam String userId) {
        String userIdFromAuth = authentication.getName();
        List<Account> accounts;
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

        Optional<List<Account>> opt = accountSvc.getAccountsByUserId(userId);

        if (opt.isPresent()) {
            accounts = opt.get();
            accounts.forEach(a -> arrBuilder.add(Utils.accountToJson(a)));

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(arrBuilder.build().toString());
        }

        JsonObject resp = Json.createObjectBuilder()
                .add("message", "No accounts found under %s".formatted(userId))
                .build();

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(resp.toString());
    }

    @PutMapping(path = "/modify")
    @ResponseBody
    public ResponseEntity<String> modifyAccount(
            Authentication authentication,
            @RequestBody Map<String, String> modifyDetails) {

        // Get details from request body
        String accountName = modifyDetails.get("accountName");
        BigDecimal balance = BigDecimal.valueOf(Double.parseDouble(modifyDetails.get("balance")));
        String accountId = modifyDetails.get("accountId");

        // Check if accountId belongs to the currentUser
        String userId = authentication.getName();
        List<String> accounts = new LinkedList<>();
        Optional<List<Account>> opt = accountSvc.getAccountsByUserId(userId);

        if (opt.isPresent()) {
            accounts = opt.get().stream()
                    .map(Account::getAccountId)
                    .collect(Collectors.toList());
        }

        if (!accounts.contains(accountId)) {

            JsonObject resp = Json.createObjectBuilder()
                    .add("message",
                            "Account ID %s does not belong to current user!"
                                    .formatted(accountId))
                    .build();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(resp.toString());
        }

        accountSvc.modifyAccount(accountName, balance, accountId);

        JsonObject resp = Json.createObjectBuilder()
                .add("message", "Account ID: %s updated!".formatted(accountId))
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(resp.toString());
    }

    @PostMapping(path = "/transfer")
    @ResponseBody
    public ResponseEntity<String> transfer(
            Authentication authentication,
            @RequestBody Map<String, String> transferDetails)
            throws TransferException {

        // Get details from request
        BigDecimal amount = BigDecimal.valueOf(Double.parseDouble(transferDetails.get("amount")));
        String fromAccountId = transferDetails.get("fromAccountId");
        String toAccountId = transferDetails.get("toAccountId");

        // Check if both accounts belong to current user
        String userId = authentication.getName();
        List<String> accounts = new LinkedList<>();
        Optional<List<Account>> opt = accountSvc.getAccountsByUserId(userId);

        if (opt.isPresent()) {
            accounts = opt.get().stream()
                    .map(Account::getAccountId)
                    .collect(Collectors.toList());
        }

        if (!accounts.contains(fromAccountId) || !accounts.contains(toAccountId)) {
            JsonObject resp = Json.createObjectBuilder()
                    .add("message",
                            "One of the account does not belong to current user!")
                    .build();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(resp.toString());
        }

        accountSvc.updateBalanceByTransfer(amount,
                fromAccountId, toAccountId);

        JsonObject resp = Json.createObjectBuilder()
                .add("message", "Transfer updated!")
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(resp.toString());
    }
}

