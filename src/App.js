import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import AssetManagement from "./scenes/AssetManagement";
import AssetDetail from "./scenes/assetdetail";
import Calendar from "./scenes/ppmcalendar";
import PPMData from "./scenes/ppmdata";
import PPMDetail from "./scenes/ppmdetail";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/AssetManagement" element={<AssetManagement />} />
              <Route path="/assetdetail/:as_id" element={<AssetDetail />} /> {/* Add the route for AssetDetail */}
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/ppmdata" element={<PPMData />} />
              <Route path="/ppmdetail/:ppm_id" element={<PPMDetail />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;