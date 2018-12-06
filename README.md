# bpmn-js-example-angular

[![Build Status](https://travis-ci.com/bpmn-io/bpmn-js-example-angular.svg?branch=master)](https://travis-ci.com/bpmn-io/bpmn-js-example-angular)

An example how to integrate bpmn-js with an [Angular](https://angular.io/) application.


## Prerequisites

Assume you bootstrapped your application using the `ng` command:

```sh
ng new bpmn-js-app --defaults=true
cd bpmn-js-app
```


## Integrating bpmn-js

Create a component similar to [`DiagramComponent`](./bpmn-js-app/src/app/diagram/diagram.component.ts):

```typescript
import {
  AfterContentInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.development.js';

@Component({
  selector: 'app-diagram',
  template: `<div #ref class="diagram-container"></div>`,
  styles: `
    .diagram-container {
      height: 100%;
      width: 100%;
    }
  `
})
export class DiagramComponent implements AfterContentInit, OnDestroy {

  // instantiate BpmnJS with component
  private viewer: BpmnJS = new BpmnJS();

  // retrieve DOM element reference
  @ViewChild('ref') private el: ElementRef;

  ngAfterContentInit(): void {
    // attach BpmnJS instance to DOM element
    this.viewer.attachTo(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    // destroy BpmnJS instance
    this.viewer.destroy();
  }

}
```


## Test the Example

```sh
npm install
npm run all
```


## License

MIT