import { Injectable, EventEmitter, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginEOSService } from 'eos-ulm';
import * as moment from 'moment';

@Injectable()
export class MainService {

    public currency = 'EOS';
    public updateHeader = new EventEmitter<any>();
    public priceNull = '0.0000';
    public symbol = 'PTS';
    public author = 'prospectorsa';
    public ftid = '100000000000048';
    public logo = 'ravex-icon.png'; //(window.innerWidth <= 500) ? 'ravex-icon.png': 'ravex.svg';
    public activeOrders = 0;
    public tradeH = 0;

    constructor(private http: HttpClient, 
                public loginEOSService: LoginEOSService){
    }

    lang = localStorage.getItem('lang') || 'en';

    translateLang(lang, translate){
        localStorage.setItem('lang', lang);
        translate.use(lang);
        this.lang = lang;
    }

    getSAcoins(){
        return this.http.get('/api/v1/ft/coins');
    }
    
    getSAsells(author, symbol){
        return this.http.get(`/api/v1/ft/market?skip=0&limit=20&author=${author}&symbol=${symbol}`);
    }

    getActiveOrders(){
        return this.http.get(`/api/v1/ft/opened/${this.loginEOSService.accountName}`);
    }
    getMyOrdersHistory(){
        return this.http.get(`/api/v1/ft/my/history/${this.loginEOSService.accountName}`);
    }

    getTradeHistory(){
        return this.http.get(`/api/v1/ft/trade/history/${this.symbol}/?skip=0&limit=100`);
    }

    generateOrdersHistoryArr(data){
       if (!data) {
         return;
       }
       let result = [];
       data.forEach(elem => {
            result.push({
                date: moment(elem.time).format('LLL'),
                price: elem.priceNum,
                qty: elem.qtyNum,
                type: (elem.type === 'BUY') ? 'Buy' : 'Sell'
            });
       });
       return result;
    }

    generateOrdersArr(data){
       if (!data) {
         return;
       }
       let result = [];
       data.forEach(elem => {
            result.push({
                date: moment(elem.time).format('lll'),
                status: elem.status,
                author: elem.author,
                symbol: elem.symbol,
                amount: elem.qtyNum,
                price: elem.priceNum,
                total: (elem.qtyNum * elem.priceNum).toFixed(4),
                type: (elem.owner !== this.loginEOSService.accountName) ? 'Buy' : 'Sell'
            });
       });
       return result;
    }

    generetCoinsArr(data) {
      if (!data) {
         return;
      }
      let result = {};
      data.price.forEach((elem: any) => {
            result[elem._id.ftid] = { price: elem.price.toFixed(4) }; 
      });
      data.vol.forEach((elem: any) => {
            result[elem._id.ftid].vol = elem.volume.toFixed(4); 
            result[elem._id.ftid].min = elem.priceMin.toFixed(4);
            result[elem._id.ftid].max = elem.priceMax.toFixed(4);
            result[elem._id.ftid].change = ((elem.priceMax - elem.priceMin) / elem.priceMax * 100).toFixed(2); 
      });
      return result;
   }

   generateProductStructureFt(elem){
      if (!elem){
        return;
      }
      try {
        elem.data = (elem.data) ? JSON.parse(elem.data) : {};
      } catch (e) {
        elem.data = elem.data;
      }
      elem.info = {};
      this.generateInfo(elem.data, elem.info);

      const img = (elem.info) ? elem.info.img : '';
      return {
            id: elem.id || elem.ftid,
            ftid: elem.ftid,
            name: (elem.info) ? elem.info.name : '',
            priceString: elem.price,
            image: img,
            author: elem.author,
            offeredto: elem.offeredto,
            image_gallery: [img],
            availablity: elem.active,
            symbol: elem.symbol,
            quantity: elem.quantity || elem.balance,
            supply: elem.supply,
            max_supply: elem.max_supply,
            authorctrl: elem.authorctrl
      };
   }
   generateInfo(obj, info) {
      if (!obj) return {};
      Object.keys(obj).forEach(key => {
          if (key === 'name') {
             info['name'] = obj.name;
             // delete obj['name'];
          }
          if (key === 'desc') {
             info['desc'] = obj.desc;
             // delete obj['desc'];
          }
          if (key === 'img') {
             info['img'] = obj.img;
             // delete obj['img'];
          }
      });
   }

// end service export
}