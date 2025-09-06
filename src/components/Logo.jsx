export default function Logo({ size = "default", variant = "full" }) {
  const sizes = {
    small: { width: 120, height: 30, fontSize: 18 },
    default: { width: 160, height: 40, fontSize: 24 },
    large: { width: 200, height: 50, fontSize: 30 }
  };

  const currentSize = sizes[size] || sizes.default;

  // Icon only version
  if (variant === "icon") {
    return (
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House shape with H */}
        <path 
          d="M20 5L35 18V35H5V18L20 5Z" 
          fill="#2563eb"
        />
        <path 
          d="M20 8L32 19V32H8V19L20 8Z" 
          fill="white"
        />
        <path 
          d="M15 15V25M25 15V25M15 20H25" 
          stroke="#2563eb" 
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Roof accent */}
        <path 
          d="M20 5L35 18L33 20L20 9L7 20L5 18L20 5Z" 
          fill="#1e40af"
        />
      </svg>
    );
  }

  // Full logo with text
  return (
    <svg 
      width={currentSize.width} 
      height={currentSize.height} 
      viewBox={`0 0 ${currentSize.width} ${currentSize.height}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon part */}
      <g>
        {/* House shape */}
        <path 
          d={`M20 ${currentSize.height * 0.2}L32 ${currentSize.height * 0.45}V${currentSize.height * 0.85}H8V${currentSize.height * 0.45}L20 ${currentSize.height * 0.2}Z`}
          fill="#2563eb"
        />
        <path 
          d={`M20 ${currentSize.height * 0.3}L28 ${currentSize.height * 0.5}V${currentSize.height * 0.75}H12V${currentSize.height * 0.5}L20 ${currentSize.height * 0.3}Z`}
          fill="white"
        />
        {/* H letter inside house */}
        <path 
          d={`M16 ${currentSize.height * 0.45}V${currentSize.height * 0.65}M24 ${currentSize.height * 0.45}V${currentSize.height * 0.65}M16 ${currentSize.height * 0.55}H24`}
          stroke="#2563eb" 
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Roof */}
        <path 
          d={`M20 ${currentSize.height * 0.2}L32 ${currentSize.height * 0.45}L30 ${currentSize.height * 0.5}L20 ${currentSize.height * 0.35}L10 ${currentSize.height * 0.5}L8 ${currentSize.height * 0.45}L20 ${currentSize.height * 0.2}Z`}
          fill="#1e40af"
        />
      </g>
      
      {/* Text part */}
      <text 
        x="40" 
        y={currentSize.height * 0.65}
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize={currentSize.fontSize}
        fontWeight="bold"
        fill="#1e40af"
      >
        Houseiana
      </text>
      
      {/* Tagline for large version */}
      {size === "large" && (
        <text 
          x="40" 
          y={currentSize.height * 0.85}
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="10"
          fill="#6b7280"
        >
          Monthly Rentals in Qatar
        </text>
      )}
    </svg>
  );
}