import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FormsModule } from '@angular/forms';
import { TrainService } from './services/train.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    TabsModule.forRoot(),
    TypeaheadModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [TrainService],
  bootstrap: [AppComponent]
})
export class AppModule {}
