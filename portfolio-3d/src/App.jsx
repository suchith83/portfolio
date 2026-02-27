import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Grid, Stars, Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

function Spaceship() {
  return (
    <group>
      {/* Ship Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.6, 2, 8]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 1, 8]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.5} />
      </mesh>
      {/* Wings */}
      <mesh position={[0.8, 0, -0.5]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#ff00ff" />
      </mesh>
      <mesh position={[-0.8, 0, -0.5]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#ff00ff" />
      </mesh>
      {/* Thruster */}
      <mesh position={[0, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.5, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Thruster Flame */}
      <mesh position={[0, 0, -1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 1, 8]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// Project Data
const projectsData = [
  { title: "Agentflow", desc: "Open-source AI agent framework. Focus on code structure and unit test coverage.", tags: ["Python", "LangChain"], url: "https://github.com/10xHub/Agentflow", color: "#00f3ff" },
  { title: "Deep Research Agent", desc: "Deep research agent with web searching capabilities for Hugging Face Hackathon.", tags: ["MCP", "HuggingFace"], url: "https://huggingface.co/spaces/Agents-MCP-Hackathon/deepsearch", color: "#ff00ff" },
  { title: "AI Robotic Prototype", desc: "Raspberry Pi-powered robot with real-time AI-generated responses.", tags: ["Hardware", "LLMs"], url: "#", color: "#00f3ff" },
  { title: "MCP PostgreSQL Node", desc: "Protocol server enabling natural language queries of PostgreSQL.", tags: ["FastMCP", "Postgres"], url: "#", color: "#ff00ff" },
  { title: "Churn Predictor", desc: "ML pipeline for telecom churn prediction using Random Forest.", tags: ["Scikit-learn", "SHAP"], url: "https://github.com/suchith83/Churn-Prediction", color: "#00f3ff" }
];

function NeuralCarousel() {
  const carouselGroupRef = useRef();

  useFrame((state, delta) => {
    if (carouselGroupRef.current) {
      // Slow continuous rotation as decoration
      carouselGroupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group>
      {/* Central Pillar */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 3, 16]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} transparent opacity={0.2} />
      </mesh>

      {/* Rotating arms with glowing endpoints */}
      <group ref={carouselGroupRef}>
        {projectsData.map((proj, index) => {
          const angle = (index / projectsData.length) * Math.PI * 2;
          const x = Math.sin(angle) * 3.5;
          const z = Math.cos(angle) * 3.5;

          return (
            <group key={index} position={[x, 0, z]}>
              {/* Rod from center to endpoint */}
              <mesh position={[0, 0, -1.75]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 3.5]} />
                <meshStandardMaterial color={proj.color} emissive={proj.color} emissiveIntensity={1} />
              </mesh>
              {/* Glowing node at endpoint */}
              <mesh>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color={proj.color} emissive={proj.color} emissiveIntensity={2} />
              </mesh>
            </group>
          )
        })}
      </group>
    </group>
  )
}

// Standalone Projects Display - renders in its own non-rotating group
function ProjectsDisplay() {
  const [activeIndex, setActiveIndex] = useState(0);
  const proj = projectsData[activeIndex];

  const nextProject = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % projectsData.length);
  };

  const prevProject = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length);
  };

  return (
    <Html transform scale={0.4} rotation={[0, 0, 0]}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div className="cyber-box" style={{
          width: '550px',
          padding: '2rem',
          backgroundColor: 'rgba(5, 5, 10, 0.95)',
          border: `1px solid ${proj.color}`,
          borderTop: `4px solid ${proj.color}`,
          color: '#fff',
          pointerEvents: 'auto',
          boxShadow: `0 0 30px rgba(${proj.color === '#00f3ff' ? '0,243,255' : '255,0,255'}, 0.5)`,
          transition: 'all 0.5s ease'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: proj.color }}>{proj.title}</h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#ccc', lineHeight: '1.4' }}>{proj.desc}</p>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
            {proj.tags.map(tag => (
              <span key={tag} style={{ fontSize: '0.8rem', color: proj.color }}>[{tag}]</span>
            ))}
          </div>
          {proj.url !== "#" && (
            <a href={proj.url} target="_blank" rel="noreferrer" style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: `rgba(${proj.color === '#00f3ff' ? '0,243,255' : '255,0,255'}, 0.2)`,
              color: proj.color,
              textDecoration: 'none',
              border: `1px solid ${proj.color}`,
              fontSize: '1rem',
              pointerEvents: 'auto'
            }}
              onClick={(e) => e.stopPropagation()}
            >
              ACCESS_DATA()
            </a>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={prevProject} onPointerDown={(e) => e.stopPropagation()} className="glitch-text" style={{
            padding: '10px 20px', background: 'rgba(5,5,10,0.9)', border: '2px solid #ff00ff',
            color: '#ff00ff', cursor: 'pointer', fontSize: '1rem', pointerEvents: 'auto', backdropFilter: 'blur(4px)'
          }}>{'<<< PREV'}</button>
          <span style={{ color: '#888', fontSize: '1rem', fontFamily: 'monospace' }}>{activeIndex + 1} / {projectsData.length}</span>
          <button onClick={nextProject} onPointerDown={(e) => e.stopPropagation()} className="glitch-text" style={{
            padding: '10px 20px', background: 'rgba(5,5,10,0.9)', border: '2px solid #00f3ff',
            color: '#00f3ff', cursor: 'pointer', fontSize: '1rem', pointerEvents: 'auto', backdropFilter: 'blur(4px)'
          }}>{'NEXT >>>'}</button>
        </div>
      </div>
    </Html>
  )
}

// Background Elements that stay fixed relative to scroll
function CyberBackground() {
  const gridRef = useRef()
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 5
    }
  })
  return (
    <>
      <ambientLight intensity={0.2} color="#444" />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#00f3ff" />
      <directionalLight position={[-10, -10, -5]} intensity={2} color="#ff00ff" />
      <pointLight position={[0, 0, 0]} intensity={2} distance={10} color="#ffffff" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={2} />

      <group ref={gridRef} position={[0, -5, 0]}>
        <Grid
          infiniteGrid
          fadeDistance={50}
          cellColor="#00f3ff"
          sectionColor="#ff00ff"
          cellSize={1}
          sectionSize={5}
        />
      </group>
    </>
  )
}

