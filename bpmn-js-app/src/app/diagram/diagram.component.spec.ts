import { TestBed, async } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { DiagramComponent } from './diagram.component';

const diagramUrl = 'https://cdn.rawgit.com/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';


describe('DiagramComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DiagramComponent
      ],
    }).compileComponents();
  }));


  it('should create and tear down', () => {
    // given
    const fixture = TestBed.createComponent(DiagramComponent);
    const diagram = fixture.debugElement.componentInstance;

    // then
    expect(diagram).toBeTruthy();

    // and then...
    // destruction does not throw (!)
    fixture.destroy();
  });


  it('should load diagram', (done) => {
    // given
    const fixture = TestBed.createComponent(DiagramComponent);
    const diagram = fixture.debugElement.componentInstance;

    // assume
    expect(diagram.whenLoaded).toBeFalsy();

    // when
    diagram.ngOnChanges({
      url: new SimpleChange(null, diagramUrl, true)
    });

    // then
    expect(diagram.whenLoaded).toBeTruthy();

    diagram.whenLoaded.then(done);
  });

});
