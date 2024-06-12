import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import AssetManagement from "./scenes/AssetManagement";
import AssetDetail from "./scenes/assetdetail";
import Calendar from "./scenes/ppmcalendar";
import PPMData from "./scenes/ppmdata";
import PPMDetail from "./scenes/ppmdetail";
import OrganizationSettings from "./scenes/orgsettings";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sidebarWidth = isSidebarCollapsed ? '80px' : '250px';

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <Box
            sx={{
              position: 'fixed',
              left: 0,
              top: 0,
              height: '100vh',
              width: sidebarWidth,
              transition: 'width 0.3s',
              zIndex: 1300,
              '@media (max-width: 768px)': {
                width: '80px',
              },
              '& .pro-sidebar-inner': {
                background: `${theme.palette.primary.main} !important`,
                height: '100vh',
              },
              '& .pro-icon-wrapper': {
                backgroundColor: 'transparent !important',
              },
              '& .pro-inner-item': {
                padding: '5px 35px 5px 20px !important',
              },
              '& .pro-inner-item:hover': {
                color: '#868dfb !important',
              },
              '& .pro-menu-item.active': {
                color: '#6870fa !important',
              },
            }}
          >
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            />
          </Box>
          <Box
            sx={{
              marginLeft: sidebarWidth,
              transition: 'margin-left 0.3s',
              flexGrow: 1,
              padding: 2,
              overflowY: 'auto',
              '@media (max-width: 768px)': {
                marginLeft: '80px',
              },
            }}
          >
            <Topbar setIsSidebar={setIsSidebarCollapsed} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/AssetManagement" element={<AssetManagement />} />
              <Route path="/assetdetail/:as_id" element={<AssetDetail />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/ppmdata" element={<PPMData />} />
              <Route path="/ppmdetail/:ppm_id" element={<PPMDetail />} />
              <Route path="/orgsettings" element={<OrganizationSettings />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;




