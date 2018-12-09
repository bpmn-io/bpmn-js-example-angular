import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
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

  @Input() private url: String;

  constructor(private http: HttpClient) {}

  ngAfterContentInit(): void {
    this.viewer.attachTo(this.el.nativeElement);
    this.loadUrl(this.url).subscribe();
  }

  ngOnDestroy(): void {
    this.viewer.destroy();
  }

  loadUrl(url) {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((xml: string) => this.viewer.importXML(xml)),
      retry(3),
      catchError(err => throwError(err))
    );
  }
}
