# bpmn-js-example-angular

[![Build Status](https://travis-ci.com/bpmn-io/bpmn-js-example-angular.svg?branch=master)](https://travis-ci.com/bpmn-io/bpmn-js-example-angular)

An example demonstrating how to integrate bpmn-js with an [Angular](https://angular.io/) application.

![Integration Screenshot](./docs/screenshot.png)


## Installing the example

This example Angular application was created using the [Angular CLI](https://cli.angular.io/) and uses commonly-used Angular components, including [`@angular/material`](https://material.angular.io/), [`@angular/flex-layout`](https://github.com/angular/flex-layout), and [`@angular/cdk`](https://material.angular.io/cdk/categories).

1.  [Install Node & npm](https://www.npmjs.com/get-npm)
2.  [Install Angular & Angular CLI](https://angular.io/guide/setup-local)
3.  Clone this repository

    ```sh
    git clone https://github.com/bpmn-io/bpmn-js-example-angular-properties-panel.git
    cd bpmn-js-example-angular-properties-panel
    ```
    
4.  Install and test the example

    ```sh
    npm install
    npm run all
    ```
    

## Integrating with an existing Angular project
1.  Navigate to your Angular project directory.
2.  Install common Angular components (optional):
    ```sh
    npm install --save @angular/material @angular/flex-layout @angular/cdk
    ```
    
    Then import them into your [`app.module.ts`](./bpmn-js-app/src/app/app.module.ts):
    ```
    import {FlexLayoutModule} from '@angular/flex-layout';
    import {FormsModule, ReactiveFormsModule} from '@angular/forms';
    import {MatButtonModule} from '@angular/material/button';
    import {MatIconModule} from '@angular/material/icon';
    import {MatInputModule} from '@angular/material/input';
    import {MatMenuModule} from '@angular/material/menu';
    import {MatTabsModule} from '@angular/material/tabs';
    import {MatToolbarModule} from '@angular/material/toolbar';
    import {BrowserModule} from '@angular/platform-browser';
    import {BrowserAnimationsModule} from '@angular/platform-browser/animations';    
    ...
    
    imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTabsModule,
        MatToolbarModule,
        ReactiveFormsModule,
    ],
    ```

3.  Install BPMN and Camunda Moddle packages 
    ```sh
    npm install --save bpmn-js bpmn-js-properties-panel camunda-bpmn-moddle diagram-js-minimap
    ```

4.  Create a component similar to [`DiagramComponent`](./bpmn-js-app/src/app/diagram/diagram.component.ts):
    ```sh
    ng generate component Diagram
    ```

5.  Import the BPMN and Camunda libraries into your newly-created component:
    ```
    import propertiesPanelModule from 'bpmn-js-properties-panel';
    import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
    import BpmnModeler from 'bpmn-js/lib/Modeler';
    import * as camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
    import minimapModule from 'diagram-js-minimap';
    ```

6.  Add the following to the component template (e.g., [`diagram.component.html`](./bpmn-js-app/src/app/diagram/diagram.component.html)):
    ```
    <div fxLayout="row" class="modeler-wrapper">
      <div fxFlex="75%" class="diagram-container" #containerRef></div>
      <div fxFlex="25%" class="properties-container" #propertiesRef></div>
    </div>
    ```
   Or, if you skipped step 1 above:
    ```
    <div>
      <div #containerRef></div>
      <div #propertiesRef></div>
    </div>
    ```

7.  Add the following to the component SCSS (optional if you skipped step 1 above):
    ```
    .modeler-wrapper {
      height: 100%;
      width: 100%;
    
      ::ng-deep .djs-minimap:not(.open) .toggle:before {
        font-family: 'Material Icons';
        content: "map";
        font-size: 24px;
      }
    
      ::ng-deep .djs-minimap.open .toggle:before {
        font-family: 'Material Icons';
        content: "close";
        font-size: 24px;
      }
    }
    ```

8.  In the Component class (e.g., [`diagram.component.ts`](./bpmn-js-app/src/app/diagram/diagram.component.ts)), instantiate the modeler:
    ```
    export class DiagramComponent implements AfterViewInit {
      @ViewChild('containerRef', {static: true}) containerRef: ElementRef;
      @ViewChild('propertiesRef', {static: true}) propertiesRef: ElementRef;
    
      // Declare the modeler
      private modeler: BpmnModeler;
    
      // This will store the string value of the XML
      private xml = '';
      
      ...
    
      // Initialize the modeler after the view has been initialized
      ngAfterViewInit() {
        this.initializeModeler();
        this.openDiagram(this._value);
      }
    
      ...
      
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
    
      ...   
    
      saveDiagram() {
        this.modeler.saveXML({format: true}, (err, xml) => {
          this.xml = xml;
          this.writeValue(xml);
        });
      }

    ```

To load XML from a file or URL, you will need to call DiagramComponent's [`openDiagram`](./bpmn-js-app/src/app/diagram/diagram.component.ts#L105-111) method. In the example, this is done via a button click handler ([`onSubmit`](./bpmn-js-app/src/app/app.component.ts#L50-67)), which gets the file (via HTML file input or HTTP GET, depending on which option the user chose) and sends the string value of the file to [`openDiagram`](./bpmn-js-app/src/app/diagram/diagram.component.ts#L105-111). The DiagramComponent then emits an `importDone` event to the parent component.

## Additional Resources

* [bpmn-js Examples](https://github.com/bpmn-io/bpmn-js-examples)
* [bpmn-js Viewer Documentation](https://github.com/bpmn-io/bpmn-js/blob/master/lib/Viewer.js), [Example](https://github.com/bpmn-io/bpmn-js-examples/blob/master/starter/viewer.html)
* [bpmn-js Modeler Documentation](https://github.com/bpmn-io/bpmn-js/blob/master/lib/Modeler.js), [Example](https://github.com/bpmn-io/bpmn-js-examples/tree/master/modeler)
* [How to add Keyboard-Bindings](https://forum.bpmn.io/t/hotkeys-like-the-demo/89/2) (cf. [`Keyboard` service](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/keyboard/Keyboard.js))

## License

MIT
