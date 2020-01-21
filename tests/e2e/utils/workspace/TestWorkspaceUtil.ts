/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { injectable, inject } from 'inversify';
import { error } from 'selenium-webdriver';
import { ITestWorkspaceUtil } from './ITestWorkspaceUtil';
import { E2EContainerSingleton } from '../../inversify.config';
import { TestConstants } from '../../TestConstants';
import { RequestHandler } from '../RequestHandler';
import { CLASSES } from '../../inversify.types';
import { DriverHelper } from '../DriverHelper';
import { WorkspaceStatus } from './WorkspaceStatus';
import { RequestType } from '../RequestType';


@injectable()
export class TestWorkspaceUtil implements ITestWorkspaceUtil {
    e2eContainer = E2EContainerSingleton.getInstance();
    workspaceApiUrl: string = `${TestConstants.TS_SELENIUM_BASE_URL}/api/workspace`;
    requestHandler: RequestHandler = this.e2eContainer.get(CLASSES.RequestHandler);

    constructor(@inject(CLASSES.DriverHelper) private readonly driverHelper: DriverHelper) {

    }

    public async waitWorkspaceStatus(namespace: string, workspaceName: string, expectedWorkspaceStatus: WorkspaceStatus) {
        const workspaceStatusApiUrl: string = `${this.workspaceApiUrl}/${namespace}:${workspaceName}`;
        const attempts: number = TestConstants.TS_SELENIUM_WORKSPACE_STATUS_ATTEMPTS;
        const polling: number = TestConstants.TS_SELENIUM_WORKSPACE_STATUS_POLLING;
        let workspaceStatus: string = '';

        for (let i = 0; i < attempts; i++) {
            const response = await this.requestHandler.processRequest(RequestType.GET, workspaceStatusApiUrl);

            if (response.status !== 200) {
                await this.driverHelper.wait(polling);
                continue;
            }

            workspaceStatus = await response.data.status;

            if (workspaceStatus === expectedWorkspaceStatus) {
                return;
            }

            await this.driverHelper.wait(polling);
        }

        throw new error.TimeoutError(`Exceeded the maximum number of checking attempts, workspace status is: '${workspaceStatus}' different to '${expectedWorkspaceStatus}'`);
    }

    public async waitPluginAdding(namespace: string, workspaceName: string, pluginName: string) {
        const workspaceStatusApiUrl: string = `${this.workspaceApiUrl}/${namespace}:${workspaceName}`;
        const attempts: number = TestConstants.TS_SELENIUM_PLUGIN_PRECENCE_ATTEMPTS;
        const polling: number = TestConstants.TS_SELENIUM_PLUGIN_PRECENCE_POLLING;

        for (let i = 0; i < attempts; i++) {
            const response = await this.requestHandler.processRequest(RequestType.GET, workspaceStatusApiUrl);

            if (response.status !== 200) {
                await this.driverHelper.wait(polling);
                continue;
            }

            const machines: string = JSON.stringify(response.data.runtime.machines);
            const isPluginPresent: boolean = machines.search(pluginName) > 0;

            if (isPluginPresent) {
                break;
            }

            if (i === attempts - 1) {
                throw new error.TimeoutError(`Exceeded maximum tries attempts, the '${pluginName}' plugin is not present in the workspace runtime.`);
            }

            await this.driverHelper.wait(polling);
        }
    }

    public async getListOfWorkspaceId() {
        const getAllWorkspacesResponse = await this.requestHandler.processRequest(RequestType.GET, this.workspaceApiUrl);

        interface IMyObj {
            id: string;
            status: string;
        }
        let stringified = JSON.stringify(getAllWorkspacesResponse.data);
        let arrayOfWorkspaces = <IMyObj[]>JSON.parse(stringified);
        let wsList: Array<string> = [];
        for (let entry of arrayOfWorkspaces) {
            wsList.push(entry.id);
        }
        return wsList;
    }

    public async getIdOfRunningWorkspaces(): Promise<Array<string>> {
        try {
            const getAllWorkspacesResponse = await this.requestHandler.processRequest(RequestType.GET, this.workspaceApiUrl);

            interface IMyObj {
                id: string;
                status: string;
            }
            let stringified = JSON.stringify(getAllWorkspacesResponse.data);
            let arrayOfWorkspaces = <IMyObj[]>JSON.parse(stringified);
            let idOfRunningWorkspace: Array<string> = new Array();

            for (let entry of arrayOfWorkspaces) {
                if (entry.status === 'RUNNING') {
                    idOfRunningWorkspace.push(entry.id);
                }
            }

            return idOfRunningWorkspace;
        } catch (err) {
            console.log(`Getting id of running workspaces failed. URL used: ${this.workspaceApiUrl}`);
            throw err;
        }
    }

    getIdOfRunningWorkspace(namespace: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public async removeWorkspaceById(id: string) {
        const workspaceIdUrl: string = `${this.workspaceApiUrl}/${id}`;
        const attempts: number = TestConstants.TS_SELENIUM_PLUGIN_PRECENCE_ATTEMPTS;
        const polling: number = TestConstants.TS_SELENIUM_PLUGIN_PRECENCE_POLLING;
        let stopped: Boolean = false;

        for (let i = 0; i < attempts; i++) {

            const getInfoResponse = await this.requestHandler.processRequest(RequestType.GET, workspaceIdUrl);

            if (getInfoResponse.data.status === 'STOPPED') {
                stopped = true;
                break;
            }
            await this.driverHelper.wait(polling);
        }

        if (stopped) {
            try {
                const deleteWorkspaceResponse = await this.requestHandler.processRequest(RequestType.DELETE, workspaceIdUrl);

                // response code 204: "No Content" expected
                if (deleteWorkspaceResponse.status !== 204) {
                    throw new Error(`Can not remove workspace. Code: ${deleteWorkspaceResponse.status} Data: ${deleteWorkspaceResponse.data}`);
                }
            } catch (err) {
                console.log(`Removing of workspace failed.`);
                throw err;
            }
        } else {
            throw new Error(`Can not remove workspace with id ${id}, because it is still not in STOPPED state.`);
        }
    }

    public async stopWorkspaceById(id: string) {
        const stopWorkspaceApiUrl: string = `${this.workspaceApiUrl}/${id}/runtime`;
        try {
            const stopWorkspaceResponse = await this.requestHandler.processRequest(RequestType.DELETE, stopWorkspaceApiUrl);

            // response code 204: "No Content" expected
            if (stopWorkspaceResponse.status !== 204) {
                throw new Error(`Can not stop workspace. Code: ${stopWorkspaceResponse.status} Data: ${stopWorkspaceResponse.data}`);
            }
        } catch (err) {
            console.log(`Stopping workspace failed. URL used: ${stopWorkspaceApiUrl}`);
            throw err;
        }

    }

    public async cleanUpAllWorkspaces() {
        let listOfRunningWorkspaces: Array<string> = await this.getIdOfRunningWorkspaces();
        for (const entry of listOfRunningWorkspaces) {
            await this.stopWorkspaceById(entry);
        }

        let listAllWorkspaces: Array<string> = await this.getListOfWorkspaceId();

        for (const entry of listAllWorkspaces) {
            this.removeWorkspaceById(entry);
        }

    }

    removeWorkspace(namespace: string, workspaceId: string): void {
        throw new Error('Method not implemented.');
    }

    stopWorkspace(namespace: string, workspaceId: string): void {
        throw new Error('Method not implemented.');
    }
}
