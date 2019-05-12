import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home-component/home.component';

import { AppRoutingModule } from './app-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    TranslateModule.forChild(),
    MatButtonModule
  ]
})
export class HomeModule { }
