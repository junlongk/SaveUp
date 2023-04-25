package com.junlongk.server.services;

import com.junlongk.server.models.LoginRequest;
import com.junlongk.server.models.RegisterRequest;
import com.junlongk.server.models.Role;
import com.junlongk.server.models.User;
import com.junlongk.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

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

        userRepo.register(user);

        return jwtService.generateToken(user);
    }

    public String authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                     request.getEmail(),
                     request.getPassword()
                )
        );

        User user = userRepo.getUserByEmail(request.getEmail())
                .orElseThrow();

        return jwtService.generateToken(user);
    }
}
