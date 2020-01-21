import { E2EContainerSingleton } from '../../inversify.config';

import { DriverHelper } from '../../utils/DriverHelper';

import { CLASSES, TYPES } from '../../inversify.types';

import { ICheLoginPage } from '../../pageobjects/login/ICheLoginPage';

import { TestConstants } from '../../TestConstants';

/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/


const e2eContainer = E2EContainerSingleton.getInstance();
const driverHelper: DriverHelper = e2eContainer.get(CLASSES.DriverHelper);
const loginPage: ICheLoginPage = e2eContainer.get<ICheLoginPage>(TYPES.CheLogin);

suite('Login test', async () => {
    test('Login', async () => {
        await driverHelper.navigateToUrl(TestConstants.TS_SELENIUM_BASE_URL);
        await loginPage.login();
    });
});
