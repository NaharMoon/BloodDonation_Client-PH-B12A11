import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4b0026] via-[#8b0a3a] to-[#c2185b]">
      <Outlet />
    </div>
  );
}

export default App;
