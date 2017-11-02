"use strict";

export default class Input
{
  constructor(element)
  {
    this.targetElement = element;
    this.oldHeldKeys = new Set();
    this.heldKeys = new Set();
    this.oldHeldMouseButtons = new Set();
    this.heldMouseButtons = new Set();
    
    this.oldMouse = {x: 0, y: 0};
    this.mouse = {x: 0, y: 0};

    element.addEventListener("keydown", (e) => this.onkeydown(e));
    element.addEventListener("keyup", (e) => this.onkeyup(e));
    element.addEventListener("mousedown", (e) => this.onmousedown(e));
    window.addEventListener("mouseup", (e) => this.onmouseup(e));
    window.addEventListener("mousemove", (e) => this.onmousemove(e));
    element.addEventListener("contextmenu", (e) => e.preventDefault());
    element.addEventListener("focusout", () => this.onfocusout());
    element.tabIndex = 1;
  }

  update()
  {
    this.oldHeldKeys = new Set(this.heldKeys);
    this.oldHeldMouseButtons = new Set(this.heldMouseButtons);
    this.oldMouse.x = this.mouse.x;
    this.oldMouse.y = this.mouse.y;
  }

  getMousePosition()
  {
    return {
      x: this.mouse.x,
      y: this.mouse.y
    };
  }

  getMousePositionNormalized()
  {
    return {
      x: this.mouse.x / this.targetElement.clientWidth * 2 - 1,
      y: -this.mouse.y / this.targetElement.clientHeight * 2 + 1
    };
  }

  getMouseDisplacement()
  {
    return {
      x: this.oldMouse.x - this.mouse.x,
      y: this.oldMouse.y - this.mouse.y
    };
  }

  isKeyDown(keyCode)
  {
    return this.heldKeys.has(keyCode);
  }

  isKeyUp(keyCode)
  {
    return !this.heldKeys.has(keyCode);
  }

  wasKeyTapped(keyCode)
  {
    return this.heldKeys.has(keyCode) &&
           !this.oldHeldKeys.has(keyCode);
  }

  isButtonDown(button)
  {
    return this.heldMouseButtons.has(button);
  }

  isButtonUp(button)
  {
    return !this.heldMouseButtons.has(button);
  }

  wasButtonTapped(button)
  {
    return this.heldMouseButtons.has(button) &&
           !this.oldHeldMouseButtons.has(button);
  }

  // event handlers

  onkeydown(e)
  {
    this.heldKeys.add(e.keyCode);

    if(e.keyCode != 116)
      e.preventDefault();
  }

  onkeyup(e)
  {
    this.heldKeys.delete(e.keyCode);
    e.preventDefault();
  }

  onmousedown(e)
  {
    this.heldMouseButtons.add(e.button);

    // fix keys often combined on re-entry
    if(e.ctrlKey) 
      this.heldKeys.add(17);

    if(e.shiftKey)
      this.heldKeys.add(16);

    if(e.altKey)
      this.heldKeys.add(18);

    this.targetElement.focus();
    e.preventDefault();
  }

  onmouseup(e)
  {
    this.heldMouseButtons.delete(e.button);
  }

  onmousemove(e)
  {
    let bounds = this.targetElement.getBoundingClientRect();
    this.mouse.x = e.clientX - bounds.left;
    this.mouse.y = e.clientY - bounds.top;
  }

  onfocusout()
  {
    this.heldKeys.clear();
    this.heldMouseButtons.clear();
  }
}