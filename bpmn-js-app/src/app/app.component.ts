import {HttpErrorResponse} from '@angular/common/http';
import {FileChangeEvent} from '@angular/compiler-cli/src/perform_watch';
import {Component, ViewChild} from '@angular/core';
import {BPMN_DIAGRAM} from '../testing/mocks/diagram.mocks';
import {BpmnWarning} from './_interfaces/bpmn-warning';
import {ImportEvent} from './_interfaces/import-event';
import {DiagramComponent} from './diagram/diagram.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bpmn-js-angular';
  diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  importError?: Error;
  importWarnings?: BpmnWarning[];
  xmlModel: any;
  @ViewChild(DiagramComponent, {static: false}) private diagramComponent: DiagramComponent;
  expandToolbar = false;
  openMethod: string;
  diagramFile: File;

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
    this.diagramFile = undefined;
    this.diagramUrl = undefined;
  }

  onSubmit($event: MouseEvent) {
    this.expandToolbar = false;

    if (this.openMethod === 'url') {
      this.diagramComponent.loadUrl(this.diagramUrl);
    } else if (this.openMethod === 'file') {
      if (this.diagramFile && this.diagramFile.type === 'text/xml') {
        const reader: FileReader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
          const xml = (event.target as FileReader).result;
          this.diagramComponent.openDiagram(xml.toString());
        };

        reader.readAsText(this.diagramFile);
      } else {
        this.handleImported({
          type: 'error',
          error: new Error('Wrong file type. Please choose a BPMN XML file.')
        });
      }
    }

    this.openMethod = undefined;
  }

  getFileName() {
    return this.diagramFile ? this.diagramFile.name : 'No file selected';
  }

  onFileSelected($event: Event) {
    this.diagramFile = ($event.target as HTMLFormElement).files[0];
  }
}
