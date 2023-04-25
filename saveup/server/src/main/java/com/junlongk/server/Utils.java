package com.junlongk.server;

import com.junlongk.server.models.Role;
import com.junlongk.server.models.User;
import jakarta.json.JsonObject;
import org.springframework.jdbc.support.rowset.SqlRowSet;

public class Utils {

    public static User rowsetToUser(SqlRowSet rs) {
        User user = new User();
        user.setUserId(rs.getString("userId"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setFirstName(rs.getString("firstName"));
        user.setLastName(rs.getString("lastName"));
        return user;
    }

    public static User jsonToUser(JsonObject json) {
        User user = new User();
        user.setEmail(json.getString("email"));
        user.setFirstName(json.getString("firstName"));
        user.setLastName(json.getString("lastName"));
        user.setRole(Role.USER);
        return user;
    }
}
