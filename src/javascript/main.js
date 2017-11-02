"use strict";

import "../stylesheets/main.css"

import Editor from "./editor";
import MenuBar from "./menubar";

let editorElement = document.createElement("div");
let menubarElement = document.createElement("div");

editorElement.id = "editor";
menubarElement.id = "menubar";

document.body.appendChild(menubarElement);
document.body.appendChild(editorElement);

let editor = new Editor(editorElement);
let menubar = new MenuBar(menubarElement, editor);

editor.model.addVertex(-.5,  .5, 0);
editor.model.addVertex( .5, -.5, 0);
editor.model.addVertex(-.5, -.5, 0);

let face = editor.model.createFace(0, 2, 1);
editor.model.colorFace(face, 1, .7, 0);