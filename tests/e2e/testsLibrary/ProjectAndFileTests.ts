/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { E2EContainerSingleton } from '../inversify.config';
import { Container } from 'inversify';
import { Ide } from '../pageobjects/ide/Ide';
import { CLASSES } from '../inversify.types';
import { ProjectTree } from '../pageobjects/ide/ProjectTree';
import { TestConstants } from '../TestConstants';
import { Editor } from '../pageobjects/ide/Editor';

const e2eContainer: Container = E2EContainerSingleton.getInstance();
const ide: Ide = e2eContainer.get(CLASSES.Ide);
const projectTree: ProjectTree = e2eContainer.get(CLASSES.ProjectTree);
const namespace: string = TestConstants.TS_SELENIUM_USERNAME;
const editor: Editor = e2eContainer.get(CLASSES.Editor);

export function waitWorkspaceReadiness(workspaceName : string, sampleName : string, folder: string) {
    test('Wait for workspace readiness', async () => {
        await ide.waitWorkspaceAndIde(namespace, workspaceName);
        await projectTree.openProjectTreeContainer();
        await projectTree.waitProjectImported(sampleName, folder);
    });
}

export function openFile(filePath: string, fileName: string) {
    test('Expand project and open file in editor', async () => {
        await projectTree.expandPathAndOpenFileInAssociatedWorkspace(filePath, fileName);
        await projectTree.expandPathAndOpenFile(filePath, fileName);
        await editor.selectTab(fileName);
    });
}
