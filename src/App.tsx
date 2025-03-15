import { useState, useEffect, useRef } from 'react';
import { DrawstringRenderer } from './DrawstringRenderer';
import './App.css';

function App() {
  const [commands, setCommands] = useState<string[]>(Array(5).fill(''));
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
  