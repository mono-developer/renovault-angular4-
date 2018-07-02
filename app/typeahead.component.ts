import { Component, OnInit, EventEmitter, Output, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Bean } from './bean.class';
import { Party } from './party.class';
import { PartyService } from './party.service';
import { ObjectService } from './object.service';
import { ContentService } from './content.service';
import { MessageService } from './message.service';


@Component({
  selector: 'typeahead',
  templateUrl: 'app_html/typeahead.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeaheadComponent),
      multi: true
    }
  ]
})


export class TypeaheadComponent implements OnInit, ControlValueAccessor {

  @Output()
  onSelectionChanged = new EventEmitter<any>();

  @Output()
  onAddClicked = new EventEmitter<string>();

  @Input()
  inputBeanType: string = 'party';

  @Input()
  inputOnlyEmail: boolean = false;

  @Input()
  inputSelectedBeanId: number = null;

  @Input()
  inputSelectedPartyEmail: string = null;

  @Input()
  inputNewPartyType: string;

  private enteredValue: string;
  private dataSource: Observable<Bean[]>;

  private beans: Bean[];
  public selectedBean: Bean;

  private displayInInit: boolean = true;
  private displayPlaceholderMessage = "";
  private displayTypeaheadLoading: boolean;
  private displayTypeaheadNoResults: boolean;

  // private emailRegexp: RegExp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9]))*$/i;
  private emailRegexp: RegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;



  public constructor(private partyService: PartyService, private objectService: ObjectService, private contentService: ContentService, private messageService: MessageService) {
    this.dataSource = Observable
      .create((observer: any) => {
        // Runs on every search
        observer.next(this.enteredValue);
      })
      .mergeMap((token: string) => this.getBeansAsObservable(token));
  }

  public ngOnInit() {

    if (this.inputBeanType == 'party') {

      this.partyService.getParties()
        .then(beans => {
          this.beans = beans;
        });

      if (this.inputSelectedBeanId) {
        this.partyService.getParty(this.inputSelectedBeanId)
          .then(p => {
            this.changeSelectedBean(p);
            if (this.selectedBean) {
              this.enteredValue = this.getBeanDisplayString(this.selectedBean);
            }
            this.displayInInit = false;
          })
          .catch(e => {
            this.displayInInit = false;
          });
      }
      else if (this.inputSelectedPartyEmail) {
        this.partyService.getPartyByEmail(this.inputSelectedPartyEmail)
          .then(p => {
            this.changeSelectedBean(p);
            if (this.selectedBean) {
              this.enteredValue = (this.selectedBean as Party).email;
            }
            this.displayInInit = false;
          })
          .catch(e => {
            this.displayInInit = false;
          })
          ;
      }
      else {
        this.displayInInit = false;
      }
      this.displayPlaceholderMessage = "Zoeken in uw contacten...";

      if (this.inputOnlyEmail) {
        this.displayPlaceholderMessage = "Email toevoegen of op email zoeken in uw contacten...";
      }
    }
    else if (this.inputBeanType == 'object') {

      this.objectService.getObjects()
        .then(beans => {
          this.beans = beans;
        });

      this.objectService.getObject(this.inputSelectedBeanId)
        .then(p => {
          this.changeSelectedBean(p);
          if (this.selectedBean) {
            this.enteredValue = this.getBeanDisplayString(this.selectedBean);
          }
          this.displayInInit = false;
        })
        .catch(e => {
          this.displayInInit = false;
        });

      this.displayPlaceholderMessage = "Zoeken in uw huizen...";
    }

  }

  private getBeansAsObservable(token: string): Observable<Bean[]> {

    return Observable.of(
      this.beans.filter((p: Bean) => {
        return this.checkForMatch(token, p, false);
      })
    );
  }

  private onTypeaheadLoading(e: boolean): void {
    if (this.selectedBean != null && !this.checkForMatch(this.enteredValue, this.selectedBean, true)) {
      this.changeSelectedBean(null);
    }
    else if (this.selectedBean == null) {
      // safe subscription, completes immediately
      this.getBeansAsObservable(this.enteredValue)
        .subscribe(ps => {
          if (ps != null && ps.length >= 1) {
            let p: Bean = ps[0];

            if (this.checkForMatch(this.enteredValue, p, true)) {
              this.changeSelectedBean(p);
            }
          }
        });
    }
    this.displayTypeaheadLoading = e;
  }

  private checkForMatch(query: string, bean: Bean, fullMatch: boolean): boolean {

    if (query == null || query.length == 0) {
      return false;
    }

    let beanText: string = this.getBeanDisplayString(bean);

    if (fullMatch) {
      // look for full match
      if (beanText.toLowerCase() == query.toLowerCase()) {
        return true;
      }
    }
    else {
      if (beanText != null && beanText.length > 0) {
        return beanText.toLowerCase().includes(query.toLowerCase());
      }
    }
    return false;
  }

  private getBeanDisplayString(bean: Bean): string {
    if (this.inputBeanType == 'party' && this.inputOnlyEmail) {
      return (bean as Party).email;
    }
    else {
      return bean.getDisplayString();
    }
  }

  private onTypeaheadNoResults(e: boolean): void {
    this.displayTypeaheadNoResults = e;
  }

  private onTypeaheadOnSelect(e: TypeaheadMatch): void {
    this.changeSelectedBean(e.item);
  }

  private changeSelectedBean(b: Bean) {
    this.selectedBean = b;
    this.onSelectionChanged.emit(this.selectedBean);
    this.onChange(this.selectedBean);
  }

  private add() {
    this.onAddClicked.emit(this.enteredValue);
    this.partyService.addNewParty()
      .then(p => {
        p.partytype = this.inputNewPartyType;

        if (this.isEmail(this.enteredValue)) {
          p.email = this.enteredValue;
        }
        else {
          if (this.inputNewPartyType == 'houseowner') {
            p.lastname = this.enteredValue;
          }
          else {
            p.companyname = this.enteredValue;
          }
        }

        this.partyService.updateParty(p)
          .then(p => {
            p = Party.parse(p);
            this.messageService.sendMessage("'" + this.getBeanDisplayString(p) + "' is toegevoegd aan uw contactenlijst.", "");
            this.onTypeaheadNoResults(false);
            this.changeSelectedBean(p);
          });

      })
  }

  private isEmail(s: string): boolean {
    if (this.emailRegexp.test(s)) {
      return true;
    }
    return false;
  }

  private displayValidEmail(): boolean {
    return this.isEmail(this.enteredValue);
  }

  private displayValidNewContact() {
    if (this.inputBeanType == 'party' && !this.selectedBean && !this.inputOnlyEmail && this.enteredValue) {
      return true;
    }
    if (this.inputBeanType == 'party' && !this.selectedBean && this.inputOnlyEmail && this.displayValidEmail()) {
      return true;
    }
    return false;
  }

  public reset() {
    this.enteredValue = null;
    this.changeSelectedBean(null);
    this.inputSelectedPartyEmail = null;
    this.inputSelectedBeanId = null;
    this.ngOnInit();
  }


  writeValue(value: any) {
    // not supported
  }

  private onChange = (_) => { };
  private onTouched = () => { };
  public registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }


  // writeValue(obj: any): void {
  //   throw new Error("Method not implemented.");
  // }
  // registerOnChange(fn: any): void {
  //   throw new Error("Method not implemented.");
  // }
  // registerOnTouched(fn: any): void {
  //   throw new Error("Method not implemented.");
  // }
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error("Method not implemented.");
  // }


}