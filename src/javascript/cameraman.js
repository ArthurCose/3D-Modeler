"use strict";

import * as THREE from "three";

export default class CameraMan
{
  constructor(input)
  {
    this.input = input;
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    this.camera.rotation.order = "YXZ";
    this.camera.position.z = 5;
  }

  setAspectRatio(aspect)
  {
    this.camera.aspect = aspect;
  }

  update()
  {
    this.updateCameraRotation();
    this.updateCameraTranslation();

    this.camera.updateProjectionMatrix();
  }

  updateCameraRotation()
  {
    if(this.input.isButtonUp(2))
      return;

    let mouseDisplacement = this.input.getMouseDisplacement();

    this.camera.rotation.y += mouseDisplacement.x * .01;
    this.camera.rotation.x += mouseDisplacement.y * .01;

    // limit looking up/down to prevent weird left/right movement
    this.camera.rotation.x = Math.min(this.camera.rotation.x, Math.PI / 2);
    this.camera.rotation.x = Math.max(this.camera.rotation.x, -Math.PI / 2);
  }

  updateCameraTranslation()
  {
    // W
    if(this.input.isKeyDown(87))
      this.camera.translateZ(-.1);
    // S
    if(this.input.isKeyDown(83))
      this.camera.translateZ(.1);
    // A
    if(this.input.isKeyDown(65))
      this.camera.translateX(-.1);
    // D
    if(this.input.isKeyDown(68))
      this.camera.translateX(.1);
    // Space
    if(this.input.isKeyDown(32))
      this.camera.translateY(.1);
    // Shift
    if(this.input.isKeyDown(16))
      this.camera.translateY(-.1);
  }
}