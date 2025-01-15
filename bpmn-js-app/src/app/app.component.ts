import { Component } from '@angular/core';
import type { ImportDoneEvent } from 'bpmn-js/lib/BaseViewer';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bpmn-js-angular';
  diagramUrl = 'https://cdn.statically.io/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  importError?: Error;

  handleImported(event: ImportDoneEvent) {

    const {
      error,
      warnings
    } = event;

    if (!error) {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    } else {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }

}
