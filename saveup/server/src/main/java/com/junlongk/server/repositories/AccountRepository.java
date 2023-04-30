package com.junlongk.server.repositories;

import com.junlongk.server.models.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class AccountRepository {
    public static final String SQL_ADD_ACCOUNT = """
            INSERT INTO user_account (account_id, account_name, balance, user_id)
            VALUES (?, ?, ?, ?)
            """;

    public static final String SQL_GET_ACCOUNTS_BY_USERID = """
            SELECT account_name, balance FROM user_account WHERE user_id = ?
            """;

    public static final String SQL_UPDATE_ACCOUNT_BALANCE = """
            UPDATE user_account SET balance = ? WHERE account_id = ?;
            """;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean addAccount(Account account) {
        int addedAccount = jdbcTemplate.update(SQL_ADD_ACCOUNT, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, account.getAccountId());
                ps.setString(2, account.getAccountName());
                ps.setFloat(3, account.getBalance());
                ps.setString(4, account.getUserId());
            }
        });

        return addedAccount > 0;
    }

    public Optional<List<Account>> getAccountsByUserId(String userId) {
        List<Account> accounts = jdbcTemplate.query(SQL_GET_ACCOUNTS_BY_USERID,
                BeanPropertyRowMapper.newInstance(Account.class), userId);
        if (accounts.isEmpty())
            return Optional.empty();
        else
            return Optional.of(accounts);
    }

    public boolean updateBalance(float amount, String accountId) {

        int updated = jdbcTemplate.update(SQL_UPDATE_ACCOUNT_BALANCE, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setFloat(1, amount);
                ps.setString(2, accountId);
            }
        });

        return updated > 0;
    }
}
