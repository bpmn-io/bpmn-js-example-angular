export const BPMN_DIAGRAM = `
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

export const BPMN_DIAGRAM_WITH_WARNINGS = `
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
