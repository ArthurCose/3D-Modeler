"use strict";

import * as THREE from "three";
import EventRaiser from "../eventraiser";

export default class PropertyWidget extends EventRaiser
{
  constructor(label)
  {
    super();
    this.addEvent("change");

    this.container = document.createElement("div");
    this.container.className = "property";

    this.expandButton = document.createElement("div");
    this.expandButton.className = "expand-button";
    this.expandButton.addEventListener("click", () => this.toggle());
    this.container.appendChild(this.expandButton);

    this.label = document.createElement("span");
    this.label.innerText = label;
    this.expandButton.appendChild(this.label);

    this.table = document.createElement("table");
    this.container.appendChild(this.table);

    this.expanded = true;
  }

  toggle()
  {
    if(this.expanded)
      this.compress();
    else
      this.expand();
  }

  expand()
  {
    let minHeight = this.expandButton.clientHeight;
    let maxHeight = this.table.clientHeight + minHeight;

    this.container.style.height = maxHeight + "px";
    this.expanded = true;
  }

  compress()
  {
    let minHeight = this.expandButton.clientHeight;
  
    this.container.style.height = minHeight + "px";
    this.expanded = false;
  }

  addInputRow(label)
  {
    let row = this.table.insertRow();

    let labelCell = row.insertCell();
    labelCell.innerText = label + ':';

    let inputCell = row.insertCell();
    return inputCell;
  }

  addTextInput(label, regex, value, callback)
  {
    let inputCell = this.addInputRow(label);
    let textInput = document.createElement("input");
    textInput.type = "text";
    textInput.value = value;

    textInput.addEventListener("change", () => {
      if(regex.test(textInput.value))
        callback(textInput.value);
    });

    inputCell.appendChild(textInput);

    return textInput;
  }

  addNumericInput(label, value, callback)
  {
    let inputCell = this.addInputRow(label);
    let valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.value = value;

    valueInput.addEventListener("change", () => {
      let value = parseFloat(valueInput.value);
      callback(value);
    });

    inputCell.appendChild(valueInput);

    return valueInput;    
  }

  addRangeInput(label, min, max, value, callback)
  {
    let valueInput = this.addNumericInput(label, value, callback);
    valueInput.min = min;
    valueInput.max = max;

    return valueInput;
  }

  addColorInput(label, value, callback)
  {
    let inputCell = this.addInputRow(label);
    let colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = value;

    colorInput.addEventListener("input", () => callback(colorInput.value));

    inputCell.appendChild(colorInput);

    return colorInput;
  }
}