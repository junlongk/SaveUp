package com.junlongk.server.services;

import com.junlongk.server.models.*;
import com.junlongk.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.logging.Logger;

@Service
public class AuthService {

    private final Logger logger = Logger.getLogger(AuthService.class.getName());

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public String register(RegisterRequest request) {

        User user = new User();

        // Create userId
        String userId = UUID.randomUUID().toString();

        // Encode password
        String password = passwordEncoder.encode(request.getPassword());

        user.setUserId(userId);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(password);
        user.setRole(Role.USER);

        userRepo.addUser(user);

        String jwtToken = jwtService.generateToken(user);

        logger.info(">>> registered successful!\n");
        logger.info(">>> register jwt: %s\n".formatted(jwtToken));

        return jwtToken;
    }

    public String authenticate(LoginRequest request) {
        User user = userRepo.getUserByEmail(request.getEmail())
                .orElseThrow();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUserId(),
                        request.getPassword()
                )
        );

        String jwtToken = jwtService.generateToken(user);

        logger.info(">>> login user found!\n%s\n".formatted(user.toString()));
        logger.info(">>> login jwt: %s\n".formatted(jwtToken));

        return jwtToken;
    }
}
