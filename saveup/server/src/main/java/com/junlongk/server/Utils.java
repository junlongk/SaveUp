package com.junlongk.server;

import com.junlongk.server.models.Account;
import jakarta.json.Json;
import jakarta.json.JsonObject;

public class Utils {

    public static JsonObject accountToJson(Account account) {
        return Json.createObjectBuilder()
                .add("accountName", account.getAccountName())
                .add("balance", account.getBalance())
                .build();
    }


}
