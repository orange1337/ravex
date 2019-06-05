import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/********** Custom option for ngx-translate ******/
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import { MainService } from './services/main.service';

import { environment } from '../environments/environment';
import { LoginEOSModule } from 'eos-ulm';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
       loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
       }
    }),
    LoginEOSModule.forRoot({
          appName: environment.appName,
          httpEndpoint: environment.Eos.httpEndpoint,
          chain: environment.chain,
          verbose: environment.Eos.verbose,
          blockchain: environment.network.blockchain,
          host: environment.network.host,
          port: environment.network.port,
          protocol: environment.network.protocol,
          expireInSeconds: environment.network.expireInSeconds
    })
  ],
  providers: [MainService],
  exports: [TranslateModule, LoginEOSModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
