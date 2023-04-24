package com.junlongk.server.repositories;

import com.junlongk.server.Utils;
import com.junlongk.server.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public class UserRepository {
    public static final String SQL_GET_USER_BY_EMAIL = """
            select * from user_data where email = ?
            """;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<User> getUserByEmail(String email) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(SQL_GET_USER_BY_EMAIL, email);

        if (!rs.next())
            return Optional.empty();

        return Optional.of(Utils.rowsetToUser(rs));
    }
}
