import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 100);
    this.camera.position.z = 2;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement });
    this.orbitCtrl = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitCtrl.enableDamping = true;

    const mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial(),
    );


    this.scene.add(this.camera, mesh);


    this.setRendererSize();

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
}
