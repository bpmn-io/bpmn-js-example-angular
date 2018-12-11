import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public title = 'bpmn-js-angular';
  public diagramUrl = 'https://cdn.rawgit.com/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  public errorMsg = '';

  public handleImportStatus(errorMsg) {
    this.errorMsg = errorMsg;
    if (!errorMsg.length) {
      console.log(`%cIMPORT SUCCESS: \n${this.diagramUrl}`, 'color: green');
    }
  }
}
