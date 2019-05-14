import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../environments/environment';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ScatterService {

  eos = (<any>window).Eos(environment.Eos);
  accountName: any = '';
  navigator: any = navigator;
  ScatterJS;
  loggedIn = new EventEmitter<boolean>();
  productMy = new EventEmitter<[]>();
  productOpened = new EventEmitter<[]>();
  productClaim = new EventEmitter<[]>();
  selectArrMy = [];
  selectArrOpened = [];
  selectArrClaim = [];
  initCounterErr = 0;

  constructor(private toastyService: ToastaService,
              private toastyConfig: ToastaConfig,
              private router: Router,
              private http: HttpClient) {
     (<any>window).ScatterJS.plugins(new (<any>window).ScatterEOS());
  }

  returnEosNet() {
       return this.eos;
  }

  initScatter() {
    (<any>window).ScatterJS.scatter.connect('simple-market').then(connected => {
      if (!connected) {
          if (this.initCounterErr < 3){
              this.initCounterErr += 1;
              return this.initScatter();
          }
          return this.showScatterError('Can\'t connect to Scatter');
      }
      this.ScatterJS       = (<any>window).ScatterJS.scatter;
      (<any>window).scatter  = null;
      this.eos             = this.ScatterJS.eos(environment.network, (<any>window).Eos, { chainId: environment.network.chainId }, environment.network.protocol);

      this.ScatterJS.getIdentity({ accounts: [environment.network] }).then(identity => {
              if (identity.accounts.length === 0) {
                  return;
              }

              let objectIdentity;
              if (this.ScatterJS.identity && this.ScatterJS.identity.accounts) {
                     objectIdentity = this.ScatterJS.identity.accounts.find(x => x.blockchain === 'eos');
              }
              objectIdentity   = { name: identity.accounts[0].name };
              this.accountName = objectIdentity.name;
              localStorage.setItem('wallet', 'connected');
              localStorage.setItem('account', this.accountName);
      
              this.loggedIn.emit(true);
              this.showMessage(`Hi ${this.accountName} :)`);
      }).catch(error => {
        this.showScatterError(error);
        this.loggedIn.emit(false);
      });
    }).catch(error => {
        this.showScatterError(error);
        this.loggedIn.emit(false);
    });
  }

  showScatterError(error) {
    if (!error) { return; }
    let msg = error.message;
    if (error.type === 'identity_rejected'){
        location.reload();
    }
    const toastOption: ToastOptions = {
         title: 'Error',
         msg: msg || error,
         showClose: true,
         timeout: 3000,
         theme: 'material'
    };
    this.toastyService.error(toastOption);
  }

  buyItem(data: any, currency) {
        let dateNow = Math.floor(+new Date() / 1000);
        let amount = (!data.offertime || data.offertime < dateNow) ? data.price : data.discount_price;
        let price  = Number(amount).toFixed(4);
        let memo = JSON.stringify({nftid: Number(data.id)});
        this.eos.transfer(this.accountName, environment.market, `${price} ${currency}`, memo, { authorization: [this.accountName] })
           .then((result: any) => {
                if (result && result.transaction_id && result.processed && result.processed.block_num) {
                    this.showMessage('Item(s) successfully bought!');
                    localStorage.setItem('walletType', 'nft');
                    this.router.navigate([`/session/thx/${result.transaction_id}/${result.processed.block_num}`]);
                }
           }).catch(err => {
                this.contractError(err);
           });
  }

  buyItemFT(data: any) {
        //let dateNow = Math.floor(+new Date() / 1000);
        //let amount = (!data.offertime || data.offertime < dateNow) ? data.price : data.discount_price;
        //let price  = Number(amount).toFixed(4);
        let memo = JSON.stringify({ftid: Number(data.sellid)});
        this.eos.transfer(this.accountName, environment.market, data.priceString, memo, { authorization: [this.accountName] })
           .then((result: any) => {
                if (result && result.transaction_id && result.processed && result.processed.block_num) {
                    this.showMessage('Item(s) successfully bought!');
                    localStorage.setItem('walletType', 'ft');
                }
           }).catch(err => {
                this.contractError(err);
           });
  }

  sellItem(data, price, offerprice, offertime) {
        let memo = {};
        memo['price'] = price;
        if (offerprice){
            memo['offerprice'] = offerprice;
        }
        if (offertime){
            memo['offertime'] = offertime / 1000; // convert to sec
        } 
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.transfer(this.accountName, environment.market, data, JSON.stringify(memo), { authorization: [this.accountName] })
                    .then(result => {
                         this.selectArrMy = [];
                         this.showMessage('Item(s) successfully published!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  sellItemFT(data, price, qty, click) {
        let memo = {};
        memo['price'] = price;
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.transferf(this.accountName, environment.market, data.author, qty, JSON.stringify(memo), { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item(s) successfully published!');
                         click();
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  transferFT(data, to, memo, qty, click) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.transferf(this.accountName, to, data.author, qty, JSON.stringify(memo), { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item(s) successfully transfered!');
                         click();
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

   offerFT(data, to, memo, qty, click) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.offerf(this.accountName, to, data.author, qty, JSON.stringify(memo), { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item(s) successfully offered!');
                         click();
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  claimItem(ids){
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.claim(this.accountName, ids, { authorization: [this.accountName] })
                    .then(result => {
                         this.selectArrClaim = [];
                         this.showMessage('Item(s) successfully claimed!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  claimItemFT(ids){
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.claimf(this.accountName, ids, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item(s) successfully claimed!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  cancelItem(ids) {
        this.eos.contract(environment.market, {
            accounts: [environment.network]
        }).then(contract => {
            contract.cancel(this.accountName, ids, { authorization: [this.accountName] })
                    .then(result => {
                         this.selectArrOpened = [];
                         this.showMessage('Item(s) successfully canceled!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  cancelItemFT(id) {
        this.eos.contract(environment.market, {
            accounts: [environment.network]
        }).then(contract => {
            contract.cancelf(this.accountName, id, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item successfully canceled!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  burnItems(data) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.burn(this.accountName, data, 'item(s) burn :(', { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item(s) successfully burned!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  transfer(to, data, memo, close) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.transfer(this.accountName, to, data, memo, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item(s) successfully transfered!');
                         close();
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  delegate(to, data, date, memo, close) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.delegate(this.accountName, to, data, date, memo, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item(s) successfully delegated!');
                         close();
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  undelegate(from, data) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.undelegate(this.accountName, from, data, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item(s) successfully undelegated!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  offer(to, data, memo, close) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.offer(this.accountName, to, data, memo, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Item(s) successfully offered!');
                         close();
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  cancelOffer(ids) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.canceloffer(this.accountName, ids, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Offer(s) successfully canceled!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  cancelOfferFT(ids) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.cancelofferf(this.accountName, ids, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Offer(s) successfully canceled!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  attach(id, ids) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.attach(this.accountName, id, ids, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Asset(s) successfully attached!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }
  detach(id, ids) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.detach(this.accountName, id, ids, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Asset(s) successfully detached!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }
  attachFT(author, qty, id) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.attachf(this.accountName, author, qty, id, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('FT Asset(s) successfully attached!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }
  detachFT(author, qty, id) {
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract.detachf(this.accountName, author, qty, id, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('FT Asset(s) successfully detached!');
                    }).catch(err => {
                         this.contractError(err);
                    });
        }).catch(err => {
            this.contractError(err);
        });
  }

  pushCustomTrx(fields, actionName, cb){
        this.eos.contract(environment.asset, {
            accounts: [environment.network]
        }).then(contract => {
            contract[actionName](fields, { authorization: [this.accountName] })
                    .then(result => {
                         this.showMessage('Trx successfully pushed!');
                         cb(null);
                    }).catch(err => {
                         this.contractError(err);
                         cb(err);
                    });
        }).catch(err => {
            this.contractError(err);
            cb(err);
        });
  }


  sendItemBoughtConfirm(item) {
        this.http.post('/api/v1/item/bought', { item })
                 .subscribe(res => {
                     console.log(res);
                 }, err => console.error(err));
  }

  sendItemSell(item) {
        this.http.post('/api/v1/item/sell', { item })
                 .subscribe(res => {
                      console.log(res);
                 }, err => console.error(err));
  }

  getAvailableItems() {
      return this.eos.getTableRows({  json: true,
                                       code:  environment.asset,
                                       scope: this.accountName,
                                       table: environment.tables.assets,
                                       table_key: 'string',
                                       lower_bound: '0',
                                       upper_bound: '-1',
                                       limit: 100 });
  }

  getAuthors() {
      return this.eos.getTableRows({   json: true,
                                       code:  environment.asset,
                                       scope: environment.asset,
                                       table: environment.tables.authors,
                                       table_key: 'string',
                                       lower_bound: '0',
                                       upper_bound: '-1',
                                       limit: 100 });
  }

  getAuthorsByName(name) {
      return this.eos.getTableRows({   json: true,
                                       code:  environment.asset,
                                       scope: environment.asset,
                                       table: environment.tables.authors,
                                       table_key: 'id',
                                       lower_bound: `${name}`,
                                       upper_bound: `${name}a`,
                                       limit: 1 });
  }

  getAvailableItemsFT() {
      return this.eos.getTableRows({  json: true,
                                       code:  environment.asset,
                                       scope: this.accountName,
                                       table: environment.tables.assetsFt,
                                       table_key: 'string',
                                       lower_bound: '0',
                                       upper_bound: '-1',
                                       limit: 100 });
  }

  getClaimItems() {
      return this.http.get(`/api/v1/${this.accountName}/claims`);
  }

  getContractAbi(){
      return this.eos.getAbi({account_name: environment.asset})
  }

  getAccount() {
      return this.eos.getAccount({
              account_name: this.accountName
      });
  }

  contractError(err) {
      if (!err) {
         return;
      }
      if (!err.message){
        try{
            err = JSON.parse(err).error.details[0].message;
        } catch(e){
            console.log(e);
        }
      } else {
        err = err.message;
      }
      if (err.indexOf('requires a config.keyProvider') >= 0) err = 'Please, login Scatter first!';

      const toastOption: ToastOptions = {
         title: 'Error',
         msg: err,
         showClose: true,
         timeout: 5000,
         theme: 'material'
      };
      this.toastyService.error(toastOption);
  }

  showErr(err) {
      let error;
      try {
         error = JSON.parse(err);
      } catch (e) {
         console.error(e);
         error = err;
      }
      if (!error || !error.error || !error.error.details || !error.error.details[0]) {
         return;
      }
      const toastOption: ToastOptions = {
         title: 'Error',
         msg: error.error.details[0].message,
         showClose: true,
         timeout: 3000,
         theme: 'material'
      };
      this.toastyService.error(toastOption);
  }

  showMessage(msg) {
      const toastOption: ToastOptions = {
         title: '',
         msg: msg,
         showClose: true,
         timeout: 1500,
         theme: 'material'
      };
      this.toastyService.success(toastOption);
  }

  logout() {
    (<any>window).ScatterJS.scatter.forgetIdentity().then(() => {
          localStorage.setItem('account', '');
          localStorage.setItem('wallet', 'disconnect');
          location.href = '/';
    }).catch(err => {
          console.error(err);
    });
  }

  setItem(name, value) {
     localStorage.setItem(name, value);
  }

  getItem(name) {
     return localStorage.getItem(name);
  }

// ==== service end
}





