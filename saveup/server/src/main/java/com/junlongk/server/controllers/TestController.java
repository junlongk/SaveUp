package com.junlongk.server.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api")
public class TestController {

    @GetMapping(path = "/hello")
    @ResponseBody
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello world!");
    }
}
