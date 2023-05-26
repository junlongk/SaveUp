package com.junlongk.server.controllers;

import com.junlongk.server.models.LoginRequest;
import com.junlongk.server.models.RegisterRequest;
import com.junlongk.server.services.AuthService;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register Request -> email, password, firstName, lastName
    // Response -> JWT token
    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        String jwtToken = authService.register(request);

        JsonObject resp = Json.createObjectBuilder()
                .add("token", jwtToken)
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resp.toString());
    }

    // Login Request -> email, password
    // Response -> JWT token
    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> login(
            @RequestBody LoginRequest request) {

        String jwtToken = authService.authenticate(request);

        JsonObject resp = Json.createObjectBuilder()
                .add("token", jwtToken)
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(resp.toString());
    }

    @PutMapping(path = "/premium", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> updatePremium(
            Authentication authentication,
            @RequestBody Map<String, String> userDetails) {

        String userIdFromAuth = authentication.getName();
        String userIdFromReq = userDetails.get("userId");

        if (!userIdFromAuth.equals(userIdFromReq)) {
            JsonObject resp = Json.createObjectBuilder()
                    .add("message",
                            "User ID %s does not belong to current user!"
                                    .formatted(userIdFromReq))
                    .build();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(resp.toString());
        }

        String jwtToken = authService.updatePremium(userIdFromReq);

        JsonObject resp = Json.createObjectBuilder()
                .add("token", jwtToken)
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(resp.toString());
    }
}
