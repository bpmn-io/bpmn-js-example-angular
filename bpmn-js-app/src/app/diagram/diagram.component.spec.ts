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
import {BPMN_DIAGRAM, BPMN_DIAGRAM_WITH_WARNINGS} from '../../testing/mocks/diagram.mocks';

import { DiagramComponent } from './diagram.component';


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

  afterEach(() => {
    httpMock.verify();

    fixture.destroy();
  });


  it('should create and tear down', () => {
    expect(component).toBeTruthy();
  });


  it('should load and render successfully', (done) => {

    // given
    const diagramURL = 'some-url';

    component.importDone.subscribe(result => {
      // then
      expect(result).toEqual({
        type: 'success',
        warnings: []
      });

      done();
    });

    // when
    component.loadUrl(diagramURL);

    const request = httpMock.expectOne({ url: diagramURL, method: 'GET' });

    request.flush(BPMN_DIAGRAM);
  });


  it('should expose import warnings', (done) => {

    // given
    const diagramURL = 'some-url';

    component.importDone.subscribe(result => {
      // then
      expect(result.type).toEqual('success');

      expect(result.warnings.length).toEqual(1);
      expect(result.warnings[0].message).toContain('unparsable content <process> detected');

      done();
    });

    // when
    component.loadUrl(diagramURL);

    const request = httpMock.expectOne({ url: diagramURL, method: 'GET' });

    request.flush(BPMN_DIAGRAM_WITH_WARNINGS);
  });


  it('should fail to load and render', (done) => {

    // given
    const diagramURL = 'some-url';

    // when
    component.loadUrl(diagramURL);

    component.importDone.subscribe(result => {

      // then
      expect(result.type).toEqual('error');
      expect(result.error.message).toEqual('Http failure response for some-url: 404 FOO');

      done();
    });

    const request = httpMock.expectOne({ url: diagramURL, method: 'GET' });

    request.flush('Not Found', {
      status: 404,
      statusText: 'FOO'
    });
  });

});
