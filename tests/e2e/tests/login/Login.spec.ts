/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { E2EContainerSingleton, TestConstants, DriverHelper, CLASSES, ICheLoginPage, TYPES } from '../..';

const e2eContainer = E2EContainerSingleton.getInstance();
const driverHelper: DriverHelper = e2eContainer.get(CLASSES.DriverHelper);
const loginPage: ICheLoginPage = e2eContainer.get<ICheLoginPage>(TYPES.CheLogin);

suite('Login test', async () => {
    test('Login', async () => {
        await driverHelper.navigateToUrl(TestConstants.TS_SELENIUM_BASE_URL);
        await loginPage.login();
    });
});
