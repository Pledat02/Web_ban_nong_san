package com.example.Identity_Service.service;

import com.example.Identity_Service.dto.request.AuthenicationRequest;
import com.example.Identity_Service.dto.request.TokenRequest;
import com.example.Identity_Service.dto.request.UserCreationRequest;
import com.example.Identity_Service.dto.response.AuthenicationResponse;
import com.example.Identity_Service.dto.response.TokenResponse;
import com.example.Identity_Service.repository.UserRepository;
import com.example.Identity_Service.dto.response.ValidTokenResponse;
import com.example.Identity_Service.entity.InvalidToken;
import com.example.Identity_Service.entity.Role;
import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import com.example.Identity_Service.repository.UserRepository;
import com.example.Identity_Service.repository.InvalidTokenRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Set;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenicationService {

    private UserRepository userRepository;
    private InvalidTokenRepository invalidTokenRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String signer_key;
    public AuthenicationResponse authenticate(AuthenicationRequest request) {
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)) ;

        if(user == null){
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated =  passwordEncoder.matches(request.getPassword(),user.getPassword());
        return AuthenicationResponse.builder()
                .token(generateToken(user))
                .authenticated(authenticated)
                .build();
    }
    public ValidTokenResponse introspect(TokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        boolean isValid  = false;
        try {
            verifyToken(token);
            isValid = true;
        }catch (Exception exception){
            log.error("Invalid token");
        }
        return ValidTokenResponse.builder()
                .valid(isValid)
                .build();
    }

    private SignedJWT verifyToken (String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(signer_key.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        boolean isValid = signedJWT.verify(verifier);
        // check expired date
        Date expiredDate  = signedJWT.getJWTClaimsSet().getExpirationTime();
        String jwt = signedJWT.getJWTClaimsSet().getJWTID();
        // check if token is not  expired
        boolean isAfterExpiredDate = expiredDate.after(new Date());
        if(!isValid || !isAfterExpiredDate){
           throw new IllegalStateException("Invalid token");
        }
        if(invalidTokenRepository.existsById(jwt)){
            throw new IllegalStateException("Invalid token");
        }
       return signedJWT;

    }
    public void logout(TokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        SignedJWT signedJWT = verifyToken(token);
        String jwtID  = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiredDate  = signedJWT.getJWTClaimsSet().getExpirationTime();
        // save token from db
        invalidTokenRepository.save(InvalidToken.builder()
                .token(jwtID)
                .expiredDate(expiredDate)
                .build());

    }
    public TokenResponse refreshToken(TokenRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        SignedJWT signedJWT = verifyToken(token);
        String jwtID  = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiredDate  = signedJWT.getJWTClaimsSet().getExpirationTime();
        String subject = signedJWT.getJWTClaimsSet().getSubject();
        InvalidToken invalidToken = InvalidToken.builder()
                .token(jwtID)
                .expiredDate(expiredDate)
                .build();
        invalidTokenRepository.save(invalidToken);
        User user = userRepository.findByUsername(subject).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND));
        String tokenReturn = generateToken(user);
        return TokenResponse.builder()
                .token(tokenReturn)
                .build();

    }
    private String generateToken(User user) {
        // header jwt
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli())
                )
                .issueTime(new Date())
                .issuer("admin")
                .jwtID(UUID.randomUUID().toString())
               .claim("scope", getScopeClaim(user.getRoles()))
                .build();
        // payload jwt
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader,payload);

        // sign jwt
        try {
            jwsObject.sign(new MACSigner(signer_key.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);

        }
    }

    private String getScopeClaim(Set<Role> roles){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!roles.isEmpty()){
            for(Role role : roles){
                log.info("ROLE_"+role.getName());
                stringJoiner.add("ROLE_"+role.getName());
                if(!role.getPermissons().isEmpty()){
                    stringJoiner.add(role.getPermissons().stream()
                           .map(p -> p.getName())
                           .collect(Collectors.joining(" ")));
                }
            }
        }
        return stringJoiner.toString();
    }
}
