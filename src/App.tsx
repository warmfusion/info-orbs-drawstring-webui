import { useState, useEffect, useRef } from 'react';
import { DrawstringRenderer } from './DrawstringRenderer';
import './App.css';

const initialDrawstrings = [
  // Orb 1: Clock face with smooth arc seconds
  `fill,white
circle,120,120,110,#333
fcircle,120,120,105,white
// Hour markers
line,120,30,120,50,#333
line,120,190,120,210,#333
line,30,120,50,120,#333
line,190,120,210,120,#333
// Hands
line,120,120,120,60,red
line,120,120,160,120,blue
sarc,120,120,100,0,270,3,green`,

  // Orb 2: Colorful target
  `fill,white
fcircle,120,120,100,#FFE0E0
fcircle,120,120,80,#FFE0FF
fcircle,120,120,60,#E0E0FF
fcircle,120,120,40,#E0FFE0
fcircle,120,120,20,#FFFFE0
circle,120,120,100,red
circle,120,120,80,magenta
circle,120,120,60,blue
circle,120,120,40,green
circle,120,120,20,yellow`,

  // Orb 3: Text showcase
  `fill,white
font,r
fsize,24
fcolor,blue
textc,Hello!,120,60
font,f
fsize,18
fcolor,red
fbcolor,yellow
text,Monospace,40,100
font,r
fsize,16
fcolor,green
textf,Fitted Text,20,140,200,30`,

  // Orb 4: Geometric shapes
  `fill,white
ftriangle,120,40,200,180,40,180,#E0E0FF
triangle,120,40,200,180,40,180,blue
frectangle,70,90,100,60,#FFE0E0
rectangle,70,90,100,60,red
fcircle,120,140,30,#E0FFE0
circle,120,140,30,green`,

  // Orb 5: Rainbow arcs
  `fill,white
sarc,120,120,100,0,60,8,red,#FFE0E0
sarc,120,120,85,60,120,8,orange,#FFE8D0
sarc,120,120,70,120,180,8,yellow,#FFFFE0
sarc,120,120,55,180,240,8,green,#E0FFE0
sarc,120,120,40,240,300,8,blue,#E0E0FF
sarc,120,120,25,300,360,8,purple,#FFE0FF`
];

function App() {
  const [commands, setCommands] = useState<string[]>(initialDrawstrings);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const renderers = useRef<(DrawstringRenderer | null)[]>([]);

  // Initialize refs array
  if (canvasRefs.current.length === 0) {
    canvasRefs.current = Array(5).fill(null);
    renderers.current = Array(5).fill(null);
  }

  useEffect(() => {
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas && !renderers.current[index]) {
        renderers.current[index] = new DrawstringRenderer(canvas);
      }
    });
  }, []);

  useEffect(() => {
    commands.forEach((cmd, index) => {
      if (renderers.current[index]) {
        renderers.current[index]?.render(cmd);
      }
    });
  }, [commands]);

  const handleCommandChange = (index: number, value: string) => {
    const newCommands = [...commands];
    newCommands[index] = value;
    setCommands(newCommands);
  };

  return (
    <div className="app">
      <div className="orbs-container">
        {Array(5).fill(null).map((_, index) => (
          <div key={index} className="orb-column">
            <div className="orb-wrapper">
              <canvas
                ref={el => canvasRefs.current[index] = el}
                width={240}
                height={240}
                className="drawing-canvas"
              />
            </div>
            <div className="editor-section">
              <textarea
                value={commands[index]}
                onChange={(e) => handleCommandChange(index, e.target.value)}
                placeholder={`Enter drawstring commands for Orb ${index + 1}...`}
                className="command-input"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 