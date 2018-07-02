import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { SaveableComponent } from './saveablecomponent.class';
import { SettingsService } from './settings.service';


@Injectable()
export class AutoSaveService {

    public enabled: boolean = false;
    public status: string = 'idle';
    private form: NgForm;
    private formValueChangesSubscription: Subscription;
    private component: SaveableComponent;
    private debounceTime: number = 5000;

    constructor(private settingsService: SettingsService) {
        // get setting site.autosave.debouncetimemillis
        this.settingsService.getAutoSaveDebounceTimeMillis().then(s => this.debounceTime = s);
        this.settingsService.getAutoSaveEnable().then(s => this.enabled = (s == 'Y'));
    }


    public startMonitoring(component: SaveableComponent, form: NgForm) {
        // console.log('autosaveService.startMonitoring()');
        this.stopMonitoring(false);
        if (this.enabled && component) {
            this.component = component;
            this.form = form;
            this.status = 'saved';
            this.component = component;
            this.formValueChangesSubscription = this.form.valueChanges
                .map(() => {
                    this.status = 'changespending';
                })
                .debounceTime(this.debounceTime)
                .subscribe(() => {
                    this.saveImmediately();
                });
        }
    }

    public saveImmediately(): Promise<boolean> {
        if (this.component == null) {
            this.status = 'idle';
        }
        else {
            if (!this.form.pristine) {
                this.status = 'saving';
                return this.component.save()
                    .then((b) => {
                        // if (this.form && !this.form.invalid) {
                        this.status = 'saved';
                        // } else {
                        // this.status = 'invalidchanges';
                        // }
                        return true;
                    })
                    .catch((b) => {
                        this.status = 'errorwhilesaving';
                        return false;
                    });
            } else {
                this.status = 'saved';
            }
        }
        return Promise.resolve(true);
    }

    public stopMonitoring(logIt: boolean = true) {
        if (logIt) {
            // console.log('autosaveService.stopMonitoring()');
        }
        if (this.formValueChangesSubscription != null) {
            this.formValueChangesSubscription.unsubscribe();
            this.formValueChangesSubscription = null;
            this.form = null;
            this.component = null;
            this.status = 'idle';
        }
    }

    getForm() {
        return this.form;
    }

    logStuff() {
        // console.log('autoSaveService.logStuff()');
        console.log(this.component);
        console.log(this.form);
    }

}