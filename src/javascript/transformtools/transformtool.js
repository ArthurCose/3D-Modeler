"use strict";

import * as THREE from "three";
import EventRaiser from "../eventraiser"

// todo, holding control lets you select multiple axes
// let go and drag the final axis (do not hold control on the last one)
// to transform multiple axes

// base class
export default class TransformTool extends EventRaiser
{
  constructor(editor)
  {
    super();
    this.addEvent("transform");

    this.HEAD_LENGTH = .2;
    this.HEAD_WIDTH = .15;
    this.LINE_WIDTH = .07;
    this.LINE_LENGTH = 1;
    this.SEGMENTS = 32;

    this.editor = editor;
    this.group = new THREE.Group();
    this.origin = new THREE.Vector3();
    this.selectionOffset = new THREE.Vector3();
    this.selectedAxis = undefined;
    this.dragging = false;

    this.xAxis = this.createAxis(1, 0, 0, 0xff0000);
    this.group.add(this.xAxis);

    this.yAxis = this.createAxis(0, 1, 0, 0x00ff00);
    this.group.add(this.yAxis);

    this.zAxis = this.createAxis(0, 0, 1, 0x0000ff);
    this.group.add(this.zAxis);
    this.group.updateMatrixWorld();
  }

  // x, y, and z must be 0 or 1
  createAxis(x, y, z, hex)
  {
    let axis = new THREE.Group();
    axis.rotation.x = z ? Math.PI / 2 : 0;
    axis.rotation.z = x ? -Math.PI / 2 : 0;

    let material = new THREE.MeshBasicMaterial({
      color: hex
    });

    let line = this.createLine(material);
    axis.add(line);

    let head = this.createHead(material);

    // head is optional
    if(head)
      axis.add(head);

    return axis;
  }

  createLine(material)
  {
    let lineGeometry = new THREE.CylinderGeometry(
      this.LINE_WIDTH / 2, this.LINE_WIDTH / 2,
      this.LINE_LENGTH - this.HEAD_LENGTH / 2,
      this.SEGMENTS
    );

    let line = new THREE.Mesh(lineGeometry, material);

    line.position.y = (this.LINE_LENGTH - this.HEAD_LENGTH / 2) / 2;

    return line;
  }

  createHead(material)
  {
    let headGeometry = new THREE.ConeGeometry(
      this.HEAD_WIDTH / 2,
      this.HEAD_LENGTH,
      this.SEGMENTS
    );

    let head = new THREE.Mesh(headGeometry, material);

    head.position.y = this.LINE_LENGTH;

    return head;
  }

  setOrigin(vector)
  {
    this.origin.copy(vector);

    this.group.position.copy(vector);
    this.group.updateMatrixWorld();
  }

  getMousePosition()
  {
    let camera = this.editor.cameraMan.camera;

    let grabPosition = this.group.position.clone();
    grabPosition.add(this.selectionOffset);

    let z = grabPosition.project(camera).z;

    let mouse = this.editor.input.getMousePositionNormalized();
    let vectorMouse = new THREE.Vector3(mouse.x, mouse.y, z);

    vectorMouse = vectorMouse.unproject(camera);

    return vectorMouse
  }

  update()
  {
    if(this.editor.input.isButtonUp(0) && this.dragging)
      this.release();
  }

  testSelection()
  {
    let mouse = this.editor.input.getMousePositionNormalized();
    let vectorMouse = new THREE.Vector2(mouse.x, mouse.y);

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(vectorMouse, this.editor.cameraMan.camera);

    let selection = raycaster.intersectObjects(this.group.children, true)[0];

    if(selection) {
      this.grab(selection);
      this.dragging = true;
    }

    return selection ? true : false;
  }

  grab(selection)
  {
    // store grabbed axis
    if(selection.object.parent == this.xAxis)
      this.selectedAxis = "x";
    else if(selection.object.parent == this.yAxis)
      this.selectedAxis = "y";
    else if(selection.object.parent == this.zAxis)
      this.selectedAxis = "z";

    // update offset
    this.selectionOffset.copy(selection.point)
    this.selectionOffset.sub(this.group.position);
  }

  release()
  {
    this.selectedAxis = undefined;
    this.dragging = false;
  }

  render(renderer, camera)
  {
    renderer.render(this.group, camera);
  }

  dispose()
  {
    let dispose = (object) => {
      if(object.geometry)
        object.geometry.dispose();
      if(object.material)
        object.material.dispose();

      object.children.forEach(dispose);
    }

    this.group.children.forEach(dispose);
  }
}