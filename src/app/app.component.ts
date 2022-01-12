import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
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

  private fontLoader = new FontLoader();
  private textureLoader = new THREE.TextureLoader();

  private size = {
    height: window.innerHeight,
    width: window.innerWidth,
  }

  private tick = () => {
    this.orbitCtrl.update();
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.tick);
  }

  private orbitCtrl: OrbitControls;

  private get aspectRatio(): number {
    return this.size.width / this.size.height;
  }

  public ngOnInit(): void {
    this.setupFont();
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 100);
    this.camera.position.z = 7;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement });
    this.orbitCtrl = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitCtrl.enableDamping = true;

    this.setRendererSize();

    this.createDonuts();
    // this.addAxesHelper();

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

  private setupFont(): void {
    this.fontLoader.load('assets/helvetiker_regular.typeface.json', (font: Font) => {
      const parameters = { font, size: 0.5, height: 0.2, curveSegments: 5, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevaleOffset: 0, bevelSegments: 4 };
      const textGeomatry = new TextGeometry('Hello world', parameters);

      const matcapTexture = this.textureLoader.load('/assets/textures/awesome-matcap.png');

      const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
      const text = new THREE.Mesh(textGeomatry, textMaterial);
      textGeomatry.center();

      this.scene.add(text);
    });
  }

  private createDonuts(): void {
    const matcapTexture = this.textureLoader.load('/assets/textures/awesome-matcap.png');
    const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32);
    const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

    for (let i = 0; i < 150; i++) {
      this.scene.add(
        this.createSingleDonut(donutGeometry, donutMaterial)
      );
    }
  }

  private createSingleDonut(geometry: THREE.TorusBufferGeometry, material: THREE.MeshMatcapMaterial): THREE.Mesh {
    const donutMesh = new THREE.Mesh(geometry, material);

    donutMesh.position.x = (Math.random() - 0.5) * 10;
    donutMesh.position.y = (Math.random() - 0.5) * 10;
    donutMesh.position.z = (Math.random() - 0.5) * 10;
    
    donutMesh.rotation.x = Math.random() * Math.PI;
    donutMesh.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donutMesh.scale.set(scale, scale, scale);

    return donutMesh;
  }
}
