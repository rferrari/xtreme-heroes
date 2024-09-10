// Loading Screen
export function LoadingScreen() {
  return (
    <div className="loading-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        overflow: "hidden"
      }}>
      <div style={{
        fontSize: "10rem",
        color: "green",
        fontFamily: "creepster",
        textShadow: "2px 2px 4px white"
      }}>
        Loading...
      </div>
    </div>
  );
};
