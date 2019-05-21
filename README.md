# bpmn-js-example-angular

[![Build Status](https://travis-ci.com/bpmn-io/bpmn-js-example-angular.svg?branch=master)](https://travis-ci.com/bpmn-io/bpmn-js-example-angular)

An example how to integrate bpmn-js with an [Angular](https://angular.io/) application.

![Integration Screenshot](./docs/screenshot.png)

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

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.development.js';

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

## Additional Resources

* [bpmn-js-viewer Documentation](https://github.com/bpmn-io/bpmn-js/blob/master/lib/Viewer.js), [Example](https://github.com/bpmn-io/bpmn-js-examples/blob/master/starter/viewer.html)
* [bpmn-js-modeler Documentation](https://github.com/bpmn-io/bpmn-js/blob/master/lib/Modeler.js), [Example](https://github.com/bpmn-io/bpmn-js-examples/tree/master/modeler)
* [How to add Keyboard-Bindings](https://forum.bpmn.io/t/hotkeys-like-the-demo/89/2?u=niklas_kiefer) ([cf. Keyboard-Service](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/keyboard/Keyboard.js))

## License

MIT
