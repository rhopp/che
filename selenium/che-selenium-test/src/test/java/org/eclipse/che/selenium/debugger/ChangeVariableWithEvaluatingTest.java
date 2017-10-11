/*
 * Copyright (c) 2012-2017 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.selenium.debugger;

import static org.testng.Assert.assertTrue;

import com.google.inject.Inject;
import java.net.URL;
import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.eclipse.che.commons.lang.NameGenerator;
import org.eclipse.che.selenium.core.client.TestCommandServiceClient;
import org.eclipse.che.selenium.core.client.TestProjectServiceClient;
import org.eclipse.che.selenium.core.client.TestWorkspaceServiceClient;
import org.eclipse.che.selenium.core.constant.TestBuildConstants;
import org.eclipse.che.selenium.core.constant.TestCommandsConstants;
import org.eclipse.che.selenium.core.constant.TestMenuCommandsConstants;
import org.eclipse.che.selenium.core.project.ProjectTemplates;
import org.eclipse.che.selenium.core.workspace.TestWorkspace;
import org.eclipse.che.selenium.pageobject.CodenvyEditor;
import org.eclipse.che.selenium.pageobject.Consoles;
import org.eclipse.che.selenium.pageobject.Ide;
import org.eclipse.che.selenium.pageobject.Menu;
import org.eclipse.che.selenium.pageobject.ProjectExplorer;
import org.eclipse.che.selenium.pageobject.ToastLoader;
import org.eclipse.che.selenium.pageobject.debug.DebugPanel;
import org.eclipse.che.selenium.pageobject.debug.JavaDebugConfig;
import org.eclipse.che.selenium.pageobject.intelligent.CommandsPalette;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

/** @author Musienko Maxim */
public class ChangeVariableWithEvaluatingTest {
  private static final String PROJECT_NAME_CHANGE_VARIABLE =
      NameGenerator.generate(ChangeVariableWithEvaluatingTest.class.getSimpleName(), 2);

  private static final String START_DEBUG_COMMAND_NAME = "startDebug";
  private static final String CLEAN_TOMCAT_COMMAND_NAME = "cleanTomcat";
  private static final String BUILD_COMMAND_NAME = "build";

  private static final String COMMAND_LAUNCHING_TOMCAT_IN_JPDA =
      "cp /projects/"
          + PROJECT_NAME_CHANGE_VARIABLE
          + "/target/qa-spring-sample-1.0-SNAPSHOT.war /home/user/tomcat8/webapps/ROOT.war"
          + " && "
          + "/home/user/tomcat8/bin/catalina.sh jpda run";

  private static final String MAVEN_BUILD_COMMAND =
      "mvn clean install -f /projects/" + PROJECT_NAME_CHANGE_VARIABLE;

  private DebuggerUtils debuggerUtils = new DebuggerUtils();

  @Inject private TestWorkspace ws;
  @Inject private Ide ide;

  @Inject private ProjectExplorer projectExplorer;
  @Inject private Consoles consoles;
  @Inject private CodenvyEditor editor;
  @Inject private Menu menu;
  @Inject private JavaDebugConfig debugConfig;
  @Inject private DebugPanel debugPanel;
  @Inject private ToastLoader toastLoader;
  @Inject private TestCommandServiceClient testCommandServiceClient;
  @Inject private TestWorkspaceServiceClient workspaceServiceClient;
  @Inject private TestProjectServiceClient testProjectServiceClient;
  @Inject private CommandsPalette commandsPalette;

  @BeforeClass
  public void prepare() throws Exception {
    URL resource = getClass().getResource("/projects/debug-spring-project");
    testProjectServiceClient.importProject(
        ws.getId(),
        Paths.get(resource.toURI()),
        PROJECT_NAME_CHANGE_VARIABLE,
        ProjectTemplates.MAVEN_SPRING);

    testCommandServiceClient.createCommand(
        COMMAND_LAUNCHING_TOMCAT_IN_JPDA,
        START_DEBUG_COMMAND_NAME,
        TestCommandsConstants.CUSTOM,
        ws.getId());

    testCommandServiceClient.createCommand(
        MAVEN_BUILD_COMMAND, BUILD_COMMAND_NAME, TestCommandsConstants.CUSTOM, ws.getId());

    String stopTomcatAndCleanWebAppDir =
        "/home/user/tomcat8/bin/shutdown.sh && rm -rf /home/user/tomcat8/webapps/*";
    testCommandServiceClient.createCommand(
        stopTomcatAndCleanWebAppDir,
        CLEAN_TOMCAT_COMMAND_NAME,
        TestCommandsConstants.CUSTOM,
        ws.getId());
    ide.open(ws);
  }

