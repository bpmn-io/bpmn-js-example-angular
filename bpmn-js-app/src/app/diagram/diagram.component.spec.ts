import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { DebugNode } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DiagramComponent } from './diagram.component';

const diagramUrl = 'https://cdn.rawgit.com/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';


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
  }));

  describe('create', () => {
    it('should create and tear down', () => {
      expect(component).toBeTruthy();
      fixture.destroy();
    });
  });

  describe('#loadUrl', () => {
    it('makes a get request to an XML file', () => {
      httpMock = injector.get(HttpTestingController);
      component.url = diagramUrl;
      spyOn(component, 'loadUrl').and.callThrough();
      component.loadUrl(diagramUrl);
      const req = httpMock.expectOne(diagramUrl);
      expect(req.request.method).toBe('GET');
    });
  });

});
