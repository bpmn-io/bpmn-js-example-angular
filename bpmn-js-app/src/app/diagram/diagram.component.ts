import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.development.js';

@Component({
  selector: 'app-diagram',
  template: `<div #ref class="diagram-container"></div>`,
  styles: [ `
    .diagram-container {
      height: 100%;
      width: 100%;
    }
  ` ]
})
export class DiagramComponent implements AfterContentInit, OnDestroy, OnChanges {

  private viewer: BpmnJS = new BpmnJS();

  private destroyed: Boolean = false;

  private whenLoaded: Promise<Object>;

  @ViewChild('ref') private el: ElementRef;

  @Input() private url: String;

  ngOnChanges(changes: SimpleChanges) {
    if ('url' in changes) {
      this.whenLoaded = this.loadUrl(changes['url'].currentValue);
    }
  }

  ngAfterContentInit(): void {
    this.viewer.attachTo(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.viewer.destroy();

    this.destroyed = true;
  }

  loadUrl(url): Promise<Object> {
    return (
      fetch(url)
        .then(response => response.text())
        .then(xml => this.openDiagram(xml))
    );
  }

  openDiagram(xml): Promise<Object> {
    return new Promise((resolve, reject) => {
      if (this.destroyed) {
        return reject(new Error('component instance destroyed'));
      }

      this.viewer.importXML(xml, (err) => {

        if (err) {
          return reject(err);
        }

        return resolve({});
      });
    });
  }

}
