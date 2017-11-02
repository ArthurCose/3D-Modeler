"use strict";

import * as THREE from "three";
import PropertyWidget from "./propertywidget";

export default class ColorWidget extends PropertyWidget
{
  constructor(label, color = new THREE.Color())
  {
    super(label);
    this.color = color;
    let hexString = "#" + this.color.getHexString();

    this.colorInput = this.addColorInput(
      "color", hexString,
      (value) => this.setFromHex(value)
    );

    this.hexInput = this.addTextInput(
      "hex", /^#[\da-f]{6}$/i, hexString,
      (value) => this.setFromHex(value)
    );

    this.hexInput.style.width = "70px";
  }

  setFromHex(hex)
  {
    this.colorInput.value = hex;
    this.hexInput.value = hex;

    hex = hex.slice(1);
    hex = parseInt(hex, 16);
    this.color.setHex(hex);

    this.triggerEvent(
      "change", "color",
      this.color.r, this.color.g, this.color.b
    );
  }
}