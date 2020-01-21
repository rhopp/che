import { E2EContainerSingleton } from '../inversify.config';
import { RequestHandler } from './RequestHandler';
import { CLASSES } from '../inversify.types';
import { RequestType } from './RequestType';
import { TestConstants } from '../TestConstants';

// const e2eContainer = E2EContainerSingleton.getInstance();

export class PreferencesHandler {

    // requestHandler: RequestHandler = e2eContainer.get(CLASSES.RequestHandler);

    public async setTerminalToDom() {
        return true;
        // this.isSetToDom();
        // this.setToDom();
        // if ( await this.isSetToDom() ) {
        //     console.log('User preferences are already set to use terminal as a DOM.');
        // } else {
        //     console.log('Setting user preferences to use terminal as a DOM.');
        //     await this.setToDom();
        // }
    }

    private async isSetToDom() : Promise<boolean> {
        // const response = await this.requestHandler.processRequest(RequestType.GET, `${TestConstants.TS_SELENIUM_BASE_URL}/api/preferences`);
        // let responseString = JSON.stringify(response.data);
        // if ( responseString.includes('"terminal.integrated.rendererType":"dom"') ) {
        //      return true;
        // }
        // return false;
        return true;
    }

    private setToDom() {
       console.log('Setting to dom...')   ;
    }

}
