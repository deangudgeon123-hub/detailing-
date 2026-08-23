'use client';

import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 120;

const frameSrc = (index: number) => `/frames/frame_${String(index + 1).padStart(4, '0')}.webp`;

export default function ScrollDetail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i += 1) {
      const image = new Image();
      image.src = frameSrc(i);
      image.decoding = 'async';
      image.onload = () => {
        loadedCount += 1;
        if (i === 0) drawFrame(0);
        if (loadedCount >= Math.min(18, FRAME_COUNT)) setLoaded(true);
      };
      images.push(image);
    }

    imagesRef.current = images;

    function drawFrame(index: number) {
      const canvas = canvasRef.current;
      const image = imagesRef.current[index];
      if (!canvas || !image || !image.complete || !image.naturalWidth) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

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
        offsetX = (width - drawWidth) / 2;
      }

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    }

    function update() {
      rafRef.current = null;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const raw = scrollable > 0 ? -rect.top / scrollable : 0;
      const clamped = Math.max(0, Math.min(1, raw));
      const nextFrame = Math.min(FRAME_COUNT - 1, Math.round(clamped * (FRAME_COUNT - 1)));

      setProgress(clamped);
      if (nextFrame !== currentFrameRef.current) {
        currentFrameRef.current = nextFrame;
        drawFrame(nextFrame);
      }
    }

    function requestUpdate() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    }

    function resize() {
      drawFrame(currentFrameRef.current);
      requestUpdate();
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', resize);
    requestUpdate();

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const stage = progress < 0.24 ? 0 : progress < 0.52 ? 1 : progress < 0.78 ? 2 : 3;

  return (
    <section ref={sectionRef} className="scrollStory" id="experience">
      <div className="stickyScene">
        <canvas ref={canvasRef} className="detailCanvas" aria-label="Scroll driven luxury car detailing sequence" />
        <div className="sceneVignette" />
        <div className="sceneGrain" />

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
          <span style={{ transform: `scaleY(${Math.max(progress, 0.02)})` }} />
        </div>
        <div className="scrollHint">SCROLL TO DETAIL</div>
      </div>
    </section>
  );
}
