"use strict";

import * as THREE from "three";
import TransformTool from "./transformtool";

export default class RotateTool extends TransformTool
{
  constructor(editor)
  {
    super(editor);

    this.rotation = new THREE.Vector3();
    this.angleOrigin = new THREE.Vector3();;
  }

  createLine(material)
  {
    let lineGeometry = new THREE.TorusGeometry(
      this.LINE_LENGTH,
      this.LINE_WIDTH / 2,
      this.SEGMENTS,
      this.SEGMENTS
    );

    let line = new THREE.Mesh(lineGeometry, material);
    line.rotation.x = Math.PI / 2;

    return line;
  }

  createHead(material)
  {
    return undefined;
  }

  update()
  {
    super.update();

    if(!this.dragging)
      return;

    let mouse = this.getMousePosition();
    let x = mouse.x - this.origin.x;
    let y = mouse.y - this.origin.y;
    let z = mouse.z - this.origin.z;

    let difference = new THREE.Vector3();

    if(this.selectedAxis == "x") {
      let angle = Math.atan2(-y, z) + Math.PI;
      angle -= this.angleOrigin.x;
      angle -= this.rotation.x;

      difference.x = angle;
    } else if(this.selectedAxis == "y") {
      let angle = Math.atan2(-z, x) + Math.PI;
      angle -= this.angleOrigin.y;
      angle -= this.rotation.y;

      difference.y = angle;
    } else if(this.selectedAxis == "z") {
      let angle = Math.atan2(y, x) + Math.PI;
      angle -= this.angleOrigin.z;
      angle -= this.rotation.z;

      difference.z = angle;
    }

    this.rotation.add(difference);

    this.triggerEvent("transform", this.rotation, difference);
  }

  grab(selection)
  {
    super.grab(selection);
    let x = selection.point.x - this.origin.x;
    let y = selection.point.y - this.origin.y;
    let z = selection.point.z - this.origin.z;

    if(this.selectedAxis == "x")
      this.angleOrigin.x = Math.atan2(-y, z) + Math.PI;
    else if(this.selectedAxis == "y")
      this.angleOrigin.y = Math.atan2(-z, x) + Math.PI;
    else if(this.selectedAxis == "z")
      this.angleOrigin.z = Math.atan2(y, x) + Math.PI;
  }

  release()
  {
    super.release();

    this.rotation.set(0, 0, 0);
  }
}