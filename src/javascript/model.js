"use strict";

import * as THREE from "three";

// todo:
//this.geometry.uvsNeedUpdate = true;
//this.geometry.normalsNeedUpdate = true;

export default class Model
{
  constructor()
  {
    this.selectedColor = new THREE.Color(0x0088ff);

    this.vertices = [];
    this.geometryNeedUpdate = false;
    this.elementsNeedUpdate = false;
    this.bonesVisible = false;
    this.facesVisible = true;
    this.wireframeVisible = false;
    this.verticesVisible = true;

    this.selectedFaceMaterial = new THREE.MeshBasicMaterial({
      color: this.selectedColor.getHex(),
      wireframe: true,
      wireframeLinewidth: 2
    });

    this.faceMaterial = new THREE.MeshBasicMaterial({
      vertexColors: THREE.FaceColors,
      wireframeLinewidth: 2,
      polygonOffset: true,
      polygonOffsetFactor: 3,
      polygonOffsetUnits: 1
    });

    this.pointsMaterial = new THREE.PointsMaterial({
      vertexColors: THREE.FaceColors,
      size: .1
    });

    this.selectedFacesMesh = new THREE.SkinnedMesh(
      new THREE.Geometry(),
      this.selectedFaceMaterial
    );

    this.mesh = new THREE.SkinnedMesh(
      new THREE.Geometry(),
      this.faceMaterial
    );

    this.points = new THREE.Points(
      new THREE.Geometry(),
      this.pointsMaterial
    );

    this.selectedFacesMesh.geometry.vertices = this.vertices;
    this.mesh.geometry.vertices = this.vertices;
    this.points.geometry.vertices = this.vertices;
  }

  get colorsNeedUpdate()
  {
    return this.mesh.geometry.colorsNeedUpdate;
  }

  set colorsNeedUpdate(value)
  {
    this.mesh.geometry.colorsNeedUpdate = value;
  }

  updateGeometry()
  {
    this.points.geometry._bufferGeometry.setFromObject(this.points);

    this.selectedFacesMesh.geometry.computeBoundingSphere();
    this.mesh.geometry.computeBoundingSphere();
    this.points.geometry.computeBoundingSphere();
    this.selectedFacesMesh.geometry.verticesNeedUpdate = true;
    this.mesh.geometry.verticesNeedUpdate = true;
    this.points.geometry.verticesNeedUpdate = true;

    this.geometryNeedUpdate = false;
  }

  addVertex(x, y, z)
  {
    let vertex = new THREE.Vector3(x, y, z);
    this.vertices.push(vertex);

    this.points.geometry.colors.push(new THREE.Color());

    this.geometryNeedUpdate = true;

    return vertex;
  }

  highlightVertex(vertex)
  {
    let index = this.vertices.indexOf(vertex);
    this.points.geometry.colors[index].set(this.selectedColor);
    this.points.geometry.colorsNeedUpdate = true;
  }

  dimVertex(vertex)
  {
    if(!this.vertices.includes(vertex))
      return;

    let index = this.vertices.indexOf(vertex);
    this.points.geometry.colors[index].setRGB(1, 1, 1);
    this.points.geometry.colorsNeedUpdate = true;
  }

  deleteVertex(vertex)
  {
    // update vertices
    let index = this.vertices.indexOf(vertex);
    this.vertices.splice(index, 1);

    this.points.geometry.colors.splice(index, 1);

    this.geometryNeedUpdate = true;

    // update faces
    let faces = this.mesh.geometry.faces.filter((face) => {
      if(face.a == index)
        return false;
      if(face.b == index)
        return false;
      if(face.c == index)
        return false;
      return true;
    });

    this.mesh.geometry.faces = faces;
    this.mesh.geometry.elementsNeedUpdate = true;
  }

  createFace(vertexIndexA, vertexIndexB, vertexIndexC)
  {
    let face = new THREE.Face3(vertexIndexA, vertexIndexB, vertexIndexC);
    this.mesh.geometry.faces.push(face);

    this.mesh.geometry.elementsNeedUpdate = true;

    // dispose to force an update to the wireframe
    this.mesh.geometry.dispose();

    return face;
  }

  colorFace(face, r, g, b)
  {
    if(typeof face == "number")
      face = this.mesh.geometry.faces[face];

    face.color.setRGB(r, g, b);

    this.mesh.geometry.colorsNeedUpdate = true;
  }

  highlightFace(face)
  {
    this.selectedFacesMesh.geometry.faces.push(face);

    this.selectedFacesMesh.geometry.elementsNeedUpdate = true;

    // dispose to force an update to the wireframe later
    this.selectedFacesMesh.geometry.dispose();
  }

  dimFace(face)
  {
    let index = this.selectedFacesMesh.geometry.faces.indexOf(face);
    this.selectedFacesMesh.geometry.faces.splice(index, 1);

    this.selectedFacesMesh.geometry.elementsNeedUpdate = true;

    // dispose to force an update to the wireframe later
    this.selectedFacesMesh.geometry.dispose();
  }

  deleteFace(face)
  {
    let index = this.mesh.geometry.faces.indexOf(face);
    this.mesh.geometry.faces.splice(index, 1);

    this.mesh.geometry.elementsNeedUpdate = true;

    // dispose to force an update to the wireframe later
    this.mesh.geometry.dispose();
  }

  dimAll()
  {
    this.selectedFacesMesh.geometry.faces = [];
    this.selectedFacesMesh.geometry.elementsNeedUpdate = true;

    // dispose to force an update to the wireframe later
    this.selectedFacesMesh.geometry.dispose();

    for(let color of this.points.geometry.colors)
      color.setRGB(1, 1, 1);
    this.points.geometry.colorsNeedUpdate = true;
  }

  render(renderer, camera)
  {
    if(this.geometryNeedUpdate)
      this.updateGeometry();

    if(this.facesVisible) {
      this.faceMaterial.wireframe = false;
      renderer.render(this.mesh, camera);
    }

    if(this.bonesVisible) {
      // todo
    }

    if(this.wireframeVisible) {
      this.faceMaterial.wireframe = true;
      renderer.render(this.mesh, camera);
    }

    if(this.verticesVisible) {
      renderer.render(this.points, camera);
    }

    this.selectedFacesMesh.material = this.selectedFaceMaterial;
    renderer.render(this.selectedFacesMesh, camera);
  }
}