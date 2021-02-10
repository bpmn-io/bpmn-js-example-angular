import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DebugNode } from '@angular/core';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { DiagramComponent } from './diagram.component';


const BPMN_DIAGRAM = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
               xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2"
               targetNamespace="http://bpmn.io/bpmn"
               exporter="http://bpmn.io"
               exporterVersion="0.10.1">
    <process id="Process_1" isExecutable="false" />
    <bpmndi:BPMNDiagram id="BpmnDiagram_1">
      <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1" />
    </bpmndi:BPMNDiagram>
  </definitions>
`;

const BPMN_DIAGRAM_WITH_WARNINGS = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
               xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2"
               targetNamespace="http://bpmn.io/bpmn"
               exporter="http://bpmn.io"
               exporterVersion="0.10.1">
    <process id="Process_1" isExecutable="false" a:b="C" />
    <bpmndi:BPMNDiagram id="BpmnDiagram_1">
      <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1" />
    </bpmndi:BPMNDiagram>
  </definitions>
`;


describe('DiagramComponent', () => {

  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<DiagramComponent>;
  let component: DebugNode['componentInstance'];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DiagramComponent]
    });

    fixture = TestBed.createComponent(DiagramComponent);
    component = fixture.debugElement.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
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
