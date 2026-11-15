import { useId, useState } from 'react';
import { ProductShapeVariant } from '@/src/types/catalog';

interface ProductVisualProps {
  code?: string;
  name: string;
  imageUrl: string | null;
  shapeVariant: ProductShapeVariant;
  className?: string;
  showCodeWatermark?: boolean;
}

function ArchitecturalDiagram({
  shapeVariant,
  code,
  showCodeLabel,
}: {
  shapeVariant: ProductShapeVariant;
  code?: string;
  showCodeLabel?: boolean;
}) {
  const patternId = useId();
  const strokeMain = '#252B30';
  const strokeMuted = '#69737A';
  const fillLight = '#EAE8E2';
  const fillMid = '#DCD9D0';
  const fillDark = '#C8C4B9';

  const renderShape = () => {
    switch (shapeVariant) {
      case 'block-hollow-full':
      case 'block-visible-full': {
        const isVisible = shapeVariant === 'block-visible-full';
        return (
          <g>
            {/* Top face */}
            <polygon
              points="46,72 130,44 214,76 130,104"
              fill={isVisible ? '#ECEAE4' : fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Hollow cores */}
            <polygon
              points="74,72 114,59 138,68 98,81"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="116,87 156,74 180,83 140,96"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Front left face */}
            <polygon
              points="46,72 130,104 130,152 46,120"
              fill={isVisible ? '#E5E2DA' : fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Front right face */}
            <polygon
              points="130,104 214,76 214,124 130,152"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {isVisible && (
              <line
                x1="48"
                y1="75"
                x2="128"
                y2="106"
                stroke={strokeMuted}
                strokeWidth="0.75"
                strokeDasharray="2 2"
              />
            )}
          </g>
        );
      }

      case 'block-hollow-half':
      case 'block-visible-half': {
        return (
          <g>
            <polygon
              points="76,72 130,52 184,74 130,94"
              fill={fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="100,72 130,61 158,72 128,83"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="76,72 130,94 130,144 76,122"
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="130,94 184,74 184,124 130,144"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        );
      }

      case 'channel-u': {
        return (
          <g>
            {/* Outer U */}
            <polygon
              points="46,72 130,44 214,76 130,104"
              fill={fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* U Channel trench */}
            <polygon
              points="68,72 130,51 192,75 130,96"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="46,72 130,104 130,152 46,120"
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="130,104 214,76 214,124 130,152"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* End U-notch hint */}
            <polyline
              points="154,96 154,116 190,104 190,84"
              fill="none"
              stroke={strokeMuted}
              strokeWidth="1"
              strokeDasharray="3 2"
            />
          </g>
        );
      }

      case 'slab':
      case 'cover': {
        const isCover = shapeVariant === 'cover';
        const h = isCover ? 16 : 24;
        return (
          <g>
            <polygon
              points="36,88 130,52 224,88 130,124"
              fill={fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points={`36,88 130,124 130,${124 + h} 36,${88 + h}`}
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points={`130,124 224,88 224,${88 + h} 130,${124 + h}`}
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {!isCover && (
              <line
                x1="83"
                y1="70"
                x2="177"
                y2="106"
                stroke={strokeMuted}
                strokeWidth="0.9"
                strokeDasharray="3 3"
              />
            )}
          </g>
        );
      }

      case 'split-face':
      case 'split-face-corner':
      case 'split-face-half':
      case 'split-face-u':
      case 'split-face-pillar': {
        const isHalf = shapeVariant === 'split-face-half';
        const isPillar = shapeVariant === 'split-face-pillar';
        const x1 = isHalf || isPillar ? 74 : 48;
        const x2 = isHalf || isPillar ? 186 : 212;
        return (
          <g>
            <polygon
              points={`${x1},72 130,46 ${x2},74 130,100`}
              fill={fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Textured rough front left face */}
            <polygon
              points={`${x1},72 130,100 130,148 ${x1},120`}
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Split-face texture lines */}
            <polyline
              points={`${x1 + 10},86 ${x1 + 26},94 ${x1 + 40},96 ${x1 + 52},106`}
              fill="none"
              stroke={strokeMuted}
              strokeWidth="1"
            />
            <polyline
              points={`${x1 + 14},104 ${x1 + 32},110 ${x1 + 48},120`}
              fill="none"
              stroke={strokeMuted}
              strokeWidth="1"
            />
            <polygon
              points={`130,100 ${x2},74 ${x2},122 130,148`}
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {shapeVariant === 'split-face-corner' && (
              <polyline
                points="146,108 168,98 188,92"
                fill="none"
                stroke={strokeMuted}
                strokeWidth="1"
              />
            )}
          </g>
        );
      }

      case 'column-square': {
        return (
          <g>
            {/* Tall vertical column block */}
            <polygon
              points="86,58 130,40 174,58 130,76"
              fill={fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="106,58 130,48 154,58 130,68"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="86,58 130,76 130,152 86,134"
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="130,76 174,58 174,134 130,152"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        );
      }

      case 'paver-hex': {
        return (
          <g>
            <polygon
              points="96,62 164,62 192,94 164,126 96,126 68,94"
              fill={fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="68,94 96,126 96,144 68,112"
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="96,126 164,126 164,144 96,144"
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="164,126 192,94 192,112 164,144"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        );
      }

      case 'paver-unipaver': {
        return (
          <g>
            {/* Interlocking dogbone/zig-zag paver */}
            <polygon
              points="76,74 114,58 132,66 154,58 190,74 172,88 186,102 148,118 130,110 108,118 72,102 88,88"
              fill={fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="72,102 108,118 108,136 72,120"
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="108,118 130,110 148,118 148,136 130,128 108,136"
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="148,118 186,102 186,120 148,136"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        );
      }

      case 'paver-rect': {
        return (
          <g>
            <polygon
              points="64,84 130,58 196,84 130,110"
              fill={fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="64,84 130,110 130,136 64,110"
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="130,110 196,84 196,110 130,136"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        );
      }

      case 'tile-square':
      default: {
        return (
          <g>
            <polygon
              points="52,90 130,58 208,90 130,122"
              fill={fillLight}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="52,90 130,122 130,136 52,104"
              fill={fillMid}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="130,122 208,90 208,104 130,136"
              fill={fillDark}
              stroke={strokeMain}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <line
              x1="91"
              y1="74"
              x2="169"
              y2="106"
              stroke={strokeMuted}
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
          </g>
        );
      }
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#F5F4F0] p-2.5 sm:p-4 select-none">
      {/* Subtle architectural grid */}
      <svg
        viewBox="0 0 260 180"
        className="h-full w-full max-h-44 max-w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#252B30"
              strokeOpacity="0.05"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="260" height="180" fill={`url(#${patternId})`} />
        {renderShape()}
      </svg>

      {showCodeLabel && code && (
        <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-wider text-[#69737A] absolute bottom-2 right-2.5 sm:bottom-2.5 sm:right-3 tabular-nums">
          {code}
        </span>
      )}
    </div>
  );
}

export function ProductVisual({
  code,
  name,
  imageUrl,
  shapeVariant,
  className = '',
  showCodeWatermark = true,
}: ProductVisualProps) {
  const [hasError, setHasError] = useState(false);

  if (imageUrl && !hasError) {
    return (
      <div className={`relative overflow-hidden bg-[#F5F4F0] ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F5F4F0] ${className}`}>
      <ArchitecturalDiagram
        shapeVariant={shapeVariant}
        code={code}
        showCodeLabel={showCodeWatermark}
      />
    </div>
  );
}
