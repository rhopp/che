/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { PreferencesHandler } from '../../utils/PreferencesHandler';
import { E2EContainerSingleton } from '../../inversify.config';
import { CLASSES } from '../../inversify.types';

const e2eContainer = E2EContainerSingleton.getInstance();
const preferencesHandler: PreferencesHandler = e2eContainer.get(CLASSES.PreferencesHandler);
suite('Java Vert.x test', async () => {

    suite (`Terminal test`, async () => {
        preferencesHandler.setTerminalToDom();
    });
});
