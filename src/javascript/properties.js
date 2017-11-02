"use strict";

import "../stylesheets/properties.css"

import Vector3Widget from "./propertywidgets/vector3widget";
import ColorWidget from "./propertywidgets/colorwidget";

export default class Properties
{
  constructor(editor)
  {
    this.editor = editor;
    this.element = this.createElement();
    this.widgets = {};
  }

  createElement()
  {
    let element = document.createElement("div");
    element.classList.add("properties");

    this.editor.element.appendChild(element);

    return element;
  }

  update()
  {
    let selection = this.editor.selection;

    this.reset()

    // update properties pane
    if(selection.containsOnlyFaces)
      this.addFaceWidgets();
    if(selection.containsBones && selection.list.length == 1)
      this.addBoneWidgets();
    if(selection.containsVertices && selection.list.length == 1)
      this.addVertexWidgets();
  }

  addWidget(propertyWidget)
  {
    this.widgets[propertyWidget.label.innerText] = propertyWidget;
    this.element.appendChild(propertyWidget.container);
  }

  addVertexWidgets()
  {
    let vertex = this.editor.selection.list[0];

    let positionWidget = new Vector3Widget("position", vertex);
    positionWidget.on("change", () => this.editor.model.geometryNeedUpdate = true);
    this.addWidget(positionWidget);
  }

  addFaceWidgets()
  {
    let lastFaceIndex = this.editor.selection.list.length - 1;
    let color = this.editor.selection.list[lastFaceIndex].color;

    let colorWidget = new ColorWidget("color", color);

    colorWidget.on("change", () => {
      for(let face of this.editor.selection.list)
        face.color.set(color);

      this.editor.model.colorsNeedUpdate = true;
    });

    this.addWidget(colorWidget);
  }

  addBoneWidgets()
  {
    let bone = this.editor.selection.list[0];

    let positionWidget = new Vector3Widget("position", bone.position);
    let rotationWidget = new Vector3Widget("rotation", bone.rotation);
    let scaleWidget = new Vector3Widget("scale", bone.scale);

    //positionWidget.on("change", () => );
    //rotationWidget.on("change", () => );
    //scaleWidget.on("change", () => );

    this.addWidget(positionWidget);
    this.addWidget(rotationWidget);
    this.addWidget(scaleWidget);
  }

  reset()
  {
    for(let label in this.widgets) {
      let widget = this.widgets[label];
      widget.container.remove();
    }

    this.widgets = {};
  }
}