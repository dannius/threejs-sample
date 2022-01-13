import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostListener('window:resize')
  public onResize() {
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.setRendererSize();
    this.setCameraAspect();
  }

  @ViewChild('canvas', { static: true, read: ElementRef })
  private canvas: ElementRef;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private clock: THREE.Clock;

  private fontLoader = new FontLoader();

  private baseNormalMaterial = new THREE.MeshNormalMaterial();

  private size = {
    height: window.innerHeight,
    width: window.innerWidth,
  }

  private shapes: THREE.Mesh[] = [];

  private tick = () => {
    const time = this.clock.getElapsedTime();

    this.orbitCtrl.update();
    this.renderer.render(this.scene, this.camera);

    this.shapes.forEach(shape => {
      const rotationVal = shape.userData.rotationSpeed * time;
      shape.rotation.set(rotationVal, rotationVal, rotationVal);
    });

    window.requestAnimationFrame(this.tick);
  }

  private orbitCtrl: OrbitControls;

  private get aspectRatio(): number {
    return this.size.width / this.size.height;
  }

  public ngOnInit(): void {
    const paramText = new URLSearchParams(window.location.search).get('value') || 'Hello world';

    this.setupFont(paramText);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 1, 100);
    this.camera.position.z = 50;

    this.camera.position.x = -30;
    this.camera.position.y = 30;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement });
    this.orbitCtrl = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitCtrl.enableDamping = true;

    this.setRendererSize();

    this.createDonuts();
    this.createCubs();

    this.scene.add(...this.shapes);
    // this.addAxesHelper();

    gsap.to(this.camera.position, { x: 0, y: 1, z: 4, duration: 1.5 })

    this.clock = new THREE.Clock();
    this.tick();
  }

  private setRendererSize(): void {
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private setCameraAspect(): void {
    this.camera.aspect = this.aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  private addAxesHelper(): void {
    const axisHelper = new THREE.AxesHelper();
    this.scene.add(axisHelper);
  }

  private setupFont(textValue: string): void {
    this.fontLoader.load('assets/IBM-Plex-Sans_Regular.json', (font: Font) => {
      const parameters = { font, size: 0.5, height: 0.2, curveSegments: 5, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevaleOffset: 0, bevelSegments: 4 };
      const textGeomatry = new TextGeometry(textValue, parameters);

      const text = new THREE.Mesh(textGeomatry, this.baseNormalMaterial);
      textGeomatry.center();

      this.scene.add(text);
    });
  }

  private createDonuts(): void {
    const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32);

    for (let i = 0; i < 100; i++) {
      this.shapes.push(this.createShape(donutGeometry, this.baseNormalMaterial));
    }
  }

  private createCubs(): void {
    const cubeGeometry = new THREE.BoxBufferGeometry(0.4, 0.4, 0.4);

    for (let i = 0; i < 100; i++) {
      this.shapes.push(this.createShape(cubeGeometry, this.baseNormalMaterial));
    }
  }

  private createShape(geometry: THREE.BoxBufferGeometry | THREE.TorusBufferGeometry, material: THREE.MeshNormalMaterial): THREE.Mesh {
    const shape = new THREE.Mesh(geometry, material);

    shape.position.x = (Math.random() - 0.5) * 15;
    shape.position.y = (Math.random() - 0.5) * 15;
    shape.position.z = (Math.random() - 0.5) * 15;
    
    shape.rotation.x = Math.random() * Math.PI;
    shape.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    shape.scale.set(scale, scale, scale);

    shape.userData.rotationSpeed = Math.random() * 1;

    return shape;
  }
}
