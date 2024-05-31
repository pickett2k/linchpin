import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Button, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import PPMDetailsTab from './ppmdetailsTab';
import InstructionsTab from './instructionstab';
import AssetsTab from './assetsTab';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const PPMDetail = () => {
  const { ppm_id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabIndex, setTabIndex] = useState(0);
  const [disciplineId, setDisciplineId] = useState(null);
  const [buildingId, setBuildingId] = useState(null);

  const handleSetDisciplineAndBuilding = useCallback((discId, bldId) => {
    console.log('Setting disciplineId and buildingId:', discId, bldId);
    setDisciplineId(discId);
    setBuildingId(bldId);
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>PPM Detail</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/ppmdata')}>
          Return to Service Plans
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: '8px' }}>
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => setTabIndex(newValue)}
          aria-label="asset detail tabs"
          TabIndicatorProps={{
            sx: { backgroundColor: colors.greenAccent[400] },
          }}
          sx={{
            '& .MuiTab-root': {
              color: colors.grey[100],
            },
            '& .Mui-selected': {
              color: `${colors.greenAccent[400]} !important`,  // Ensure the selected tab text is green
            },
            '& .MuiTabs-flexContainer': {
              borderBottom: `2px solid ${colors.greenAccent[400]}`,  // Add border to the bottom of the selected tab
            },
          }}
        >
          <Tab label="PPM Details" />
          <Tab label="Instructions" />
          <Tab label="Assets" />
        </Tabs>
      </Box>

      <TabPanel value={tabIndex} index={0}>
        <PPMDetailsTab ppm_id={ppm_id} setDisciplineAndBuilding={handleSetDisciplineAndBuilding} refetch={() => {}} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <InstructionsTab ppm_id={ppm_id} refetch={() => {}} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <AssetsTab ppm_id={ppm_id} disciplineId={disciplineId} buildingId={buildingId} refetch={() => {}} />
      </TabPanel>
    </Box>
  );
};

export default PPMDetail;








