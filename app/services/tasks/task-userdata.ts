import {Inject} from '@angular/core';

import {Database} from '../database';
import {Filesystem} from '../filesystem';
import {Settings} from '../settings';

import {ITask} from './task';
import {UserData} from '../descriptions';

export class UserDataTaskSaver implements ITask {
    private userdata: UserData;

    constructor(@Inject(Filesystem) private filesystem, @Inject(Database) private database,
        @Inject(Settings) private settings) {
    }

    public execute(): Promise<UserData> {
        var url = this.settings.setting('url_server').concat(this.userdata.avatar.substr(2));
        return this.filesystem.downloadFile(url, Filesystem.PERSISTENT).then((imagefile) => {
            this.userdata.avatar = imagefile.toURL();
            return this.database.saveUserData(this.userdata);
        }).then(() => {
            return this.userdata;
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    public getResponseData(): UserData {
        return this.userdata;
    }

    public setResponseData(responseData: any): void {
        this.userdata = responseData;
    }
}

export {ITask};