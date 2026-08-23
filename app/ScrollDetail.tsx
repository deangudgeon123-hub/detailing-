'use client';

import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 120;
const frameSrc = (index: number) => `/frames/frame_${String(index + 1).padStart(4, '0')}.webp`;

export default function ScrollDetail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLSpanElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const currentFloatFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const stageRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];

    function drawFrame(index: number) {
      const canvas = canvasRef.current;
      const image = imagesRef.current[index];
      if (!canvas || !image || !image.naturalWidth) return;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width <= 800;
      // A huge 2x canvas is expensive on phones and was causing frame drops.
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      const pixelWidth = Math.floor(width * dpr);
      const pixelHeight = Math.floor(height * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = width / height;
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imageRatio) {
        drawHeight = width / imageRatio;
        offsetY = (height - drawHeight) / 2;
      } else {
        drawWidth = height * imageRatio;
        const overflowX = drawWidth - width;

        if (isMobile) {
          const startFocus = 0.26;
          const endFocus = 0.5;
          const transitionStart = 78;
          const transitionEnd = 108;
          const transitionProgress = Math.max(0, Math.min(1, (index - transitionStart) / (transitionEnd - transitionStart)));
          // Smoothstep stops the crop movement from feeling like a second animation fighting the frames.
          const eased = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
          const mobileFocus = startFocus + (endFocus - startFocus) * eased;
          offsetX = -(overflowX * mobileFocus);
        } else {
          offsetX = -overflowX / 2;
        }
      }

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    }

    async function preload() {
      const loadPromises: Promise<void>[] = [];

      for (let i = 0; i < FRAME_COUNT; i += 1) {
        const image = new Image();
        image.src = frameSrc(i);
        image.decoding = 'async';
        images.push(image);

        loadPromises.push(
          new Promise<void>((resolve) => {
            image.onload = async () => {
              try {
                await image.decode();
              } catch {
                // onload is enough as a fallback on browsers that reject decode().
              }
              resolve();
            };
            image.onerror = () => resolve();
          })
        );
      }

      imagesRef.current = images;
      await Promise.all(loadPromises);
      if (cancelled) return;

      drawFrame(0);
      setLoaded(true);
      readScrollTarget();
    }

    function readScrollTarget() {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const raw = scrollable > 0 ? -rect.top / scrollable : 0;
      const clamped = Math.max(0, Math.min(1, raw));

      targetFrameRef.current = clamped * (FRAME_COUNT - 1);

      if (railRef.current) {
        railRef.current.style.transform = `scaleY(${Math.max(clamped, 0.02)})`;
      }

      const nextStage = clamped < 0.24 ? 0 : clamped < 0.52 ? 1 : clamped < 0.78 ? 2 : 3;
      if (nextStage !== stageRef.current) {
        stageRef.current = nextStage;
        setStage(nextStage);
      }
    }

    function animate() {
      if (loaded || imagesRef.current.length) {
        const target = targetFrameRef.current;
        const current = currentFloatFrameRef.current;
        const distance = target - current;
        // Slightly stronger interpolation means fewer skipped frames while still feeling attached to the finger.
        const next = Math.abs(distance) < 0.03 ? target : current + distance * 0.14;
        currentFloatFrameRef.current = next;

        const nextFrame = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(next)));
        if (nextFrame !== currentFrameRef.current) {
          currentFrameRef.current = nextFrame;
          drawFrame(nextFrame);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    function resize() {
      drawFrame(currentFrameRef.current);
      readScrollTarget();
    }

    window.addEventListener('scroll', readScrollTarget, { passive: true });
    window.addEventListener('resize', resize);
    preload();
    readScrollTarget();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', readScrollTarget);
      window.removeEventListener('resize', resize);
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="scrollStory" id="experience">
      <div className="stickyScene">
        <canvas ref={canvasRef} className="detailCanvas" aria-label="Scroll driven luxury car detailing sequence" />
        <div className="sceneVignette" />

        {!loaded && (
          <div className="loader">
            <span />
            <p>Preparing the finish</p>
          </div>
        )}

        <div className={`sceneCopy sceneCopyOne ${stage === 0 ? 'active' : ''}`}>
          <span>01 · Exterior</span>
          <h1>Detailing that<br />changes the whole car.</h1>
          <p>Precision care. Deep gloss. A finish built to be noticed.</p>
        </div>

        <div className={`sceneCopy sceneCopyTwo ${stage === 1 ? 'active' : ''}`}>
          <span>02 · Interior</span>
          <h2>Every surface.<br />Every detail.</h2>
          <p>From leather and trim to the places most people never see.</p>
        </div>

        <div className={`sceneCopy sceneCopyThree ${stage === 2 ? 'active' : ''}`}>
          <span>03 · Precision</span>
          <h2>Clean is expected.<br />Perfect is the target.</h2>
          <p>Careful tools, refined technique and no rushed finishes.</p>
        </div>

        <div className={`sceneCopy sceneCopyFour ${stage === 3 ? 'active' : ''}`}>
          <span>04 · Finish</span>
          <h2>Drive away<br />different.</h2>
          <a href="#services">Explore detailing</a>
        </div>

        <div className="scrollRail" aria-hidden="true">
          <span ref={railRef} />
        </div>
        <div className="scrollHint">SCROLL TO DETAIL</div>
      </div>
    </section>
  );
}
