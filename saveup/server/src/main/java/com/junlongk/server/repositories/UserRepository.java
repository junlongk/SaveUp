package com.junlongk.server.repositories;

import com.junlongk.server.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Optional;


@Repository
public class UserRepository {
    public static final String SQL_ADD_USER = """
            INSERT INTO user_data 
            (user_id, email, password, first_name, last_name, role) 
            VALUES
            (?, ?, ?, ?, ?, ?)
            """;

    public static final String SQL_GET_USER_BY_EMAIL = """
            SELECT * FROM user_data WHERE email = ?
            """;

    public static final String SQL_GET_USER_BY_USERID = """
            SELECT * FROM user_data WHERE user_id = ?
            """;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<User> getUserByEmail(String email) {
        User user = jdbcTemplate.queryForObject(SQL_GET_USER_BY_EMAIL,
                BeanPropertyRowMapper.newInstance(User.class), email);
        if (user != null) {
            return Optional.of(user);
        } else {
            return Optional.empty();
        }
    }

    public Optional<User> getUserByUserId(String userId) {
        User user = jdbcTemplate.queryForObject(SQL_GET_USER_BY_USERID,
                BeanPropertyRowMapper.newInstance(User.class), userId);

        if (user != null)
            return Optional.of(user);
        else
            return Optional.empty();
    }

    public int addUser(User user) {
        int registered = 0;

        registered = jdbcTemplate.update(SQL_ADD_USER, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, user.getUserId());
                ps.setString(2, user.getEmail());
                ps.setString(3, user.getPassword());
                ps.setString(4, user.getFirstName());
                ps.setString(5, user.getLastName());
                ps.setString(6, user.getRole().name());
            }
        });

        return registered;
    }

}
