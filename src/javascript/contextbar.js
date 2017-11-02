"use strict";

import "../stylesheets/contextbar.css";
import * as AddVertexIcon from "../../noto-emoji/png/128/emoji_u2795.png"; // ➕
import * as CreateFaceIcon from "../../noto-emoji/png/128/emoji_u1f601.png"; // 😁
import * as TranslateIcon from "../../noto-emoji/png/128/emoji_u2194.png"; // ↔️
import * as RotateIcon from "../../noto-emoji/png/128/emoji_u1f504.png"; // 🔄
import * as ScaleIcon from "../../noto-emoji/png/128/emoji_u2195.png"; // ↕
import * as ExtrudeIcon from "../../noto-emoji/png/128/emoji_u1f4e4.png"; // 📤
import * as SplitIcon from "../../noto-emoji/png/128/emoji_u2702.png"; // ✂
import * as LoopCutIcon from "../../noto-emoji/png/128/emoji_u27b0.png"; // ➰
import * as DeleteIcon from "../../noto-emoji/png/128/emoji_u1f5d1.png"; // 🗑

import * as THREE from "three";
import Toolbar from "./toolbar";
import TranslateTool from "./transformtools/translatetool";
import RotateTool from "./transformtools/rotatetool";
import ScaleTool from "./transformtools/scaletool";

export default class ContextBar extends Toolbar
{
  constructor(editor)
  {
    super();
    this.editor = editor;

    this.addButton("Add vertex", AddVertexIcon, () => this.addVertex());
    this.createFaceButton = this.addButton("Create face", CreateFaceIcon, () => this.createFace());
    this.translateButton = this.addButton("Translate", TranslateIcon, () => this.translate());
    this.rotateButton = this.addButton("Rotate", RotateIcon, () => this.rotate());
    this.scaleButton = this.addButton("Scale", ScaleIcon, () => this.scale());
    this.extrudeButton = this.addButton("Extrude", ExtrudeIcon,() => this.extrude());
    this.splitButton = this.addButton("Split", SplitIcon, () => this.split());
    this.loopCutButton = this.addButton("Loop cut", LoopCutIcon, () => this.loopCut());
    this.deleteButton = this.addButton("Delete", DeleteIcon, () => this.delete());

    this.createFaceButton.style.display = "none";
    this.translateButton.style.display = "none";
    this.rotateButton.style.display = "none";
    this.scaleButton.style.display = "none";
    this.extrudeButton.style.display = "none";
    this.splitButton.style.display = "none";
    this.loopCutButton.style.display = "none";
    this.deleteButton.style.display = "none";

    this.editor.viewPane.appendChild(this.element);
  }

  createElement()
  {
    let element = super.createElement();
    element.classList.add("contextbar");

    return element;
  }

  update()
  {
    let threeVertices = this.editor.selection.list.length == 3 &&
                        this.editor.selection.containsOnlyVertices;

    let selectionExists = this.editor.selection.list.length > 0;
    let moreThanVertex = this.editor.selection.list.length > 1 ||
                         !this.editor.selection.containsVertices &&
                         selectionExists;

    this.createFaceButton.style.display = threeVertices ? "" : "none";
    this.translateButton.style.display = selectionExists ? "" : "none";
    this.rotateButton.style.display = moreThanVertex ? "" : "none";
    this.scaleButton.style.display = moreThanVertex ? "" : "none";
    this.deleteButton.style.display = selectionExists ? "" : "none";

    if(this.editor.transformTool) {
      this.editor.transformTool.dispose();
      this.editor.transformTool = undefined;
    }
  }

  addVertex()
  {
    // clone the list, before we clear it
    let selectionList = this.editor.selection.list.slice(0);

    this.editor.selection.clear();

    for(let item of selectionList) {
      if(item.__proto__.constructor != THREE.Vector3)
        continue;

      let vertex = this.editor.model.addVertex(
        item.x, item.y, item.z
      );

      this.editor.selection.add(vertex);
    }

    // if no vertices were added to the selection, add one at the origin
    if(this.editor.selection.list.length == 0) {
      let vertex = this.editor.model.addVertex(0, 0, 0);
      this.editor.selection.add(vertex);
    }
  }

  delete()
  {
    for(let item of this.editor.selection.list) {
      if(item.__proto__.constructor == THREE.Face3)
        this.editor.model.deleteFace(item);
      else if(item.__proto__.constructor == THREE.Vector3)
        this.editor.model.deleteVertex(item);
      else if(item.__proto__.constructor == THREE.Bone)
        this.editor.model.deleteBone(item);
    }

    this.editor.selection.clear();
  }

  createFace()
  {
    // clone the selection list to prevent writing to it
    let vertices = this.editor.selection.list.slice(0);
    let center = new THREE.Vector2(0, 0);

    for(let i = 0; i < vertices.length; ++i) {
      let vertex = vertices[i];
      let index = this.editor.model.vertices.indexOf(vertex);

      // clone to prevent modifications to the actual vertex
      vertex = vertex.clone();
      // convert vertex to screen space
      vertex.project(this.editor.cameraMan.camera);
      // convert vertex to Vector2
      vertex = new THREE.Vector2(vertex.x, vertex.y);
      // save index to this vector as indexOf will not work with this vector
      vertex.index = index;
      // save to vertices array
      vertices[i] = vertex;

      // calculate center point
      center.addScaledVector(vertex, 1/3);
    }

    // convert vertices to be relative to the center 
    for(let vertex of vertices)
      vertex.sub(center);

    vertices = vertices.sort((a, b) => a.angle() > b.angle());
    let indices = vertices.map((value) => value.index);

    this.editor.model.createFace(...indices);
  }
  
  translate()
  {
    let translateTool = new TranslateTool(this.editor);
    let origin = this.editor.selection.getCenter();
    translateTool.setOrigin(origin);

    let vertices = this.editor.selection.getVertices();

    translateTool.on("transform", (tool, translation, difference) => {
      for(let vertex of vertices)
        vertex.add(difference);

      this.editor.model.geometryNeedUpdate = true;
    });

    this.editor.transformTool = translateTool;
  }

  rotate()
  {
    let rotateTool = new RotateTool(this.editor);
    let origin = this.editor.selection.getCenter();
    rotateTool.setOrigin(origin);

    let vertices = this.editor.selection.getVertices();

    rotateTool.on("transform", (tool, rotation, difference) => {
      let axis = new THREE.Vector3(
        tool.selectedAxis == "x" ? 1 : 0,
        tool.selectedAxis == "y" ? 1 : 0,
        tool.selectedAxis == "z" ? 1 : 0
      );

      let angle = difference.x + difference.y + difference.z;

      for(let vertex of vertices) {
        vertex.sub(origin);
        vertex.applyAxisAngle(axis, angle);
        vertex.add(origin);
      }

      this.editor.model.geometryNeedUpdate = true;
    });

    this.editor.transformTool = rotateTool;
  }

  scale()
  {
    let scaleTool = new ScaleTool(this.editor);
    let origin = this.editor.selection.getCenter();
    scaleTool.setOrigin(origin);

    let vertices = this.editor.selection.getVertices();

    scaleTool.on("transform", (tool, scale, difference) => {
      let multiplier = new THREE.Vector3(1, 1, 1);
      multiplier.add(difference);

      for(let vertex of vertices) {
        vertex.sub(origin);
        vertex.multiply(multiplier);
        vertex.add(origin);
      }

      this.editor.model.geometryNeedUpdate = true;
    });

    this.editor.transformTool = scaleTool;
  }

  extrude()
  {}

  split()
  {}

  loopCut()
  {}
}