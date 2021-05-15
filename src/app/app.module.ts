import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LineChartComponent } from './line-chart/line-chart.component';
import { GuageChartComponent } from './guage-chart/guage-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    GuageChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
