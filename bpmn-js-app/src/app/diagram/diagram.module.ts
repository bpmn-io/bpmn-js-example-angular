import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DiagramComponent } from './diagram.component';

@NgModule({
  declarations: [DiagramComponent],
  exports: [DiagramComponent],
  imports: [
    BrowserModule
  ]
})
export class DiagramModule {}
