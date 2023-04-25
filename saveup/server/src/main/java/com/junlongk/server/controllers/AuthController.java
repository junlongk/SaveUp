package com.junlongk.server.controllers;

import com.junlongk.server.models.LoginRequest;
import com.junlongk.server.models.RegisterRequest;
import com.junlongk.server.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(path = "/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register Request -> email, password, firstName, lastName
    // Response -> JWT token
    @PostMapping(path = "/register")
    @ResponseBody
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {


        return ResponseEntity.ok(authService.register(request));
    }

    // Login Request -> email, password
    // Response -> JWT token
    @PostMapping(path = "/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest request) {


        return ResponseEntity.ok(authService.authenticate(request));
    }
}
