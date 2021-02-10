import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import { DebugNode } from '@angular/core';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let component: DebugNode['componentInstance'];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DiagramComponent
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('renders a diagram component', () => {
    expect(fixture.nativeElement.querySelector('app-diagram')).toBeTruthy();
  });


  it('sets an error message', () => {
    const error = new Error('ERROR');

    component.handleImported({
      type: 'error',
      error
    });

    expect(component.importError).toEqual(error);
  });

});
