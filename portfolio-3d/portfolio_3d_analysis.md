# Portfolio 3D - Code Analysis

This document provides a detailed breakdown of the 3D scene elements, their bindings, scroll-based animations, and the underlying code managing them based on `App.jsx`.

## 1. About Me `.exe` Card
* **Corresponding Code:** The UI is defined as a regular HTML block inside a `<Html>` component from React Three Drei. It is wrapped in `<group ref={aboutCardRef}>` inside the `CyberScene` component (lines 289-318).
* **Bindings:** It is entirely independent and is not technically bound to any 3D objects like the spaceship. It resides in its own isolated 3D group (`aboutCardRef`) positioned globally within the Canvas.
* **Scroll Movement:** When scrolling from the hero section to the 2nd page (scroll offset between 15% to 30%), the card smoothly slides in from the **left** side of the screen (X shifts from `-15` to `-1`) and moves slightly forward (Z shifts from `-10` to `0`). Upon scrolling past page 2, the card scales down to 0, fading out.
* **Managing Code:** The `useFrame` hook in `CyberScene` (lines 242-248) manages this by reading the current `scroll.offset` and using `THREE.MathUtils.lerp` to smoothly transition coordinates frame-by-frame.

## 2. Space Ship Model
* **Corresponding Code:** The structure of the spaceship is defined in its own modular component `<Spaceship />` (lines 7-41) using standard three.js primitives (`cylinderGeometry`, `coneGeometry`, `boxGeometry`). It is inserted into the scene within `<group ref={spaceshipRef}>` (lines 284-287).
* **Bindings:** It is **not** bound to the About Me `.exe` card. However, their animations are triggered simultaneously by the exact same scroll timing variables (`slideIn1` and `fadeOut1`), making them visually paired as they enter from opposite sides of the screen.
* **Scroll Movement:** As you scroll to page 2, the spaceship slides in from the **right** (X shifts from `15` to `4`) while moving forward. Unlike the About Me card, the spaceship features a continuous, free-spinning rotation on its Y-axis. It also fades/scales out as you scroll past it.
* **Managing Code:** Look inside the `useFrame` loop of `CyberScene` (lines 233-240). The position is lerped based on `slideIn1` ranges, and the continuous floating rotation uses `state.clock.elapsedTime * 0.3`.

## 3. Projects Component
* **Corresponding Code:** This experience splits into two visual parts within `CyberScene`:
   1. The **3D visuals** are handled by the `<NeuralCarousel />` component (lines 52-99) inside `<group ref={carouselRef}>`.
   2. The **HTML UI component** is handled by the `<ProjectsDisplay />` component (lines 101-168) inside `<group ref={projectsCardRef}>`.
* **Bindings & Clicks:** The 3D carousel and the 2D UI display are **not structurally bound** together. Currently, clicking the `Next` or `Prev` buttons in the `ProjectsDisplay` updates its internal React state (`activeIndex`) to change the text info, but it **does not** influence or rotate the 3D `<NeuralCarousel />` in response to the click. The 3D carousel naturally rotates slowly and consistently at all times.
* **Scroll Movement:** Both elements slide in at the same time when reaching page 3 of the scroll (`slideIn2`), with the 3D Carousel sliding in from the right and the UI card sliding in from the left.
* **Managing Code:** The slide-in positioning is managed in the `useFrame` inside `CyberScene` between lines 253-265. The `NeuralCarousel` rotation is managed independently in its own `useFrame` hook (lines 55-60), and the UI clicks are handled by local state (`useState`) methods inside `ProjectsDisplay` (lines 103-114).

## 4. Satellite
* **Note:** There is no specific component named "Satellite" in the codebase, but you are likely referring to one of two central visual elements:
   1. **The Hero Centerpiece (Main Core):** The floating, wireframe shape on the home screen (lines 270-282, `mainCoreRef`). 
      * **Bindings:** It is placed at the very top of the canvas and moves independently of the Projects component.
      * **Scroll Movement:** It constantly spins, shifts colors from purple to cyan, and slides out to the far left when you start scrolling down exactly at offset `0` to `0.2`.
      * **Managing Code:** Checked within the `useFrame` in `CyberScene` (lines 216-227), dynamically manipulating `mainCoreRef.current`.
   2. **The Nodes on the Carousel:** The glowing spheres sitting at the ends of the rods inside the `NeuralCarousel` component (lines 88-92).
      * **Bindings:** These exist directly bound as children of the carousel array and rotate alongside it.

## 5. Overview of Key Libraries and Methods Used
This project relies heavily on the React Three ecosystem architecture:
* **`@react-three/fiber`:** The core engine bridging classic `THREE.js` declarative logic into React components.
  * *`<Canvas>`*: The root component orchestrating WebGL and lighting mounts.
  * *`useFrame`*: The driver behind all constant 3D animations frame calculations per second. It manipulates coordinates based on screen time updates (`delta` and `clock`).
* **`@react-three/drei`:** An extensive library packed with pre-made helper components for Fiber systems.
  * *`ScrollControls` and `Scroll`*: Seamlessly ties standard native webpage scrolling behaviors (swiping, wheel scrolls) mathematically to 3D cameras and coordinates (`useScroll().offset`).
  * *`<Html>`*: A profound element anchoring standard 2D React DOM `div` layouts securely to precise `[x,y,z]` 3D positions over canvas layers seamlessly (used for your UI cards).
  * *`Float`, `Stars`, `Grid`*: Useful aesthetic effect presets delivering ambient movements and environmental grid details.
