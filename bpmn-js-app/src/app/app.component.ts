import {Component, ElementRef, ViewChild} from '@angular/core';
import {BPMN_DIAGRAM} from '../testing/mocks/diagram.mocks';
import {DiagramComponent} from './diagram/diagram.component';
import {BpmnWarning} from './interfaces/bpmn-warning';
import {ImportEvent} from './interfaces/import-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(DiagramComponent, {static: false}) private diagramComponent: DiagramComponent;
  title = 'bpmn-js-angular';
  diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  importError?: Error;
  importWarnings?: BpmnWarning[];
  xmlModel: any;

  constructor() {
    this.xmlModel = BPMN_DIAGRAM;
  }

  handleImported(event: ImportEvent) {
    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (${warnings.length} warnings)`);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
    this.importWarnings = warnings;
  }

  onSubmit(event: MouseEvent) {
    this.diagramComponent.loadUrl(this.diagramUrl);
  }

}
