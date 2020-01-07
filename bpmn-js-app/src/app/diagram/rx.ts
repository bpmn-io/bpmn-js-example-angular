import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BpmnWarning} from '../interfaces/bpmn-warning';

/**
 * An operator that imports the first XML piped via the piped diagram XML
 * into the passed BpmnJS instance.
 */
export const importDiagram = (bpmnJS) => <Object>(source: Observable<string>) => {
  return new Observable<BpmnWarning[]>(observer => {

    const subscription = source.subscribe({
      next(xml: string) {

        // canceling the subscription as we are interested
        // in the first diagram to display only
        subscription.unsubscribe();

        bpmnJS.importXML(xml, (err: HttpErrorResponse, warnings: BpmnWarning[]) => {

          if (err) {
            observer.error(err);
          } else {
            observer.next(warnings);
          }

          observer.complete();
        });
      },
      error(e) {
        console.log('ERROR');
        observer.error(e);
      },
      complete() {
        observer.complete();
      }
    });
  });
};
