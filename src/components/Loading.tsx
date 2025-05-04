import React, { useEffect, useRef, useState } from 'react';

const Loading: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [typedText, setTypedText] = useState('');
    const fullText = 'Crafting the future...';

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setTypedText((prev) => prev + fullText[index]);
            index++;
            if (index === (fullText.length - 1)) clearInterval(interval);
        }, 90);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const setCanvasSize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // Particle class
        class Particle {
            x: number = 0;
            y: number = 0;
            size: number = 0;
            speedX: number = 0;
            speedY: number = 0;
            color: string = '';

            constructor() {
                if (!canvas) return;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = `rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2})`;
            }

            update() {
                if (!canvas) return;
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create particles
        const particles: Particle[] = [];
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50 overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
            />
            <div className="relative z-10 text-center">
                <div className="relative">
                </div>
                <h2 className="mt-8 text-3xl font-bold text-white animate-fade-in">
                    Load<span className="text-primary-500">ing</span>
                </h2>
                <p className="mt-4 text-gray-400 text-lg animate-fade-in-delayed">
                    {typedText}
                </p>
            </div>
        </div>
    );
};

export default Loading; 