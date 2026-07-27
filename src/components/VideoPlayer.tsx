import React, { useEffect, useRef, useState } from 'react';
import { FiMaximize, FiMinimize, FiPause, FiPlay, FiVolume2, FiVolumeX } from 'react-icons/fi';
import './../css/Player.css';


const VideoPlayer = ({ src, poster = '', view = 'portrait' }:{ src:string, poster:string, view:string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Component core playback configuration states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [duration, setDuration] = useState<string>('0:00');

  // Fix: Added Intersection Observer to safely auto-pause videos when scrolled out of viewport bounds
  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !videoNode.paused) {
          videoNode.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.25 } // Trigger when less than 25% of the card is visible
    );

    observer.observe(videoNode);
    return () => observer.disconnect();
  }, []);

  // Fix: Added a smart mouse inactivity timer so controls fade elegantly only after standing idle
// Inside your VideoPlayer Component...
useEffect(() => {
  // Fix: Explicitly initialize as a browser window number type
  let fadeTimer: number;
  
  if (isPlaying && showControls) {
    fadeTimer = window.setTimeout(() => {
      setShowControls(false);
    }, 2500); // Hide controls after 2.5 seconds of static mouse activity
  }

  // Clear using standard window method
  return () => window.clearTimeout(fadeTimer);
}, [showControls, isPlaying]);


  // Helper utility to convert raw numbers into standard media string timestamps
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Video Management Action Triggers
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch((err) => console.warn("Playback prevented:", err));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    setShowControls(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen to fullscreen changes triggered via hardware keys (Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Media Tracking Core Event Updates
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentPercent = (video.currentTime / video.duration) * 100;
    setProgress(isNaN(currentPercent) ? 0 : currentPercent);
    setCurrentTime(formatTime(video.currentTime));
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (Number(e.target.value) / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(Number(e.target.value));
  };

  return (
    <div 
      className={`custom-video-container ${isFullscreen ? 'fullscreen' : ''} ${view === 'portrait' ? 'mode-portrait' : 'mode-landscape'}`}
      ref={containerRef}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Primary HTML5 Media Object */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
        muted={isMuted}
        className={`native-video-node ${view === 'portrait' ? 'mode-portrait' : 'mode-landscape'}`}
      />

      {/* Floating Center Overlay Play HUD State Reminder Accent button */}
      <button 
        type="button" 
        className={`center-play-hud ${!isPlaying ? 'visible' : 'hidden'} ${view === 'portrait' ? 'mode-portrait' : 'mode-landscape'}`}
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        <FiPlay fill="currentColor" size={28} />
      </button>

      {/* CUSTOM INTERACTIVE PLAYER CONTROLS PANEL WORKSPACE */}
      <div className={`video-controls-panel ${showControls ? 'active' : 'faded'} ${view === 'portrait' ? 'mode-portrait' : 'mode-landscape'}`}>
        
        {/* Upper Lane: Full Width Scrub Timeline Slider standard */}
        <div className="timeline-scrubber-row">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
            className="video-progress-slider"
            style={{ '--seek-before-width': `${progress}%` } as React.CSSProperties}
            aria-label="Video timeline scrubber"
          />
        </div>

        {/* Lower Lane: Management triggers and timestamp counters metrics */}
        <div className="controls-command-bar">
          <div className="left-commands">
            <button 
              type="button" 
              className="ctrl-btn" 
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FiPause fill="currentColor" size={16} /> : <FiPlay fill="currentColor" size={16} />}
            </button>
            
            <button 
              type="button" 
              className="ctrl-btn" 
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
            </button>

            <span className="timestamp-tracker">
              {currentTime} <span className="divider">/</span> {duration}
            </span>
          </div>

          <div className="right-commands">
            <button 
              type="button" 
              className="ctrl-btn" 
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <FiMinimize size={16} /> : <FiMaximize size={16} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoPlayer;
