import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DiagramModule } from './diagram/diagram.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DiagramModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
