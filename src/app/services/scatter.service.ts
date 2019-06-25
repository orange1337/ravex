import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginEOSService } from 'eos-ulm';

@Injectable()
export class ScatterService {

  constructor(public loginEOSService: LoginEOSService,
              private router: Router,
              private http: HttpClient) {}

  showErr(message){
      this.loginEOSService.contractError({ message });
  }

  buyItemFT(ftid, priceString) {
      let memo = JSON.stringify({ ftid });
      this.loginEOSService.eos.transfer(this.loginEOSService.accountName, environment.market, priceString, memo, this.loginEOSService.options)
          .then((result: any) => {
               if (result && result.transaction_id && result.processed && result.processed.block_num) {
                   this.loginEOSService.showMessage('Item(s) successfully bought!');
               }
          }).catch(err => {
               this.loginEOSService.contractError(err);
          });
  }

  getAvailableItems() {
      return this.loginEOSService.eos.getTableRows({  json: true,
                                       code:  environment.asset,
                                       scope: this.loginEOSService.accountName,
                                       table: environment.tables.assets,
                                       table_key: 'string',
                                       lower_bound: '0',
                                       upper_bound: '-1',
                                       limit: 100 });
  }

  getAuthors() {
      return this.loginEOSService.eos.getTableRows({   json: true,
                                       code:  environment.asset,
                                       scope: environment.asset,
                                       table: environment.tables.authors,
                                       table_key: 'string',
                                       lower_bound: '0',
                                       upper_bound: '-1',
                                       limit: 100 });
  }

  getAuthorsByName(name) {
      return this.loginEOSService.eos.getTableRows({   json: true,
                                       code:  environment.asset,
                                       scope: environment.asset,
                                       table: environment.tables.authors,
                                       table_key: 'id',
                                       lower_bound: `${name}`,
                                       upper_bound: `${name}a`,
                                       limit: 1 });
  }

  getAvailableItemsFT() {
      return this.loginEOSService.eos.getTableRows({  json: true,
                                       code:  environment.asset,
                                       scope: this.loginEOSService.accountName,
                                       table: environment.tables.assetsFt,
                                       table_key: 'string',
                                       lower_bound: '0',
                                       upper_bound: '-1',
                                       limit: 100 });
  }

  getClaimItems() {
      return this.http.get(`/api/v1/${this.loginEOSService.accountName}/claims`);
  }

  getContractAbi(){
      return this.loginEOSService.eos.getAbi({account_name: environment.asset})
  }

  getAccount() {
      return this.loginEOSService.eos.getAccount({
              account_name: this.loginEOSService.accountName
      });
  }

// ==== service end
}





