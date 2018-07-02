import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Setting } from './setting.class';
import { MessageService } from './message.service';
import { BeanService } from './bean.service';


@Injectable()
export class SettingsService extends BeanService {

	protected apiName = 'settings';

	public settings: Setting[] = null;


	constructor(protected http: Http, protected messageService: MessageService) {
		super(http, messageService);
		this.initSettings();
	}

	getApiName(): string {
		return this.apiName;
	}

	public reloadSettings(): Promise<boolean> {
		this.settings = null;
		return this.initSettings()
			.then((settings: Setting[]) => {
				return true;
			});
	}

	private initSettings(): Promise<Setting[]> {
		if (this.settings == null) {
			return this.http.get(this.getApiUrl())
				.toPromise()
				.then(response => {
					this.settings = response.json().data;
					return this.settings;
				})
				.catch((error: any) => this.handleError(error));
		}
		else {
			return Promise.resolve(this.settings);
		}
	}

	private getSetting(name: string): Promise<Setting> {
		return this.initSettings()
			.then(settings => settings.find(setting => setting.name == name))
			.catch(error => {
				this.handleError(error)
			});
	}

	private getSettingValue(name: string): Promise<string> {
		return this.getSetting(name)
			.then(setting => setting.value)
			.catch(error => {
				console.error("Error while retrieving setting: " + name);
				this.handleError(error);
			})
			;
	}

	private getSettingJSONValue(name: string): Promise<any> {
		return this.getSetting(name)
			.then(setting => JSON.parse(setting.value))
			.catch(error => this.handleError(error))
			;
	}


	public getMenuEnableHome(): Promise<string> {
		return this.getSettingValue('site.menu.enable.home');
	}

	public getMenuEnableObjects(): Promise<string> {
		return this.getSettingValue('site.menu.enable.objects');
	}

	public getMenuEnableHoas(): Promise<string> {
		return this.getSettingValue('site.menu.enable.hoas');
	}

	public getMenuEnableParties(): Promise<string> {
		return this.getSettingValue('site.menu.enable.parties');
	}

	public getMenuEnablePartyAccount(): Promise<string> {
		return this.getSettingValue('site.menu.enable.partyaccount');
	}

	public getMenuEnableProjects(): Promise<string> {
		return this.getSettingValue('site.menu.enable.projects');
	}

	public getAutoSaveEnable(): Promise<string> {
		return this.getSettingValue('site.autosave.enable');
	}

	public getAutoSaveDebounceTimeMillis(): Promise<number> {
		return this.getSettingValue('site.autosave.debouncetimemillis')
			.then((s) => Number.parseInt(s));
	}

	public getPartyAccountEnableHeading2(): Promise<string> {
		return this.getSettingValue('partyaccount.enable.heading2');
	}

	public getPartyAccountEnableHeading3(): Promise<string> {
		return this.getSettingValue('partyaccount.enable.heading3');
	}

	public getPartyAccountEnableHeading4(): Promise<string> {
		return this.getSettingValue('partyaccount.enable.heading4');
	}

	public getPartyAccountEnableHeading5(): Promise<string> {
		return this.getSettingValue('partyaccount.enable.heading5');
	}

	public getPartyAccountEnableHeading6(): Promise<string> {
		return this.getSettingValue('partyaccount.enable.heading6');
	}

	public getObjectDetailEnableHeading1(): Promise<string> {
		return this.getSettingValue('objectdetail.enable.heading1');
	}

	public getObjectDetailEnableHeading1Goals(): Promise<string> {
		return this.getSettingValue('objectdetail.enable.heading1.goals');
	}

	public getObjectDetailEnableHeading2(): Promise<string> {
		return this.getSettingValue('objectdetail.enable.heading2');
	}

	public getObjectDetailEnableHeading3(): Promise<string> {
		return this.getSettingValue('objectdetail.enable.heading3');
	}

	public getObjectDetailEnableHeading4(): Promise<string> {
		return this.getSettingValue('objectdetail.enable.heading4');
	}

	public getObjectDetailEnableHeading5(): Promise<string> {
		return this.getSettingValue('objectdetail.enable.heading5');
	}

	public getObjectDetailEnableHeading6(): Promise<string> {
		return this.getSettingValue('objectdetail.enable.heading6');
	}

	public getObjectDetailTagFilters(): Promise<any[]> {
		return this.getSettingJSONValue('objectdetail.tagfilters');
	}

	public getObjectDetailTagFiltersDefaultSelection(): Promise<string> {
		return this.getSettingValue('objectdetail.tagfilters.defaultselection');
	}

	public getObjectDetailTagFiltersOverruledSelection(): Promise<any[]> {
		return this.getSettingJSONValue('objectdetail.tagfilters.overruledselection');
	}

	public getObjectDetailShowTags(): Promise<string> {
		return this.getSettingValue('objectdetail.showtags');
	}

	public getHoaDetailEnableHeading1(): Promise<string> {
		return this.getSettingValue('hoadetail.enable.heading1');
	}

	public getHoaDetailEnableHeading1Goals(): Promise<string> {
		return this.getSettingValue('hoadetail.enable.heading1.goals');
	}

	public getHoaDetailEnableHeading2(): Promise<string> {
		return this.getSettingValue('hoadetail.enable.heading2');
	}

	public getHoaDetailEnableHeading3(): Promise<string> {
		return this.getSettingValue('hoadetail.enable.heading3');
	}

	public getHoaDetailEnableHeading4(): Promise<string> {
		return this.getSettingValue('hoadetail.enable.heading4');
	}

	public getHoaDetailEnableHeading5(): Promise<string> {
		return this.getSettingValue('hoadetail.enable.heading5');
	}

	public getHoaDetailEnableHeading6(): Promise<string> {
		return this.getSettingValue('hoadetail.enable.heading6');
	}

	public getHoaDetailTagFilters(): Promise<any[]> {
		return this.getSettingJSONValue('hoadetail.tagfilters');
	}

	public getHoaDetailTagFiltersDefaultSelection(): Promise<string> {
		return this.getSettingValue('hoadetail.tagfilters.defaultselection');
	}

	public getHoaDetailTagFiltersOverruledSelection(): Promise<any[]> {
		return this.getSettingJSONValue('hoadetail.tagfilters.overruledselection');
	}

	public getHoaDetailShowTags(): Promise<string> {
		return this.getSettingValue('hoadetail.showtags');
	}

	public getQuestionInstanceShowTreeReference(): Promise<string> {
		return this.getSettingValue('questioninstance.showtreereference');
	}

	public getEmailFromAdress(): Promise<string> {
		return this.getSettingValue('email.fromaddress');
	}

}