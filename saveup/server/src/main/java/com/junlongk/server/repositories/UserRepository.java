package com.junlongk.server.repositories;

import com.junlongk.server.Utils;
import com.junlongk.server.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Optional;


@Repository
public class UserRepository {
    public static final String SQL_GET_USER_BY_EMAIL = """
            select * from user_data where email = ?
            """;

    public static final String SQL_INSERT_USER = """
            insert into user_data 
            (user_id, email, password, first_name, last_name, role) values 
            (?, ?, ?, ?, ?, ?)
            """;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<User> getUserByEmail(String email) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(SQL_GET_USER_BY_EMAIL, email);

        if (!rs.next())
            return Optional.empty();

        return Optional.of(Utils.rowsetToUser(rs));
    }

    public int register(User user) {
        int registered = 0;

        registered = jdbcTemplate.update(SQL_INSERT_USER, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, user.getUserId());
                ps.setString(2, user.getEmail());
                ps.setString(3, user.getPassword());
                ps.setString(4, user.getFirstName());
                ps.setString(5, user.getLastName());
                ps.setString(6, String.valueOf(user.getRole()));
            }
        });

        return registered;
    }
}
