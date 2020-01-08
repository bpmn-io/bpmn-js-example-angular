import {HttpErrorResponse} from '@angular/common/http';
import {BpmnWarning} from './bpmn-warning';

export interface ImportEvent {
  type: string;
  warnings?: BpmnWarning[];
  error?: HttpErrorResponse;
}