// Advanced 3D Scene Elements that scroll
function CyberScene() {
  const scroll = useScroll()
  const { viewport } = useThree()

  const mainCoreRef = useRef()
  const spaceshipRef = useRef()
  const carouselRef = useRef()
  const aboutCardRef = useRef()
  const projectsCardRef = useRef()

  useFrame((state, delta) => {
    const offset = scroll.offset

    // 1. Hero Core Animation & Slide Out
    if (mainCoreRef.current) {
      mainCoreRef.current.rotation.x += delta * 0.2
      mainCoreRef.current.rotation.y += delta * 0.3
      const color1 = new THREE.Color('#ff00ff')
      const color2 = new THREE.Color('#00f3ff')
      const mix = offset > 0.5 ? 1 : offset * 2
      mainCoreRef.current.material.color.lerpColors(color1, color2, mix)
      mainCoreRef.current.material.emissive.lerpColors(color1, color2, mix)

      const slideOut = scroll.range(0, 0.2)
      mainCoreRef.current.position.x = THREE.MathUtils.lerp(0, -10, slideOut)
    }

    // Shared: page 2 slide-in timing
    const slideIn1 = scroll.range(0.15, 0.15)
    const fadeOut1 = scroll.range(0.45, 0.1)

    // 2. Spaceship decoration - slides in from right, spins freely
    if (spaceshipRef.current) {
      spaceshipRef.current.position.y = -viewport.height * 1
      spaceshipRef.current.position.x = THREE.MathUtils.lerp(15, 4, slideIn1)
      spaceshipRef.current.position.z = THREE.MathUtils.lerp(-10, 0, slideIn1)
      spaceshipRef.current.rotation.y = state.clock.elapsedTime * 0.3
      spaceshipRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0, fadeOut1))
    }

    // 3. About Me card - slides in from left, same timing, NO rotation
    if (aboutCardRef.current) {
      aboutCardRef.current.position.y = -viewport.height * 1
      aboutCardRef.current.position.x = THREE.MathUtils.lerp(-15, -1, slideIn1)
      aboutCardRef.current.position.z = THREE.MathUtils.lerp(-10, 0, slideIn1)
      aboutCardRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0, fadeOut1))
    }

    // Shared: page 3 slide-in timing
    const slideIn2 = scroll.range(0.5, 0.15)

    // 4. Carousel decoration - slides in from right
    if (carouselRef.current) {
      carouselRef.current.position.y = -viewport.height * 2
      carouselRef.current.position.x = THREE.MathUtils.lerp(15, 4, slideIn2)
      carouselRef.current.position.z = THREE.MathUtils.lerp(-10, 0, slideIn2)
    }

    // 5. Projects card - slides in from left, same timing, NO rotation
    if (projectsCardRef.current) {
      projectsCardRef.current.position.y = -viewport.height * 2
      projectsCardRef.current.position.x = THREE.MathUtils.lerp(-15, -1, slideIn2)
      projectsCardRef.current.position.z = THREE.MathUtils.lerp(-10, 0, slideIn2)
    }
  })

  return (
    <>
      {/* Hero Centerpiece */}
      <group position={[0, 0, 0]}>
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh ref={mainCoreRef}>
            <icosahedronGeometry args={[1.5, 1]} />
            <meshStandardMaterial color="#ff00ff" wireframe={true} emissive="#ff00ff" emissiveIntensity={1} />
          </mesh>
          <mesh>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#000" metalness={1} roughness={0} />
          </mesh>
        </Float>
      </group>

      {/* Spaceship decoration - right side, free to spin */}
      <group ref={spaceshipRef}>
        <Spaceship />
      </group>

      {/* About Me Card - own group, no rotation, slides in from left */}
      <group ref={aboutCardRef}>
        <Html transform scale={0.4}>
          <div className="cyber-box" style={{
            width: '600px',
            padding: '3rem',
            backgroundColor: 'rgba(5, 5, 10, 0.95)',
            backdropFilter: 'blur(15px)',
            borderLeft: '5px solid #ff00ff',
            borderRight: '5px solid #00f3ff',
            color: '#ddd',
            pointerEvents: 'auto',
            boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)'
          }}>
            <h2 className="glitch-text" style={{ fontSize: '3rem', color: '#ff00ff', margin: '0 0 1.5rem 0', textAlign: 'center' }}>ABOUT_ME.exe</h2>
            <p style={{ fontSize: '1.3rem', lineHeight: '1.8', textAlign: 'center' }}>
              I'm an AI Software Engineer at <strong style={{ color: '#00f3ff' }}>10xscale.ai</strong>, building multi-agent systems using LangChain, LangGraph, and FastMCP.
              <br /><br />
              Graduated from <strong style={{ color: '#00f3ff' }}>IIT Delhi</strong>. I engineer digital experiences that live on the bleeding edge of technology.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              {['PYTHON', 'LANGCHAIN', 'LANGGRAPH', 'FASTMCP', 'PYTORCH'].map(skill => (
                <span key={skill} style={{ padding: '0.5rem 1rem', background: 'rgba(0, 243, 255, 0.15)', color: '#00f3ff', border: '2px solid #00f3ff', fontSize: '1rem', fontWeight: 'bold' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Html>
      </group>

      {/* Carousel decoration - right side, spins continuously */}
      <group ref={carouselRef}>
        <NeuralCarousel />
      </group>

      {/* Projects Card - own group, no rotation, slides in from left */}
      <group ref={projectsCardRef}>
        <ProjectsDisplay />
      </group>
    </>
  )
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/audio/cyberpunk_bgm.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(e => {
      console.log("Audio autoplay blocked by browser (user interaction required):", e);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div id="canvas-container" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      {/* Audio Control UI - Fixed outside the canvas */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <button
          onClick={toggleAudio}
          className="glitch-text"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid #00f3ff',
            color: '#00f3ff',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '1rem',
            backdropFilter: 'blur(5px)'
          }}
        >
          {isPlaying ? 'AUDIO ON [ X ]' : 'AUDIO OFF [ _ ]'}
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <fog attach="fog" args={['#050510', 10, 40]} />
        <color attach="background" args={['#020205']} />

        {/* CyberBackground stays put regardless of scroll */}
        <CyberBackground />

        <ScrollControls pages={4} damping={0.2}>

          <Scroll>
            {/* CyberScene gets dragged up by the Scroll component automatically */}
            <CyberScene />
          </Scroll>

          <Scroll html style={{ width: '100%', pointerEvents: 'none' }}>
            {/* Page 1: Hero */}
            <section className="section" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <h1 className="glitch-text" style={{ pointerEvents: 'auto', fontSize: '5rem', marginBottom: '1rem', textShadow: '0 0 20px #00f3ff', textAlign: 'center' }}>SUCHITH KODURU</h1>
              <p style={{ pointerEvents: 'auto', fontSize: '1.2rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#ccc', textAlign: 'center', maxWidth: '800px', lineHeight: '1.6' }}>
                AI Software Engineer <span style={{ color: '#ff00ff' }}>//</span> Building LLM agents & memory-augmented AI
              </p>
            </section>

            {/* Empty space for Page 2 (About) and Page 3 (Projects) because they are in 3D now */}
            <section style={{ height: '200vh' }}></section>

            {/* Page 4: Contact */}
            <section className="section" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div className="cyber-box" style={{ padding: '4rem', textAlign: 'center', borderTop: '5px solid #00f3ff', backgroundColor: 'rgba(5, 5, 10, 0.8)', pointerEvents: 'auto' }}>
                <h2 className="glitch-text" style={{ fontSize: '4rem', color: '#fff', marginBottom: '1rem' }}>ESTABLISH_LINK</h2>
                <p style={{ color: '#888', marginBottom: '3rem', letterSpacing: '2px' }}>Open to new opportunities. System ready for handshake.</p>

                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '3rem' }}>
                  <a href="https://github.com/suchith83" target="_blank" rel="noreferrer" className="glitch-text" style={{ color: '#00f3ff', textDecoration: 'none', fontSize: '1.2rem' }}>[ GITHUB ]</a>
                  <a href="https://www.linkedin.com/in/suchith-koduru-34966022b/" target="_blank" rel="noreferrer" className="glitch-text" style={{ color: '#ff00ff', textDecoration: 'none', fontSize: '1.2rem' }}>[ LINKEDIN ]</a>
                  <a href="https://suchith.space/resume.pdf" target="_blank" rel="noreferrer" className="glitch-text" style={{ color: '#00f3ff', textDecoration: 'none', fontSize: '1.2rem' }}>[ RESUME ]</a>
                </div>

                <a href="mailto:suchith1646@gmail.com" style={{ textDecoration: 'none', pointerEvents: 'auto' }}>
                  <button
                    className="glitch-text"
                    style={{
                      padding: '1.2rem 3rem',
                      fontSize: '1.2rem',
                      backgroundColor: 'rgba(0, 243, 255, 0.1)',
                      color: '#00f3ff',
                      border: '2px solid #00f3ff',
                      cursor: 'pointer',
                      letterSpacing: '3px',
                      boxShadow: '0 0 15px rgba(0,243,255,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#00f3ff';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 243, 255, 0.1)';
                      e.currentTarget.style.color = '#00f3ff';
                    }}
                  >
                    INITIATE_CONTACT()
                  </button>
                </a>
              </div>
            </section>
          </Scroll>

        </ScrollControls>
      </Canvas>
    </div>
  )
}

export default App
