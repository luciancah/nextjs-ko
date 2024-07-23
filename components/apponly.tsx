const AppOnly = ({ children }) => {
  return (
    <div style={{ border: "1px solid red", padding: "10px", margin: "10px" }}>
      App Only
      {children}
    </div>
  );
};

export default AppOnly;
