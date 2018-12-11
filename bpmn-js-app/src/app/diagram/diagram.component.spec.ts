import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed
} from '@angular/core/testing';
import { DebugNode } from '@angular/core';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DiagramComponent } from './diagram.component';

const diagramUrl =
  'https://cdn.rawgit.com/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';

describe('DiagramComponent', () => {
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<DiagramComponent>;
  let component: DebugNode['componentInstance'];

  const injector: TestBed = getTestBed();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DiagramComponent]
    });
    fixture = TestBed.createComponent(DiagramComponent);
    component = fixture.debugElement.componentInstance;
    httpMock = injector.get(HttpTestingController);
    fixture.detectChanges();
  }));

  afterEach(() => httpMock.verify());

  it('should create and tear down', () => {
    expect(component).toBeTruthy();
    fixture.destroy();
  });

  it('makes a successful get request and emits an error message', () => {
    component.url = diagramUrl;

    spyOn(component, 'loadUrl').and.callThrough();
    component.loadUrl(diagramUrl);
    const req = httpMock.expectOne(diagramUrl);
    expect(req.request.method).toBe('GET');
  });

  it('makes an unsuccessful get request and emits an error message', () => {
    component.url = null;
    spyOn(component, 'loadUrl').and.callThrough();
    spyOn(console, 'error');
    component.loadUrl();

    httpMock.expectNone(diagramUrl);
    expect(component.errorMessage).toEqual(
      'ERROR: diagram did not load - please check the console.'
    );
  });
});
