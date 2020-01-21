/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
import * as path from 'path';
import { Container } from 'inversify';

export class E2EContainerSingleton {
    private static e2eContainer: Container;

    public static getInstance(): Container {
        if (!E2EContainerSingleton.e2eContainer) {
            let pathh = path.resolve('.');
            let ContainerInitializer = require(`${pathh}/dist/driver/ContainerInitializer.js`);
            E2EContainerSingleton.e2eContainer = ContainerInitializer.getContainer();
        }

        return E2EContainerSingleton.e2eContainer;
    }

    private constructor() { }
}
