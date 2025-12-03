import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  bootstrap: [AppComponent],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule { }
