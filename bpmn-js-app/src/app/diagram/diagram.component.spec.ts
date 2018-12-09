import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { DebugNode } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DiagramComponent } from './diagram.component';

const diagramUrl = 'https://cdn.rawgit.com/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';


describe('DiagramComponent', () => {
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<DiagramComponent>;
  let diagram: DebugNode['componentInstance'];

  const injector: TestBed = getTestBed();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DiagramComponent]
    });
    fixture = TestBed.createComponent(DiagramComponent);
    diagram = fixture.debugElement.componentInstance;
  }));

  describe('create', () => {
    it('should create and tear down', () => {
      expect(diagram).toBeTruthy();
      fixture.destroy();
    });
  });

  describe('#loadUrl', () => {
    it('makes a get request to an XML file', () => {
      httpMock = injector.get(HttpTestingController);

      spyOn(diagram, 'loadUrl').and.callThrough();
      diagram.loadUrl(diagramUrl).subscribe();
      const req = httpMock.expectOne(diagramUrl);
      expect(req.request.method).toBe('GET');
    });
  });

});
