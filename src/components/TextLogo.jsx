export default function TextLogo({ size = "default" }) {
  const styles = {
    small: {
      fontSize: '20px',
      iconSize: '24px'
    },
    default: {
      fontSize: '24px',
      iconSize: '28px'
    },
    large: {
      fontSize: '32px',
      iconSize: '36px'
    }
  };

  const currentStyle = styles[size] || styles.default;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* House icon */}
      <div style={{
        width: currentStyle.iconSize,
        height: currentStyle.iconSize,
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        position: 'relative'
      }}>
        <span style={{
          position: 'relative',
          top: '-1px'
        }}>H</span>
        <div style={{
          position: 'absolute',
          top: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: `${parseInt(currentStyle.iconSize)/2}px solid transparent`,
          borderRight: `${parseInt(currentStyle.iconSize)/2}px solid transparent`,
          borderBottom: `8px solid #2563eb`
        }}></div>
      </div>
      
      {/* Text */}
      <span style={{
        fontSize: currentStyle.fontSize,
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Houseiana
      </span>
    </div>
  );
}