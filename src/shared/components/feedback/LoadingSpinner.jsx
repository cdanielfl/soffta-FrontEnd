const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: '20px',
    md: '40px',
    lg: '60px'
  };

  return (
    <div style={{
      display: 'inline-block',
      width: sizes[size],
      height: sizes[size],
      border: '4px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '50%',
      borderTopColor: '#6366f1',
      animation: 'spin 0.8s linear infinite'
    }} />
  );
};

export default LoadingSpinner;
