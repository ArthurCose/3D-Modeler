"use strict";

import * as THREE from "three";
import PropertyWidget from "./propertywidget";

export default class Vector3Widget extends PropertyWidget
{
  constructor(label, vector = new THREE.Vector3(0, 0, 0))
  {
    super(label);
    this.vector = vector;

    this.xInput = this.addNumericInput("x", this.vector.x, (value) => {
      this.vector.setX(value);
      this.triggerEvent("change", "x", value);
    });
    this.yInput = this.addNumericInput("y", this.vector.y, (value) => {
      this.vector.setY(value);
      this.triggerEvent("change", "y", value);
    });
    this.zInput = this.addNumericInput("z", this.vector.z, (value) => {
      this.vector.setZ(value);
      this.triggerEvent("change", "z", value);
    });

    this.xInput.step = .1;
    this.yInput.step = .1;
    this.zInput.step = .1;
  }
}