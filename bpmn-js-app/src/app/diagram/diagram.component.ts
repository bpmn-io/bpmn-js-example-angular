import {HttpClient} from '@angular/common/http';
import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BpmnWarning} from '../interfaces/bpmn-warning';
import {ImportEvent} from '../interfaces/import-event';

import {importDiagram} from './rx';


@Component({
  selector: 'app-diagram',
  templateUrl: 'diagram.component.html',
  styleUrls: ['diagram.component.scss'],
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy {
  private bpmnJS: BpmnJS;

  @ViewChild('ref', {static: true}) private el: ElementRef;
  @Output() private importDone: EventEmitter<ImportEvent> = new EventEmitter();

  @Input() private url: string;

  constructor(private http: HttpClient) {

    this.bpmnJS = new BpmnJS();

    this.bpmnJS.on('import.done', ({error}) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string) {

    return (
      this.http.get(url, {responseType: 'text'}).pipe(
        catchError(err => throwError(err)),
        importDiagram(this.bpmnJS)
      ).subscribe(
        (warnings: BpmnWarning[]) => {
          this.importDone.emit({
            type: 'success',
            warnings: warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

}
