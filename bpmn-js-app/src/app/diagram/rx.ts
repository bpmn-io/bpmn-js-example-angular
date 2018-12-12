import { Observable } from 'rxjs';

/**
 * An operator that imports the first XML piped via the piped diagram XML
 * into the passed BpmnJS instance.
 */
export const importDiagram = (bpmnJS) => <Object>(source: Observable<string>) =>
  new Observable<string>(observer => {

    const subscription = source.subscribe({
      next(xml: string) {

        // canceling the subscription as we are interested
        // in the first diagram to display only
        subscription.unsubscribe();

        bpmnJS.importXML(xml, function(err, warnings) {

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
