# bpmn-js-example-angular

[![CI](https://github.com/bpmn-io/bpmn-js-example-angular/workflows/CI/badge.svg)](https://github.com/bpmn-io/bpmn-js-example-angular/actions?query=workflow%3ACI)

An example how to integrate bpmn-js with an [Angular](https://angular.io/) application.

![Integration Screenshot](./docs/screenshot.png)

## Prerequisites

Assume you bootstrapped your application using the `ng` command:

```sh
ng new bpmn-js-app --defaults=true
cd bpmn-js-app
```


## Integrating bpmn-js

Include the style files for diagram-js and bpmn in your [`Angular.json file`](./bpmn-js-app/angular.json) under projects > your project > architect > build > options > styles

```json
"styles": [
  "./node_modules/bpmn-js/dist/assets/diagram-js.css",
  "./node_modules/bpmn-js/dist/assets/bpmn-js.css",
  "./node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn.css",
  "src/styles.css"
],
```

Create a component similar to [`DiagramComponent`](./bpmn-js-app/src/app/diagram/diagram.component.ts):

```typescript
import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  inject,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter
} from '@angular/core';

import type Canvas from 'diagram-js/lib/core/Canvas';
import type { ImportDoneEvent, ImportXMLResult } from 'bpmn-js/lib/BaseViewer';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

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
  ]
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy {

  // instantiate BpmnJS with component
  private bpmnJS: BpmnJS;

  // retrieve DOM element reference
  @ViewChild('ref', { static: true }) private el: ElementRef;

  @Input() private url: string;

  constructor() {

    this.bpmnJS = new BpmnJS();

    this.bpmnJS.on<ImportDoneEvent>('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get<Canvas>('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit(): void {
    // attach BpmnJS instance to DOM element
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue).then(xml => {
        return this.bpmnJS.importXML(xml);
      });
    }
  }

  ngOnDestroy(): void {
    // destroy BpmnJS instance
    this.bpmnJS.destroy();
  }

  private loadUrl(url: string) : Promise<string> {
    throw new Error('not implemented - return diagram XML from url');
  }
}
```


## Test the Example

```sh
npm install
npm run all
```

## Additional Resources

* [bpmn-js Examples](https://github.com/bpmn-io/bpmn-js-examples)
* [bpmn-js Viewer Documentation](https://github.com/bpmn-io/bpmn-js/blob/main/lib/Viewer.js), [Example](https://github.com/bpmn-io/bpmn-js-examples/blob/main/starter/viewer.html)
* [bpmn-js Modeler Documentation](https://github.com/bpmn-io/bpmn-js/blob/main/lib/Modeler.js), [Example](https://github.com/bpmn-io/bpmn-js-examples/tree/main/modeler)
* [How to add Keyboard-Bindings](https://forum.bpmn.io/t/hotkeys-like-the-demo/89/2) (cf. [`Keyboard` service](https://github.com/bpmn-io/diagram-js/blob/main/lib/features/keyboard/Keyboard.js))

## License

MIT
