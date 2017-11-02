"use strict";

import "../stylesheets/toolbar.css";

export default class Toolbar
{
  constructor()
  {
    this.element = this.createElement();
  }

  createElement()
  {
    let element = document.createElement("div");
    element.classList.add("toolbar");

    return element;
  }

  addButton(name, iconPath, callback)
  {
    let button = document.createElement("button");
    button.style.backgroundImage = `url(${iconPath})`;
    button.title = name;

    button.addEventListener("click", () => callback());

    this.element.appendChild(button);

    return button;
  }

  addToggle(name, iconPath, startActive, callback)
  {
    let active = startActive;

    let button = document.createElement("button");
    button.style.backgroundImage = `url(${iconPath})`;
    button.title = name;
    button.tabIndex = -1;

    if(active)
      button.classList.add("active");

    button.addEventListener("click", () => {
      if(active)
        button.classList.remove("active");
      else
        button.classList.add("active");

      active = !active;
      callback(active);
    });

    this.element.appendChild(button);

    return button;
  }
}