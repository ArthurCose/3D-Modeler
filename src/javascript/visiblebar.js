"use strict";

import "../stylesheets/visiblebar.css";
import * as BonesIcon from "../../noto-emoji/png/128/emoji_u2620.png"; // ☠️
import * as FacesIcon from "../../noto-emoji/png/128/emoji_u1f31d.png"; // 🌝
import * as WireframeIcon from "../../noto-emoji/png/128/emoji_u1f310.png"; // 🌐
import * as VerticesIcon from "../../noto-emoji/png/128/emoji_u25ab.png"; // ▫

import Toolbar from "./toolbar";

export default class VisibleBar extends Toolbar
{
  constructor(editor)
  {
    super();

    this.addToggle(
      "Bones", BonesIcon,
      editor.model.bonesVisible,
      (active) => editor.model.bonesVisible = active
    );

    this.addToggle(
      "Faces", FacesIcon,
      editor.model.facesVisible,
      (active) => editor.model.facesVisible = active
    );

    this.addToggle(
      "Wireframe", WireframeIcon,
      editor.model.wireframeVisible,
      (active) => editor.model.wireframeVisible = active
    );

    this.addToggle(
      "Vertices", VerticesIcon,
      editor.model.verticesVisible,
      (active) => editor.model.verticesVisible = active
    );

    editor.viewPane.appendChild(this.element);
  }

  createElement()
  {
    let element = super.createElement();
    element.classList.add("visiblebar");

    return element;
  }
}