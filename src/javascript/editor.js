"use strict";

import "../stylesheets/editor.css"

import * as THREE from "three";
import Model from "./model";
import Selection from "./selection";
import Properties from "./properties";
import ContextBar from "./contextbar";
import VisibleBar from "./visiblebar";
import Input from "./input";
import CameraMan from "./cameraman";

export default class Editor
{
  constructor(element)
  {
    this.element = element;

    this.viewPane = document.createElement("div");
    this.viewPane.classList.add("view");

    this.canvas = document.createElement("canvas");
    this.viewPane.appendChild(this.canvas);

    this.element.appendChild(this.viewPane);

    this.model = new Model();
    this.selection = new Selection(this);
    this.properties = new Properties(this);
    this.contextbar = new ContextBar(this);
    this.visiblebar = new VisibleBar(this);
    this.input = new Input(this.canvas);
    this.cameraMan = new CameraMan(this.input);
    this.transformTool = undefined;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });

    this.renderer.autoClear = false;

    this.adjustSize();
    this.render();

    window.addEventListener("resize", () => this.adjustSize());
  }

  createElement()
  {

  }

  adjustSize()
  {
    this.renderer.setSize(
      this.viewPane.clientWidth,
      this.viewPane.clientHeight,
      false
    );

    let aspectRatio = this.canvas.width / this.canvas.height;
    this.cameraMan.setAspectRatio(aspectRatio);
  }

  update()
  {
    if(this.transformTool)
      this.transformTool.update();

    if(this.input.wasButtonTapped(0))
      if(!this.transformTool || !this.transformTool.testSelection())
        this.selection.update();

    this.cameraMan.update();
    this.input.update();
  }

  render()
  {
    requestAnimationFrame(() => this.render());

    this.update();

    this.renderer.clear();

    this.model.render(this.renderer, this.cameraMan.camera);
    this.selection.render(this.renderer, this.cameraMan.camera);

    if(this.transformTool) {
      this.renderer.clearDepth();
      this.transformTool.render(this.renderer, this.cameraMan.camera);
    }
  }
}