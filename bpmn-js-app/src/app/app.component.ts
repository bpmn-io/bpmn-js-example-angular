import {Component} from '@angular/core';
import {BPMN_DIAGRAM} from '../testing/mocks/diagram.mocks';
import {ImportEvent} from './interfaces/import-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bpmn-js-angular';
  diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  urlToLoad: string;
  importError?: Error;
  xmlModel: any;

  constructor() {
    this.xmlModel = BPMN_DIAGRAM;
    this.urlToLoad = this.diagramUrl;
  }

  handleImported(event: ImportEvent) {
    console.log('handleImported event', event);

    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }

  onSubmit(event: MouseEvent) {
    console.log('onSubmit event', event);
    this.urlToLoad = this.diagramUrl;
  }

}
