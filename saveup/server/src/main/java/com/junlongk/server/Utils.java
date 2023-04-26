package com.junlongk.server;

import com.junlongk.server.models.AuthResponse;
import jakarta.json.Json;

public class Utils {
    public static String authRespToStr(AuthResponse authResp) {
        return Json.createObjectBuilder()
                .add("token", authResp.getToken())
                .build()
                .toString();
    }
}
