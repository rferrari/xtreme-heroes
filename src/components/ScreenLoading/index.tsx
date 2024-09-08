// Loading Screen
export function LoadingScreen() {
    return (
      <div className="loading-container"
        style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1, color: "#fff", textAlign: "center", paddingTop: "20%" }}></div>
        <div style={{
          fontSize: "10rem", textAlign: "center",
          color: "green", fontFamily: "creepster",
          textShadow: "2px 2px 4px white"
        }}>
          Loading...</div>;
      </div>
    )
  };
