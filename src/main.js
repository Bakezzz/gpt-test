import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/900.css';
import '@fontsource/instrument-serif/400-italic.css';
import './style.css';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Inline icons render consistently even on machines without symbol fonts.
const iconPaths = {
  '↗': 'M5 19 19 5M5 5h14v14', '↙': 'M19 5 5 19M5 5v14h14',
  '↑': 'M12 20V4M5 11l7-7 7 7', '↓': 'M12 4v16M5 13l7 7 7-7',
  '↔': 'M3 12h18M8 7l-5 5 5 5M16 7l5 5-5 5',
  '＋': 'M12 4v16M4 12h16', '✕': 'M5 5l14 14M19 5 5 19',
  '✳': 'M12 2v20M2 12h20M5 5l14 14M5 19 19 5'
};
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const textNodes = [];
while (walker.nextNode()) if (!['SCRIPT', 'STYLE'].includes(walker.currentNode.parentElement.tagName) && /[↗↙↑↓↔＋✕✳]/u.test(walker.currentNode.textContent)) textNodes.push(walker.currentNode);
for (const node of textNodes) {
  const fragment = document.createDocumentFragment();
  for (const part of node.textContent.split(/([↗↙↑↓↔＋✕✳])/u)) {
    if (!iconPaths[part]) { fragment.append(document.createTextNode(part)); continue; }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'icon'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', iconPaths[part]); svg.append(path); fragment.append(svg);
  }
  node.replaceWith(fragment);
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelector('#year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded)); menu.hidden = expanded;
});
menu.querySelectorAll('a, button').forEach(el => el.addEventListener('click', () => { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }));
const briefDialog = document.querySelector('#brief-dialog');
const projectDialog = document.querySelector('#project-dialog');
function openBrief() { if (projectDialog.open) projectDialog.close(); briefDialog.showModal(); }
document.querySelectorAll('[data-contact]').forEach(el => el.addEventListener('click', openBrief));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const box = dialog.getBoundingClientRect(); if(e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close(); } });
});
const descriptions = [
  'An exploration of light, texture and sculptural form. Soft organic shapes meet a sharp colour palette in a study of balance and unexpected connections. This is a visual concept created for this website, not a commissioned client project.',
  'A doorway into another perspective. Architectural form and an atmospheric palette create a visual world that sits somewhere between the familiar and the imagined. This is an original art direction concept, not client work.',
  'A typographic experiment in energy and rhythm. Expressive letterforms and warm colour explore how a still image can suggest movement. This is a visual motion study created for this website, not a client project.'
];
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.project);
  const container = document.querySelector('#project-detail');
  container.replaceChildren(button.querySelector('.project-art').cloneNode(true));
  const title = document.createElement('h2'); title.textContent = button.querySelector('h3').textContent;
  const description = document.createElement('p'); description.textContent = descriptions[index];
  container.append(title, description); projectDialog.showModal();
}));
document.querySelector('#brief-form').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const content = `MCF VISUALS — PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nFocus: ${data.get('focus')}\n\nTHE IDEA\n${data.get('idea')}\n\nPrepared ${new Date().toLocaleDateString('en-GB')}\nThis brief has not been sent. Share it with MCF Visuals through your preferred contact channel.\n`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'mcf-visuals-project-brief.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  e.target.querySelector('[role=status]').textContent = 'Your brief has been downloaded. It has not been sent — share it through your preferred channel.';
});

const progress = document.querySelector('.page-progress');
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
}, { passive: true });

// The scene is progressive enhancement: all content works without WebGL.
try {
  const canvas = document.querySelector('#sculpture');
  const wrap = canvas.parentElement;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  camera.position.set(0, .2, 9.7);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6c715e, 3));
  const light = new THREE.DirectionalLight(0xffffff, 5); light.position.set(-4, 6, 4); scene.add(light);
  const fill = new THREE.DirectionalLight(0xdaf7ad, 2); fill.position.set(5, -2, -3); scene.add(fill);
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.TorusKnotGeometry(1.38, .45, 220, 40, 2, 3);
  const material = new THREE.MeshStandardMaterial({ color: 0xc5c7b8, metalness: 1, roughness: .16, envMapIntensity: 1.8 });
  const sculpture = new THREE.Mesh(geometry, material);
  group.add(sculpture);
  group.rotation.set(.25, -.35, -.4);
  // A soft procedural shadow avoids additional assets or network requests.
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64,64,3,64,64,64); gradient.addColorStop(0,'rgba(33,38,22,0.23)'); gradient.addColorStop(1,'rgba(33,38,22,0)'); ctx.fillStyle = gradient; ctx.fillRect(0,0,128,128);
  const shadow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }));
  shadow.position.set(.1,-2.3,-.6); shadow.scale.set(5.2,.9,1); scene.add(shadow);
  let visible = true, dragging = false, dragX = 0, manualRotation = 0, pointerX = 0, pointerY = 0;
  const size = () => { const { width, height } = wrap.getBoundingClientRect(); renderer.setSize(width,height,false); camera.aspect = width / height; camera.updateProjectionMatrix(); };
  new ResizeObserver(size).observe(wrap); size();
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(wrap);
  canvas.addEventListener('pointerdown', e => { dragging = true; dragX = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if(dragging) { manualRotation += (e.clientX - dragX) * .012; dragX = e.clientX; }
    const bounds = canvas.getBoundingClientRect(); pointerX = (e.clientX - bounds.left)/bounds.width-.5; pointerY = (e.clientY - bounds.top)/bounds.height-.5;
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  const start = performance.now();
  renderer.setAnimationLoop(now => {
    if(!visible || document.hidden) return;
    const time = (now-start)/1000;
    const shift = reducedMotion ? 0 : Math.min(scrollY / innerHeight, 1.5);
    const targetY = -.35 + manualRotation + (reducedMotion ? 0 : time * .12 + shift * 1.5 + pointerX*.2);
    group.rotation.y += (targetY-group.rotation.y)*.045;
    group.rotation.x += ((.25 + shift*.5 + (reducedMotion ? 0 : pointerY*.15))-group.rotation.x)*.035;
    group.rotation.z = -.4 + shift*.4;
    group.position.y = reducedMotion ? 0 : Math.sin(time*.7)*.07;
    renderer.render(scene,camera);
  });
  document.documentElement.classList.add('webgl-ready');
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); renderer.setAnimationLoop(null); document.documentElement.classList.remove('webgl-ready'); });
} catch (error) { console.info('3D enhancement unavailable; displaying static artwork.'); }