  @Test
  public void changeVariableTest() throws Exception {
    buildProjectAndOpenMainClass();
    commandsPalette.openCommandPalette();
    commandsPalette.startCommandByDoubleClick(START_DEBUG_COMMAND_NAME);
    consoles.waitExpectedTextIntoConsole(" Server startup in");
    editor.setCursorToLine(34);
    editor.setInactiveBreakpoint(34);
    menu.runCommand(
        TestMenuCommandsConstants.Run.RUN_MENU,
        TestMenuCommandsConstants.Run.EDIT_DEBUG_CONFIGURATION);
    debugConfig.createConfig(PROJECT_NAME_CHANGE_VARIABLE);
    menu.runCommand(
        TestMenuCommandsConstants.Run.RUN_MENU,
        TestMenuCommandsConstants.Run.DEBUG,
        TestMenuCommandsConstants.Run.DEBUG + "/" + PROJECT_NAME_CHANGE_VARIABLE);
    String appUrl =
        workspaceServiceClient
                .getServerFromDevMachineBySymbolicName(ws.getId(), "8080/tcp")
                .getUrl()
                .replace("tcp", "http")
            + "/spring/guess";
    String requestMess = "11";
    editor.waitActiveBreakpoint(34);
    CompletableFuture<String> instToRequestThread =
        debuggerUtils.gotoDebugAppAndSendRequest(appUrl, requestMess);
    debugPanel.openDebugPanel();
    debugPanel.waitDebugHighlightedText("result = \"Sorry, you failed. Try again later!\";");
    debugPanel.waitVariablesPanel();
    debugPanel.selectVarInVariablePanel("numGuessByUser=\"11\"");
    debugPanel.clickOnButton(DebugPanel.DebuggerButtonsPanel.CHANGE_VARIABLE);
    String secretNum = getValueOfSecretNumFromVarWidget().trim();
    debugPanel.typeAndChangeVariable(secretNum);
    debugPanel.selectVarInVariablePanel(String.format("numGuessByUser=%s", secretNum));
    debugPanel.clickOnButton(DebugPanel.DebuggerButtonsPanel.EVALUATE_EXPRESSIONS);
    debugPanel.typeEvaluateExpression("numGuessByUser.length()");
    debugPanel.clickEvaluateBtn();
    debugPanel.waitExpectedResultInEvaluateExpression("1");
    debugPanel.typeEvaluateExpression("numGuessByUser.isEmpty()");
    debugPanel.clickEvaluateBtn();
    debugPanel.waitExpectedResultInEvaluateExpression("false");
    debugPanel.clickCloseEvaluateBtn();
    debugPanel.clickOnButton(DebugPanel.DebuggerButtonsPanel.RESUME_BTN_ID);
    assertTrue(instToRequestThread.get().contains("Sorry, you failed. Try again later!"));
  }

  private void buildProjectAndOpenMainClass() {
    projectExplorer.waitItem(PROJECT_NAME_CHANGE_VARIABLE);
    toastLoader.waitAppeareanceAndClosing();
    projectExplorer.quickExpandWithJavaScript();
    commandsPalette.openCommandPalette();
    commandsPalette.startCommandByDoubleClick(BUILD_COMMAND_NAME);
    consoles.waitExpectedTextIntoConsole(TestBuildConstants.BUILD_SUCCESS);
    projectExplorer.openItemByVisibleNameInExplorer("AppController.java");
    editor.waitActiveEditor();
  }

  private String getValueOfSecretNumFromVarWidget() {
    Pattern compile = Pattern.compile("secretNum=(.*)\n");
    Matcher matcher = compile.matcher(debugPanel.getVariables());
    return matcher.find() ? matcher.group(1) : null;
  }
}
