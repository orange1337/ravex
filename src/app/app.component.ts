import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	
	constructor(public translate: TranslateService){
		translate.addLangs(['en', 'zh']);
    	translate.setDefaultLang(this.lang);

    	const browserLang = translate.getBrowserLang();
    	translate.use( (browserLang.match(/en|zh/) && !this.lang) ? browserLang : this.lang);
	}
  lang = localStorage.getItem('lang') || 'en';


}
