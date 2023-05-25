package com.junlongk.server.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StripeApiService {

    @Value("${stripe.pub.key}")
    private String stripeApiKey;

    public PaymentIntent createPaymentIntent() throws StripeException {
        Stripe.apiKey = stripeApiKey;

        Map<String, Object> automaticPaymentMethods = new HashMap<>();
        automaticPaymentMethods.put("enabled", true);

        Map<String, Object> params = new HashMap<>();
        params.put("amount", 2000);
        params.put("currency", "sgd");
        params.put("automatic_payment_methods", automaticPaymentMethods);

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return paymentIntent;
    }
}
