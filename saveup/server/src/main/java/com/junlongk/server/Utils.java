package com.junlongk.server;

import com.junlongk.server.models.AuthResponse;
import com.junlongk.server.models.Role;
import com.junlongk.server.models.User;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.springframework.jdbc.support.rowset.SqlRowSet;

public class Utils {
    public static String authRespToStr(AuthResponse authResp) {
        return Json.createObjectBuilder()
                .add("token", authResp.getToken())
                .build()
                .toString();
    }
}
