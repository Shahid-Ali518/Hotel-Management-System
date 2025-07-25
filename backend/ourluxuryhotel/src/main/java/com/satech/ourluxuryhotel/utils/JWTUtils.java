package com.satech.ourluxuryhotel.utils;

import com.satech.ourluxuryhotel.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.hibernate.engine.transaction.internal.jta.JtaStatusHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JWTUtils {


    public static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7; // FOR 7 days

    private static final String SECRET_KEY =  "TaK+HaV&ucCHEPsEVfypW#7g9^k*Z9$V";

    // generate secret key for user
    public SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String createToken(String email){
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();

    }


    // method to extract all claims
    private  <T>  T extractClaims (String token, Function<Claims, T> claimsTFunction){
        return claimsTFunction.apply(
                Jwts.parser()
                        .verifyWith(getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
        );
    }

    // method to extract username
    public String extractUsername(String token){
        return extractClaims(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails){
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token){
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }

}
