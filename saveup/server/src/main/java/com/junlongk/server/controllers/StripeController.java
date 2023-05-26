package com.junlongk.server.controllers;

import com.junlongk.server.services.StripeApiService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/stripe",
        produces = MediaType.APPLICATION_JSON_VALUE)
public class StripeController{

    @Autowired
    private StripeApiService stripeApiSvc;

    @GetMapping(path = "/create-payment-intent")
    @ResponseBody
    public ResponseEntity<String> createPaymentIntent() throws StripeException {
        PaymentIntent intent = stripeApiSvc.createPaymentIntent();

        JsonObject resp = Json.createObjectBuilder()
                .add("client_secret", intent.getClientSecret())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(resp.toString());
    }

}
