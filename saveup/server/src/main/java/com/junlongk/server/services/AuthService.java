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

    public AuthResponse register(RegisterRequest request) {

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

        userRepo.register(user);

        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken);
    }

    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                     request.getEmail(),
                     request.getPassword()
                )
        );

        User user = userRepo.getUserByEmail(request.getEmail())
                .orElseThrow();

        logger.info(">>> login request user:\n%s\n".formatted(user.toString()));

        String jwtToken = jwtService.generateToken(user);

        logger.info(">>> login jwt: %s\n".formatted(jwtToken));

        return new AuthResponse(jwtToken);
    }
}
