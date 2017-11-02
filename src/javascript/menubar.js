"use strict";

import "../stylesheets/menubar.css"

export default class MenuBar
{
  constructor(element, editor)
  {
    this.editor = editor;
    this.element = element;

    let openButton = document.createElement("button");
    let saveButton = document.createElement("button");
    let exportButton = document.createElement("button");

    openButton.innerText = "Open";
    saveButton.innerText = "Save";
    exportButton.innerText = "Export";

    openButton.addEventListener("click", () => this.open());
    saveButton.addEventListener("click", () => this.save());
    exportButton.addEventListener("click", () => this.export());

    this.element.appendChild(openButton);
    this.element.appendChild(saveButton);
    this.element.appendChild(exportButton);
  }

  open()
  {}

  save()
  {}

  export()
  {}
}