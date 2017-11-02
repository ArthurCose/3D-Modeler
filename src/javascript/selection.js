"use strict";

import * as THREE from "three";
import Model from "./model";

export default class Selection
{
  constructor(editor)
  {
    this.editor = editor;
    this.model = new Model();
    this.list = [];

    this.vertexCount = 0;
    this.faceCount = 0;
    this.boneCount = 0;
  }

  get containsVertices()
  {
    return this.vertexCount > 0;
  }

  get containsFaces()
  {
    return this.faceCount > 0;
  }

  get containsBones()
  {
    return this.boneCount > 0;
  }

  get containsOnlyVertices()
  {
    return this.containsVertices && 
           !this.containsFaces &&
           !this.containsBones;
  }

  get containsOnlyFaces()
  {
    return this.containsFaces && 
           !this.containsVertices &&
           !this.containsBones;
  }

  get containsOnlyBones()
  {
    return this.containsBones && 
           !this.containsVertices &&
           !this.containsFaces;
  }

  // gets all selected vertices
  // even those indirectly selected through faces
  getVertices()
  {
    let vertices = new Set();

    for(let selected of this.list) {
      if(selected.__proto__.constructor == THREE.Vector3) {
        vertices.add(selected);
      } else if(selected.__proto__.constructor == THREE.Face3) {
        vertices.add(this.editor.model.vertices[selected.a]);
        vertices.add(this.editor.model.vertices[selected.b]);
        vertices.add(this.editor.model.vertices[selected.c]);
      }
    }

    return vertices;
  }

  getCenter()
  {
    let min = new THREE.Vector3(Infinity, Infinity, Infinity);
    let max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

    let account = (vector) => {
      min.x = Math.min(min.x, vector.x);
      min.y = Math.min(min.y, vector.y);
      min.z = Math.min(min.z, vector.z);

      max.x = Math.max(max.x, vector.x);
      max.y = Math.max(max.y, vector.y);
      max.z = Math.max(max.z, vector.z);
    };

    for(let selected of this.list) {
      if(selected.__proto__.constructor == THREE.Vector3) {
        account(selected);
      } else if(selected.__proto__.constructor == THREE.Face3) {
        let faceCenter = new THREE.Vector3();

        faceCenter.add(this.editor.model.vertices[selected.a]);
        faceCenter.add(this.editor.model.vertices[selected.b]);
        faceCenter.add(this.editor.model.vertices[selected.c]);

        faceCenter.divideScalar(3);

        account(faceCenter);
      } else if(selected.__proto__.constructor == THREE.Bone) {
        account(selected.position);
      }
    }

    let center = min.add(max).divideScalar(2);

    return center;
  }

  update()
  {
    // clear selection if ctrl is not held
    if(this.editor.input.isKeyUp(17))
      this.clear();

    let mouse = this.editor.input.getMousePositionNormalized();
    let vectorMouse = new THREE.Vector2(mouse.x, mouse.y);

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(vectorMouse, this.editor.cameraMan.camera);
    raycaster.params.Points.threshold = this.editor.model.pointsMaterial.size;

    let objects = [];

    if(this.editor.model.verticesVisible)
      objects.push(this.editor.model.points);

    if(this.editor.model.facesVisible)
      objects.push(this.editor.model.mesh);

    //if(this.editor.model.bonesVisible)
      //objects.push(this.editor.model.skeletonHelper);

    let selection = raycaster.intersectObjects(objects)[0];

    if(!selection)
      return;

    selection = this.identify(selection);

    if(this.list.includes(selection))
      this.remove(selection);
    else
      this.add(selection);
  }

  // returns the object actually selected (vertex, face, bone)
  identify(selection)
  {
    if(selection.object == this.editor.model.mesh)
      return selection.face;
    if(selection.object == this.editor.model.points)
      return this.editor.model.vertices[selection.index];

    throw "Could not identify selection";
  }

  add(selection, causeUpdates = true)
  {  
    this.list.push(selection);

    // update count and highlight
    if(selection.__proto__.constructor == THREE.Vector3) {
      this.editor.model.highlightVertex(selection);
      this.vertexCount++;
    } else if(selection.__proto__.constructor == THREE.Face3) {
      this.editor.model.highlightFace(selection);
      this.faceCount++;
    } else if(selection.__proto__.constructor == THREE.Bone) {
      this.editor.model.highlightBone(selection);
      this.boneCount++;
    }

    if(!causeUpdates)
      return;

    this.editor.properties.update();
    this.editor.contextbar.update();
  }

  remove(selection, causeUpdates = true)
  {
    let index = this.list.indexOf(selection);
    this.list.splice(index, 1);

    // update count and highlight
    if(selection.__proto__.constructor == THREE.Vector3) {
      this.editor.model.dimVertex(selection);
      this.vertexCount--;
    } else if(selection.__proto__.constructor == THREE.Face3) {
      this.editor.model.dimFace(selection);
      this.faceCount--;
    } else if(selection.__proto__.constructor == THREE.Bone) {
      this.editor.model.dimBone(selection);
      this.boneCount--;
    }

    if(!causeUpdates)
      return;

    this.editor.properties.update();
    this.editor.contextbar.update();
  }

  clear(causeUpdates = true)
  {
    for(let selection of this.list)
      this.editor.model.dimAll();

    this.list = [];
    this.vertexCount = 0;
    this.faceCount = 0;
    this.boneCount = 0;

    if(!causeUpdates)
      return;

    this.editor.properties.update();
    this.editor.contextbar.update();
  }

  render(renderer, camera)
  {
    this.model.render(renderer, camera);
  }
}