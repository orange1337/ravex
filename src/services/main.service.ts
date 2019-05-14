import { Injectable, EventEmitter, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MainService {


    constructor(private http: HttpClient){}

    getSAcoins(){
        return this.http.get('/api/v1/ft/popular');
    }
    
    getSAsells(author, symbol){
        return this.http.get(`/api/v1/ft/market?skip=0&limit=20&author=${author}&symbol=${symbol}`);
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