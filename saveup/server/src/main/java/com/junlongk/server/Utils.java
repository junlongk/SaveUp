package com.junlongk.server;

import com.junlongk.server.models.User;
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
}
