"use strict";

import * as THREE from "three";
import TransformTool from "./transformtool";

export default class TranslateTool extends TransformTool
{
  constructor(editor)
  {
    super(editor);

    this.translation = new THREE.Vector3();
  }

  update()
  {
    super.update();

    if(!this.dragging)
      return;

    let mouse = this.getMousePosition();

    if(this.selectedAxis == "x")
      this.group.position.x = mouse.x - this.selectionOffset.x;
    if(this.selectedAxis == "y")
      this.group.position.y = mouse.y - this.selectionOffset.y;
    if(this.selectedAxis == "z")
      this.group.position.z = mouse.z - this.selectionOffset.z;

    this.group.updateMatrixWorld();

    this.updateTranslation();
  }

  updateTranslation()
  {
    let translation = this.group.position.clone();
    translation.sub(this.origin);

    let difference = translation.clone();
    difference.sub(this.translation);

    this.translation = translation;

    this.triggerEvent("transform", translation, difference);
  }

  release()
  {
    super.release();

    this.translation.set(0, 0, 0);
    this.origin.copy(this.group.position);
  }
}