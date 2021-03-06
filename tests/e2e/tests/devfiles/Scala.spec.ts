/*********************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
import 'reflect-metadata';
import * as projectAndFileTests from '../../testsLibrary/ProjectAndFileTests';
import * as workspaceHandling from '../../testsLibrary/WorkspaceHandlingTests';
import * as commonLsTests from '../../testsLibrary/LsTests';
import * as codeExecutionTests from '../../testsLibrary/CodeExecutionTests';
import { WorkspaceNameHandler } from '../..';

const workspaceSampleName: string = 'console-scala-simple';
const workspaceRootFolderName: string = 'example';
const fileFolderPath: string = `${workspaceSampleName}/${workspaceRootFolderName}/src/main/scala/org/eclipse/che/examples`;
const tabTitle: string = 'HelloWorld.scala';
const compileTaskkName: string = 'sbt compile';
const runTaskName: string = 'sbt run';
const testTaskName: string = 'sbt test';
const stack: string = 'Scala';

// skipping scala to enable pre-release suite to be easily used for updates until https://github.com/eclipse/che/issues/18662 is fixed
suite.skip(`${stack} test`, async () => {
    suite (`Create ${stack} workspace`, async () => {
        workspaceHandling.createAndOpenWorkspace(stack);
        projectAndFileTests.waitWorkspaceReadiness(workspaceSampleName, workspaceRootFolderName);
    });

    suite('Test opening file', async () => {
        // opening file that soon should give time for LS to initialize
        projectAndFileTests.openFile(fileFolderPath, tabTitle);
    });

    suite('Validation of commands', async () => {
        codeExecutionTests.runTask(compileTaskkName, 240_000);
        codeExecutionTests.closeTerminal(compileTaskkName);
        codeExecutionTests.runTaskInputText(runTaskName, '[info] running org.eclipse.che.examples.HelloWorld', 'Test User', 120_000);
        codeExecutionTests.closeTerminal(runTaskName);
        codeExecutionTests.runTask(testTaskName, 120_000);
        codeExecutionTests.closeTerminal(testTaskName);
    });

    suite('Language server validation', async () => {
        commonLsTests.errorHighlighting(tabTitle, 'Abc:', 21);
        // commonLsTests.suggestionInvoking(tabTitle, 15, 31, 'Console scala');
        commonLsTests.autocomplete(tabTitle, 25, 28, 'name: String');
        // commonLsTests.codeNavigation(tabTitle, 19, 7, codeNavigationClassName, 30_000); // not working
    });

    suite ('Stopping and deleting the workspace', async () => {
        let workspaceName = 'not defined';
        suiteSetup(async () => {
            workspaceName = await WorkspaceNameHandler.getNameFromUrl();
        });

        test(`Stop and remowe workspace`, async () => {
            await workspaceHandling.stopAndRemoveWorkspace(workspaceName);
        });
    });

});
