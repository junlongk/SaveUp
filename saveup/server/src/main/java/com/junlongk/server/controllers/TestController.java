package com.junlongk.server.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.Principal;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/test")
public class TestController {

    @GetMapping(path = "/hello")
    @ResponseBody
    public ResponseEntity<String> sayHello(Authentication authentication,
                                           Principal principal) {
        String userId = authentication.getName();
        System.out.printf(">>> userId: %s\n".formatted(userId));
        System.out.println(principal.getName());
        return ResponseEntity.ok("Hello world!");
    }
}
