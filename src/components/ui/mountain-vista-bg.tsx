import React, { useMemo } from 'react';

// Data Configuration
const layersData = [
  { className: 'layer-6', speed: '120s', size: '222px', zIndex: 1, image: '6' },
  { className: 'layer-5', speed: '95s',  size: '311px', zIndex: 1, image: '5' },
  { className: 'layer-4', speed: '75s',  size: '468px', zIndex: 1, image: '4' },
  { className: 'bike-1',  speed: '10s',  size: '75px',  zIndex: 2, image: 'bike', animation: 'parallax_bike', bottom: '100px', noRepeat: true },
  { className: 'bike-2',  speed: '15s',  size: '75px',  zIndex: 2, image: 'bike', animation: 'parallax_bike', bottom: '100px', noRepeat: true },
  { className: 'layer-3', speed: '55s',  size: '158px', zIndex: 3, image: '3' },
  { className: 'layer-2', speed: '30s',  size: '145px', zIndex: 4, image: '2' },
  { className: 'layer-1', speed: '20s',  size: '136px', zIndex: 5, image: '1' },
];

interface MountainVistaParallaxProps {
  title?: string;
  subtitle?: string;
}

const MountainVistaParallax: React.FC<MountainVistaParallaxProps> = ({ title = '', subtitle = '' }) => {
  // Generate dynamic CSS for each layer
  const dynamicStyles = useMemo(() => {
    return layersData
      .map(layer => {
        const url = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/24650/${layer.image}.png`;
        return `
          .${layer.className} {
            background-image: url(${url});
            animation-duration: ${layer.speed};
            background-size: auto ${layer.size};
            z-index: ${layer.zIndex};
            ${layer.animation ? `animation-name: ${layer.animation};` : ''}
            ${layer.bottom ? `bottom: ${layer.bottom};` : ''}
            ${layer.noRepeat ? 'background-repeat: no-repeat;' : ''}
          }
        `;
      })
      .join('\n');
  }, []);

  return (
    <section
      className="hero-container relative w-full h-[400px] overflow-hidden bg-[#fdfbf7] dark:bg-[#0a0a0a]"
      aria-label="An animated parallax landscape of mountains and cyclists."
    >
      {/* Inject dynamic layer styles */}
      <style>{dynamicStyles}</style>

      {/* Render each parallax layer */}
      {layersData.map(layer => (
        <div
          key={layer.className}
          className={`parallax-layer absolute inset-0 w-full h-full bg-repeat-x bg-bottom pointer-events-none ${layer.className}`}
          style={{ animationIterationCount: 'infinite', animationTimingFunction: 'linear', opacity: 0.8 }}
        />
      ))}

      {/* Hero text */}
      {(title || subtitle) && (
        <div className="hero-content relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="hero-title text-4xl md:text-6xl font-serif font-bold text-[#991b1b] dark:text-[#f87171] mb-4 drop-shadow-sm">{title}</h1>
          <p className="hero-subtitle text-lg md:text-xl text-[#1a1a1a] dark:text-gray-300 max-w-2xl font-medium">{subtitle}</p>
        </div>
      )}
    </section>
  );
};

export default React.memo(MountainVistaParallax);
