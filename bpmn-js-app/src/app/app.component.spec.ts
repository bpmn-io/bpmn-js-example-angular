import {HttpErrorResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DebugNode} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BPMN_DIAGRAM} from '../testing/mocks/diagram.mocks';
import {AppComponent} from './app.component';
import {DiagramComponent} from './diagram/diagram.component';


describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: DebugNode['componentInstance'];
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DiagramComponent
      ],
      imports: [
        BrowserAnimationsModule,
        NoopAnimationsModule,
        FormsModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        HttpClientTestingModule,
      ]
    }).compileComponents();
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    const sReq = httpMock.expectOne(component.diagramUrl);
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(BPMN_DIAGRAM);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('renders a diagram component', () => {
    expect(fixture.nativeElement.querySelector('app-diagram')).toBeTruthy();
  });


  it('sets an error message', () => {
    const error = new HttpErrorResponse({error: 'ERROR'});

    component.handleImported({
      type: 'error',
      error
    });

    expect(component.importError).toEqual(error);
  });

});
