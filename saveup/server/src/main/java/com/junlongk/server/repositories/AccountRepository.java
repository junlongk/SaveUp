package com.junlongk.server.repositories;

import com.junlongk.server.models.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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
            SELECT * FROM user_account WHERE user_id = ?
            """;

    // Modify account
    public static final String SQL_MODIFY_ACCOUNT = """
            UPDATE user_account SET account_name = ?, balance = ? WHERE account_id = ?
            """;

    // Delete account
    public static final String SQL_DELETE_ACCOUNT = """
            DELETE FROM user_account WHERE account_id = ?
            """;

    // Update "from" account balance for transfers
    public static final String SQL_UPDATE_FROM_ACCOUNT_BALANCE = """
            UPDATE user_account SET balance = balance - ? WHERE account_id = ?
            """;

    // Update "to" account balance for transfers
    public static final String SQL_UPDATE_TO_ACCOUNT_BALANCE = """
            UPDATE user_account SET balance = balance + ? WHERE account_id = ?
            """;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean addAccount(Account account) {
        int addedAccount = jdbcTemplate.update(SQL_ADD_ACCOUNT, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, account.getAccountId());
                ps.setString(2, account.getAccountName());
                ps.setBigDecimal(3, account.getBalance());
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

    public boolean modifyAccount(String accountName, BigDecimal balance, String accountId) {

        int updated = jdbcTemplate.update(SQL_MODIFY_ACCOUNT, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, accountName);
                ps.setBigDecimal(2, balance);
                ps.setString(3, accountId);
            }
        });

        return updated > 0;
    }

    public boolean deleteAccount(String accountId) {

        int deleted = jdbcTemplate.update(SQL_DELETE_ACCOUNT, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, accountId);
            }
        });

        return deleted > 0;
    }

    public boolean updateFromBalance(BigDecimal amount, String fromAccountId) {

        int updated = jdbcTemplate.update(SQL_UPDATE_FROM_ACCOUNT_BALANCE, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setBigDecimal(1, amount);
                ps.setString(2, fromAccountId);
            }
        });

        return updated > 0;
    }

    public boolean updateToBalance(BigDecimal amount, String toAccountId) {

        int updated = jdbcTemplate.update(SQL_UPDATE_TO_ACCOUNT_BALANCE, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setBigDecimal(1, amount);
                ps.setString(2, toAccountId);
            }
        });

        return updated > 0;
    }
}
