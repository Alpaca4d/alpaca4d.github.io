// The 3D view of a design: the .glb Explorer Record wrote, turned with the mouse.
//
// Loaded only when someone first asks for 3D, as three.js is most of the page's weight. The
// camera stays where it is from one design to the next, so two designs are compared from the
// same place; Fit puts it back around the model.
//
// Text dots and text come as labels in the file's extras, and are drawn as tags over the model
// that face the camera and keep their size, as Rhino draws a text dot. Points are drawn as round
// dots of a fixed size; glTF's own points would be a single pixel.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export class Viewer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 4 / 3, 0.01, 1000);
    this.scene.add(this.camera);

    // Light from the sky and from where the camera is, so the side being looked at is lit.
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa0a8, 2.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(0.4, 1, 0.6);
    this.camera.add(key);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.className = 'labels3d';
    this.labelsVisible = true;
    this.dotTexture = roundDot();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => this.render());
    this.loader = new GLTFLoader();
    this.resizer = new ResizeObserver(() => this.resize());
    this.setTheme();
  }

  attach(container) {
    if (this.container === container) return;
    this.resizer.disconnect();
    this.container = container;
    container.append(this.renderer.domElement, this.labelRenderer.domElement);
    this.resizer.observe(container);
    this.resize();
  }

  detach() {
    this.resizer.disconnect();
    this.renderer.domElement.remove();
    this.labelRenderer.domElement.remove();
    this.container = null;
  }

  /** Forgets the model, so the next one is framed afresh. */
  clear() {
    this.detach();
    this.removeModel();
    this.url = null;
    this.framed = false;
  }

  /** Shows a design's model; returns how many labels it has. */
  async load(url) {
    if (url === this.url && this.model) return this.labelCount;
    this.url = url;
    const gltf = await this.loader.loadAsync(url);
    if (this.url !== url) return this.labelCount;
    this.removeModel();
    this.model = gltf.scene;
    this.model.traverse((node) => {
      if (!node.isPoints) return;
      node.material.size = 7;
      node.material.sizeAttenuation = false;
      node.material.map = this.dotTexture;
      node.material.alphaTest = 0.5;
      node.material.needsUpdate = true;
    });
    this.addLabels(gltf.scene.userData?.alpaca4d?.labels || []);
    this.scene.add(this.model);
    this.updateGrid();
    if (!this.framed) {
      this.frame();
      this.framed = true;
    }
    this.render();
    return this.labelCount;
  }

  addLabels(labels) {
    this.labels = new THREE.Group();
    this.labels.visible = this.labelsVisible;
    this.labelPoints = [];
    for (const label of labels) {
      if (!label || !label.text || !Array.isArray(label.position)) continue;
      const tag = document.createElement('div');
      tag.className = `label3d ${label.kind === 'text' ? 'text' : 'dot'}`;
      tag.textContent = label.text;
      const colour = /^#[0-9a-f]{6}$/i.test(label.color || '') ? label.color : '#2a2d31';
      // Plain text sits on a backing of the opposite lightness, so it reads on any view.
      if (label.kind === 'text') {
        tag.style.color = colour;
        tag.style.setProperty('--halo', readableOn(colour) === '#ffffff' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(29, 32, 36, 0.85)');
      } else {
        tag.style.background = colour;
        tag.style.color = readableOn(colour);
      }
      const object = new CSS2DObject(tag);
      object.position.fromArray(label.position);
      this.labels.add(object);
      this.labelPoints.push(object.position.clone());
    }
    this.labelCount = this.labels.children.length;
    this.model.add(this.labels);
  }

  setLabelsVisible(visible) {
    this.labelsVisible = visible;
    if (this.labels) this.labels.visible = visible;
    this.render();
  }

  /** The model's extent, labels included: a model of labels only has no geometry to measure. */
  bounds() {
    const box = new THREE.Box3().setFromObject(this.model);
    for (const point of this.labelPoints || []) box.expandByPoint(point);
    return box;
  }

  removeModel() {
    if (!this.model) return;
    this.scene.remove(this.model);
    // The tags are page elements, not geometry: they are taken off the page with the model.
    this.labels?.traverse((node) => node.element?.remove());
    this.labels = null;
    this.labelCount = 0;
    this.model.traverse((node) => {
      node.geometry?.dispose();
      const materials = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
      for (const material of materials) material.dispose();
    });
    this.model = null;
  }

  /** Puts the camera around the model, from the front, a little to the side and above. */
  frame() {
    if (!this.model) return;
    const box = this.bounds();
    if (box.isEmpty()) return;
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const radius = Math.max(sphere.radius, 1e-3);
    const distance = (radius / Math.sin(THREE.MathUtils.degToRad(this.camera.fov / 2))) * 1.05;
    const direction = new THREE.Vector3(0.75, 0.55, 1).normalize();
    this.camera.position.copy(sphere.center).addScaledVector(direction, distance);
    this.camera.near = distance / 200;
    this.camera.far = distance * 50;
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(sphere.center);
    this.controls.update();
    this.render();
  }

  /** A grid under the model, sized to it, in round metres. */
  updateGrid() {
    if (this.grid) {
      this.scene.remove(this.grid);
      this.grid.geometry.dispose();
      this.grid.material.dispose();
    }
    if (!this.model) return;
    const box = this.bounds();
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const extent = Math.max(size.x, size.z) * 1.4;
    const step = 10 ** Math.floor(Math.log10(Math.max(extent / 10, 1e-3)));
    const span = Math.ceil(extent / step / 2) * 2 * step;
    this.grid = new THREE.GridHelper(span, Math.round(span / step), this.gridMajor, this.gridMinor);
    const centre = box.getCenter(new THREE.Vector3());
    this.grid.position.set(centre.x, box.min.y - size.y * 0.002, centre.z);
    this.grid.material.transparent = true;
    this.grid.material.opacity = 0.7;
    this.scene.add(this.grid);
  }

  setTheme() {
    this.scene.background = new THREE.Color(cssVar('--viewer-bg') || '#eef0f2');
    this.gridMajor = new THREE.Color(cssVar('--border-strong') || '#cfd3d8');
    this.gridMinor = new THREE.Color(cssVar('--border') || '#e2e4e7');
    this.updateGrid();
    this.render();
  }

  resize() {
    if (!this.container) return;
    const { width, height } = this.container.getBoundingClientRect();
    if (width < 2 || height < 2) return;
    this.renderer.setSize(width, height, false);
    this.labelRenderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  render() {
    if (!this.container) return;
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }
}

/** A round dot for points, so they are not drawn as squares. */
function roundDot() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const context = canvas.getContext('2d');
  context.beginPath();
  context.arc(32, 32, 30, 0, Math.PI * 2);
  context.fillStyle = '#ffffff';
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** White or dark text, whichever reads better on a dot of this colour. */
function readableOn(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r ** 2.2 + 0.7152 * g ** 2.2 + 0.0722 * b ** 2.2;
  return lum > 0.35 ? '#1d2024' : '#ffffff';
}
