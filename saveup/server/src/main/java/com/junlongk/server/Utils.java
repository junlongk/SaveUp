package com.junlongk.server;

import com.junlongk.server.models.Account;
import jakarta.json.Json;
import jakarta.json.JsonObject;

public class Utils {

    public static JsonObject accountToJson(Account account) {
        return Json.createObjectBuilder()
                .add("accountId", account.getAccountId())
                .add("accountName", account.getAccountName())
                .add("balance", account.getBalance())
                .add("userId", account.getUserId())
                .build();
    }


}
