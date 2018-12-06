import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DiagramComponent
      ],
    }).compileComponents();
  }));


  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
