import {HttpErrorResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DebugNode} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BPMN_DIAGRAM, BPMN_DIAGRAM_WITH_WARNINGS} from '../testing/mocks/diagram.mocks';
import {BpmnWarning} from './_interfaces/bpmn-warning';
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
        DiagramComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        NoopAnimationsModule,
        FormsModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        HttpClientTestingModule,
      ]
    }).compileComponents();
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    component.diagramComponent = TestBed.createComponent(DiagramComponent).componentInstance;
    fixture.detectChanges();
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

  it('sets warning messages', () => {
    const warnings: BpmnWarning[] = [{
      message: 'WARNING'
    }];

    component.handleImported({
      type: 'success',
      error: null,
      warnings: warnings,
    });

    expect(component.importWarnings).toEqual(warnings);
  });

  it('loads a diagram from URL', () => {
    component.diagramUrl = 'some-url';
    component.openMethod = 'url';
    const event = new MouseEvent('click');
    component['onSubmit'](event);

    const sReq = httpMock.expectOne(component.diagramUrl);
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(BPMN_DIAGRAM);
  });

  it('loads a diagram from URL with warnings', () => {
    component.diagramUrl = 'some-url';
    component.openMethod = 'url';
    const event = new MouseEvent('click');
    component['onSubmit'](event);

    const sReq = httpMock.expectOne(component.diagramUrl);
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(BPMN_DIAGRAM_WITH_WARNINGS);
  });

  it('loads a diagram from File', () => {
    const readFileSpy = spyOn(component, 'readFile').and.stub();
    const newFile = new File([BPMN_DIAGRAM], 'filename.xml', {type: 'text/xml'});
    component.diagramFile = newFile;
    component.openMethod = 'file';
    const event = new MouseEvent('click');
    component['onSubmit'](event);
    expect(readFileSpy).toHaveBeenCalledWith(newFile);
  });

  it('opens a diagram from File', () => {
    const mockFileReader = {
      target: {result: BPMN_DIAGRAM},
      readAsText: (blob) => {
      }
    };
    spyOn((window as any), 'FileReader').and.returnValue(mockFileReader);
    spyOn(mockFileReader, 'readAsText').and.callFake((blob) => {
      component.onLoad({target: {result: BPMN_DIAGRAM}});
    });
    const openDiagramSpy = spyOn(component.diagramComponent, 'openDiagram').and.stub();
    const newFile = new File([BPMN_DIAGRAM], 'filename.xml', {type: 'text/xml'});
    component.readFile(newFile);
    expect(openDiagramSpy).toHaveBeenCalledWith(BPMN_DIAGRAM);
  });

  it('loads a diagram from File with error', () => {
    const handleImportedSpy = spyOn(component, 'handleImported').and.stub();

    component.diagramFile = new File([], 'filename.jpg', {type: 'image/jpeg'});
    component.openMethod = 'file';
    const event = new MouseEvent('click');
    component['onSubmit'](event);
    const expectedParams = {
      type: 'error',
      error: new Error('Wrong file type. Please choose a BPMN XML file.')
    };
    expect(handleImportedSpy).toHaveBeenCalledWith(expectedParams);
  });

  it('should get the diagram file name', () => {
    expect(component.getFileName()).toEqual('No file selected');

    const filename = 'expected_file_name.jpg';
    component.diagramFile = new File([], filename, {type: 'image/jpeg'});
    expect(component.getFileName()).toEqual(filename);
  });

  it('should get the diagram file from the file input form control', () => {
    const expectedFile = new File([], 'filename.jpg', {type: 'image/jpeg'});
    const event = {target: {files: [expectedFile]}};
    component['onFileSelected'](event);
    expect(component.diagramFile).toEqual(expectedFile);
  });


});
