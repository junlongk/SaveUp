package com.junlongk.server.controllers;

import com.junlongk.server.models.Account;
import com.junlongk.server.services.AccountService;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/account", produces = MediaType.APPLICATION_JSON_VALUE)
public class AccountController {

    @Autowired
    private AccountService accountSvc;
    @PostMapping(path = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> addAccount(Authentication authentication,
            @RequestBody Account account) {
        String userId = authentication.getName();

        String accountId = accountSvc.addAccount(account.getAccountName(), account.getBalance(), userId);

        JsonObject resp = Json.createObjectBuilder()
                .add("message", "Account '%s' (%s) created successfully!\n"
                        .formatted(account.getAccountName(), accountId))
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(resp.toString());
    }

//    @GetMapping(path = "/get")
}
