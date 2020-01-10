import {HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, EventEmitter, NgZone, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import * as camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import minimapModule from 'diagram-js-minimap';

import * as fileSaver from 'file-saver';
import {BpmnWarning} from '../_interfaces/bpmn-warning';
import {ImportEvent} from '../_interfaces/import-event';
import {ApiService} from '../_services/api.service';

@Component({
  selector: 'app-diagram',
  templateUrl: 'diagram.component.html',
  styleUrls: ['diagram.component.scss'],
})
export class DiagramComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('containerRef', {static: true}) containerRef: ElementRef;
  @ViewChild('propertiesRef', {static: true}) propertiesRef: ElementRef;
  @Output() private importDone: EventEmitter<ImportEvent> = new EventEmitter();
  private modeler: BpmnModeler;
  private xml = '';
  private disabled = false;

  constructor(
    private zone: NgZone,
    private api: ApiService,
  ) {
  }

  get value(): any {
    return this.xml;
  }

  ngAfterViewInit() {
    this.initializeModeler();
    this.openDiagram(this.xml);
  }

  onChange(value: any) {
  }

  onTouched() {
  }

  initializeModeler() {
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
        camunda: camundaModdleDescriptor['default']
      }
    });

    this.modeler.get('eventBus').on('commandStack.changed', () => this.saveDiagram());

    this.modeler.on('import.done', ({error}) => {
      if (!error) {
        this.modeler.get('canvas').zoom('fit-viewport');
      }
    });
  }

  // Allows Angular to update the model.
  // Update the model and changes needed for the view here.
  writeValue(value: any): void {
    if (value !== this.xml) {
      this.openDiagram(value);
    }
    this.xml = value;
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
        this.modeler.importXML(xml, (e, w) => this.onImport(e, w)) :
        this.modeler.createDiagram((e, w) => this.onImport(e, w))
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
      this.xml = xml;
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

  onImport(err?: HttpErrorResponse, warnings?: BpmnWarning[]) {
    if (err) {
      this._handleErrors(err);
    } else {
      this._handleWarnings(warnings);
    }
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string) {
    this.api.getBpmnXml(url).subscribe(xml => {
      this.openDiagram(xml);
    }, error => this._handleErrors(error));
  }

  private _handleWarnings(warnings: BpmnWarning[]) {
    this.importDone.emit({
      type: 'success',
      warnings: warnings
    });
  }

  private _handleErrors(err) {
    this.importDone.emit({
      type: 'error',
      error: err
    });
  }

}
