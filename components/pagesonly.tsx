const PagesOnly = ({ children }) => {
  return (
    <div style={{ border: "1px solid red", padding: "10px", margin: "10px" }}>
      <code>Pages Only</code> {children}
    </div>
  );
};

export default PagesOnly;
