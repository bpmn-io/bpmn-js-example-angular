import {HttpClient} from '@angular/common/http';
import {
  AfterContentInit, AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, NgZone,
  OnChanges,
  OnDestroy, OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import minimapModule from 'diagram-js-minimap';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import * as camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BpmnWarning} from '../interfaces/bpmn-warning';
import {ImportEvent} from '../interfaces/import-event';

import {importDiagram} from './rx';

import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-diagram',
  templateUrl: 'diagram.component.html',
  styleUrls: ['diagram.component.scss'],
})
export class DiagramComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @ViewChild('containerRef', {static: true}) containerRef: ElementRef;
  @ViewChild('propertiesRef', {static: true}) propertiesRef: ElementRef;
  @Input() url: string;
  private disabled = false;
  private modeler: BpmnModeler;
  private _value = '';

  constructor(
    private zone: NgZone,
  ) {
  }

  ngOnInit() {
    this.modeler = new BpmnModeler({
      container: this.containerRef.nativeElement,
      propertiesPanel: {
        parent: this.propertiesRef.nativeElement,
      },
      additionalModules: [
        propertiesProviderModule,
        propertiesPanelModule,
        minimapModule,
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });

    this.modeler.get('eventBus').on('commandStack.changed', () => this.saveDiagram());
  }

  ngAfterViewInit() {
    this.openDiagram(this._value);
  }

  onChange = (value: any) => {
  }

  onTouched = () => {
  }

  get value(): any {
    return this._value;
  }

  // Allows Angular to update the model.
  // Update the model and changes needed for the view here.
  writeValue(value: any): void {
    if (value !== this._value) {
      this.openDiagram(value);
    }
    this._value = value;
    this.onChange(this.value);
  }

  // Allows Angular to register a function to call when the model changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  createNewDiagram() {
    this.openDiagram();
  }

  openDiagram(xml?: string) {
    return this.zone.run(
      () => xml ?
        this.modeler.importXML(xml, err => this.onImport(err)) :
        this.modeler.createDiagram(err => this.onImport(err))
    );
  }

  saveSVG() {
    this.saveDiagram();
    this.modeler.saveSVG((err, svg) => {
      const blob = new Blob([svg], {type: 'image/svg+xml'});
      fileSaver.saveAs(blob, `BPMN Diagram - ${new Date().toISOString()}.svg`);
    });
  }

  saveDiagram() {
    this.modeler.saveXML({format: true}, (err, xml) => {
      this._value = xml;
      this.writeValue(xml);
    });
  }

  saveXML() {
    this.saveDiagram();
    this.modeler.saveXML({format: true}, (err, xml) => {
      const blob = new Blob([xml], {type: 'text/xml'});
      fileSaver.saveAs(blob, `BPMN Diagram - ${new Date().toISOString()}.xml`);
    });
  }

  onImport(err?: Error) {
    if (err) {
      return console.error('could not import BPMN 2.0 diagram', err);
    }
  }
}
