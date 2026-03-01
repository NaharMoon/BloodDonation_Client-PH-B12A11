const GlassCard = ({ children }) => {
  return (
    <div className="bg-base-200/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-base-300/40">
      {children}
    </div>
  );
};

export default GlassCard;
