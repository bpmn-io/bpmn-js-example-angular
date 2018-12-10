import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, catchError, retry } from 'rxjs/operators';

// why not use the modeler? IMO it makes for a more interesting example
// import BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.development.js';

import { throwError } from 'rxjs';

@Component({
  selector: 'app-diagram',
  template: `
    <div #ref class="diagram-container"></div>
  `,
  styles: [
    `
      .diagram-container {
        height: 100%;
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagramComponent implements AfterContentInit, OnDestroy {
  private viewer: BpmnJS = new BpmnJS();

  @ViewChild('ref') private el: ElementRef;
  @Output() private error: EventEmitter<any> = new EventEmitter();
  @Input() private url: string;

  constructor(private http: HttpClient) {}

  ngAfterContentInit(): void {
    this.viewer.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.url) {
      this.loadUrl();
    }
  }

  ngOnDestroy(): void {
    this.viewer.destroy();
  }

  loadUrl() {
    this.http.get(this.url, { responseType: 'text' }).pipe(
      map((xml: string) => xml),
      retry(3),
      catchError(err => throwError(err))
    ).subscribe(
      xml => this.viewer.importXML(xml),
      err => {
        console.error(err)
        this.error.emit('ERROR: diagram did not load - please check the console.')
      }
    );
  }
}
