/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.multiuser.keycloak.server;

import static io.jsonwebtoken.SignatureAlgorithm.RS256;
import static org.eclipse.che.multiuser.machine.authentication.shared.Constants.MACHINE_TOKEN_KIND;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

import io.jsonwebtoken.Jwts;
import java.net.MalformedURLException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import org.eclipse.che.multiuser.machine.authentication.server.signature.SignatureKeyManager;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.testng.MockitoTestNGListener;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

/**
 * Tests {@link AbstractKeycloakFilter}.
 *
 * @author Anton Korneta
 */
@Listeners(MockitoTestNGListener.class)
public class AbstractKeycloakFilterTest {

  @Mock private HttpServletRequest request;
  @Mock private SignatureKeyManager signatureKeyManager;
  @Mock private KeycloakSettings keycloakSettings;

  @InjectMocks private TestLoginFilter abstractKeycloakFilter;

  private String machineToken;

  @BeforeMethod
  public void setup() throws Exception {
    final KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
    kpg.initialize(512);
    final KeyPair keyPair = kpg.generateKeyPair();
    final Map<String, Object> header = new HashMap<>();
    header.put("kind", MACHINE_TOKEN_KIND);
    machineToken =
        Jwts.builder()
            .setPayload("payload")
            .setHeader(header)
            .signWith(RS256, keyPair.getPrivate())
            .compact();

    when(signatureKeyManager.getKeyPair(anyString())).thenReturn(keyPair);
    when(request.getRequestURI()).thenReturn(null);
  }

  @Test
  public void testShouldSkipAuthWhenRetrievingOIDCKeycloakJsFile() {
    when(request.getRequestURI()).thenReturn("https://localhost:8080/api/keycloak/OIDCKeycloak.js");
    assertTrue(abstractKeycloakFilter.shouldSkipAuthentication(request, null));
  }

  @Test
  public void testShouldNotSkipAuthWhenNullTokenProvided() {
    assertFalse(abstractKeycloakFilter.shouldSkipAuthentication(request, null));
  }

  @Test
  public void testShouldNotSkipAuthWhenProvidedTokenIsNotMachine() {
    assertFalse(abstractKeycloakFilter.shouldSkipAuthentication(request, "testToken"));
  }

  @Test
  public void testAuthIsNotNeededWhenMachineTokenProvided() throws Exception {
    assertTrue(abstractKeycloakFilter.shouldSkipAuthentication(request, machineToken));
  }

  static class TestLoginFilter extends AbstractKeycloakFilter {

    public TestLoginFilter(KeycloakSettings keycloakSettings) throws MalformedURLException {
      super(keycloakSettings);
    }

    @Override
    public void doFilter(
        ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) {}
  }
}
