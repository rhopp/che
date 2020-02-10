/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { TestConstants } from '../../TestConstants';
import { TYPES } from '../../inversify.types';
import { inject, injectable } from 'inversify';
import { ITokenHandler } from './ITokenHandler';
import { Logger } from '../Logger';

@injectable()
export class CheApiRequestHandler {

    axiosInstance: AxiosInstance;

    constructor(@inject(TYPES.TokenHandler) private readonly tokenHandler: ITokenHandler) {
        this.axiosInstance = axios.create({
            baseURL: `${TestConstants.TS_SELENIUM_BASE_URL}`
        });
    }

    async get(url: string, axiosRequestConfig: AxiosRequestConfig = {}): Promise<AxiosResponse> {
        const config = await this.addAuthHeaderToAxiosConfig(axiosRequestConfig, this.tokenHandler.getAuthHeader());
        return await this.axiosInstance.get(url, config);
    }

    async post(url: string, data?: string, axiosRequestConfig: AxiosRequestConfig = {}): Promise<AxiosResponse> {
        const config = await this.addAuthHeaderToAxiosConfig(axiosRequestConfig, this.tokenHandler.getAuthHeader());
        return await this.axiosInstance.post(url, data, config);
    }

    async delete(url: string, axiosRequestConfig: AxiosRequestConfig = {}): Promise<AxiosResponse> {
        const config = await this.addAuthHeaderToAxiosConfig(axiosRequestConfig, this.tokenHandler.getAuthHeader());
        return await this.axiosInstance.delete(url, config);
    }

    private async addAuthHeaderToAxiosConfig(axiosRequestConfig: AxiosRequestConfig, authHeader: any): Promise<AxiosRequestConfig> {
        Logger.debug(`Adding header ${authHeader} into request.`);
        axiosRequestConfig['headers'] = { ...axiosRequestConfig['headers'], ...authHeader };
        return axiosRequestConfig;
    }
}
