import { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setGameSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          if (!isGameOver) setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions (walls)
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check collisions (self)
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          setGameSpeed(speed => Math.max(MIN_SPEED, speed - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameLoop);
  }, [direction, food, isPaused, isGameOver, gameSpeed, generateFood]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blockSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * blockSize, 0);
      ctx.lineTo(i * blockSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * blockSize);
      ctx.lineTo(canvas.width, i * blockSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ec4899'; // Magenta neon
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ec4899';
    ctx.beginPath();
    ctx.arc(
      food.x * blockSize + blockSize / 2,
      food.y * blockSize + blockSize / 2,
      blockSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#22d3ee' : '#0891b2'; // Cyan neon
      ctx.shadowBlur = index === 0 ? 10 : 0;
      ctx.shadowColor = '#22d3ee';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * blockSize + padding,
        segment.y * blockSize + padding,
        blockSize - padding * 2,
        blockSize - padding * 2
      );
    });
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex w-full max-w-[400px] justify-between items-center mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Current Score</span>
          <span className="text-4xl font-bold neon-text-cyan font-mono leading-none">{score.toString().padStart(4, '0')}</span>
        </div>

        <div className="px-4 py-1.5 border-2 border-cyan-500/50 rounded-md bg-cyan-500/5 backdrop-blur-sm -mb-2">
          <span className="text-xl font-black uppercase tracking-tighter text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Snake Game</span>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-zinc-500">
            <Trophy size={14} />
            <span className="text-[10px] uppercase tracking-widest font-mono">High Score</span>
          </div>
          <span className="text-2xl font-bold text-zinc-400 font-mono leading-none">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-zinc-950 rounded-lg neon-border-cyan cursor-crosshair"
        />

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg z-10"
            >
              <h2 className={`text-6xl font-black uppercase tracking-tighter mb-10 ${isGameOver ? 'neon-text-magenta' : 'neon-text-cyan'}`}>
                {isGameOver ? 'Game Over' : 'Paused'}
              </h2>
              
              <button
                onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                className={`flex items-center gap-4 px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isGameOver 
                    ? 'bg-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.6)]'
                    : 'bg-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.6)]'
                } text-black`}
              >
                {isGameOver ? (
                  <>
                    <RotateCcw size={28} strokeWidth={3} />
                    Try Again
                  </>
                ) : (
                  <>
                    <Play size={28} fill="currentColor" />
                    Resume
                  </>
                )}
              </button>
              
              <p className="mt-12 text-[11px] uppercase tracking-[0.4em] text-zinc-500 font-bold">
                Press Space to {isGameOver ? 'Restart' : 'Resume'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-[400px]">
        <div className="glass-panel p-3 rounded-xl flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest text-zinc-500">Speed</span>
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              animate={{ width: `${((INITIAL_SPEED - gameSpeed) / (INITIAL_SPEED - MIN_SPEED)) * 100}%` }}
            />
          </div>
        </div>
        <div className="glass-panel p-3 rounded-xl flex items-center justify-center">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500">Move: Arrow Keys</span>
        </div>
      </div>
    </div>
  );
}
