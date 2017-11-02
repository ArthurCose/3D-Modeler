"use strict";

import * as THREE from "three";
import TransformTool from "./transformtool";

export default class ScaleTool extends TransformTool
{
  constructor(editor)
  {
    super(editor);

    this.scale = new THREE.Vector3(1, 1, 1);
  }

  createHead(material)
  {
    let headGeometry = new THREE.CubeGeometry(
      this.HEAD_WIDTH,
      this.HEAD_LENGTH,
      this.HEAD_WIDTH
    );

    let head = new THREE.Mesh(headGeometry, material);

    head.position.y = this.LINE_LENGTH;

    return head;
  }

  update()
  {
    super.update();

    if(!this.dragging)
      return;

    let scale = this.scale.clone();
    let mouse = this.getMousePosition();

    if(this.selectedAxis == "x")
      scale.x = mouse.x - this.origin.x - this.selectionOffset.x + 1;
    if(this.selectedAxis == "y")
      scale.y = mouse.y - this.origin.y - this.selectionOffset.y + 1;
    if(this.selectedAxis == "z")
      scale.z = mouse.z - this.origin.z - this.selectionOffset.z + 1;

    let difference = scale.clone();
    difference.sub(this.scale);

    this.scale = scale;

    this.triggerEvent("transform", scale, difference);
  }

  release()
  {
    super.release();

    this.scale.set(1, 1, 1);
  }
}