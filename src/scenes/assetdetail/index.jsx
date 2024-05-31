// src/scenes/assetdetail/index.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Button, useTheme } from '@mui/material';
import { useQuery } from '@apollo/client';
import { tokens } from "../../theme";
import AssetDetailsTab from './tabs/AssetDetailsTab';
import PPMServicePlansTab from './tabs/PPMServicePlansTab';
import { GET_ASSET_NAME_AND_LOC_ID_BY_ID, GET_ORG_AND_BUILDING_BY_LOC_ID } from "../../api/queries/assetmanagement";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const AssetDetail = () => {
  const { as_id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabIndex, setTabIndex] = useState(0);

  const { data: assetData, loading: assetLoading } = useQuery(GET_ASSET_NAME_AND_LOC_ID_BY_ID, { variables: { as_id: parseInt(as_id) } });
  const fk_loc_id = assetData?.asset_by_pk?.fk_loc_id;

  const { data: orgAndBuildingData, loading: orgAndBuildingLoading } = useQuery(GET_ORG_AND_BUILDING_BY_LOC_ID, {
    variables: { pk_loc_id: fk_loc_id },
    skip: !fk_loc_id,
  });

  if (assetLoading || orgAndBuildingLoading) return <p>Loading...</p>;

  const orgName = orgAndBuildingData?.locations_by_pk?.building?.organization?.org_name;
  const bldName = orgAndBuildingData?.locations_by_pk?.building?.bld_name;
  const asName = assetData?.asset_by_pk?.as_name;

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
          {orgName && bldName && asName && (
            <Typography variant="h4">
              <span style={{ color: colors.blueAccent[400], fontWeight: 'bold' }}>{orgName}</span> -{' '}
              <span style={{ fontWeight: 'bold' }}>{bldName}</span> -{' '}
              <span style={{ color: colors.grey[400] }}>{asName}</span>
            </Typography>
          )}
        </Box>
        <Button variant="contained" color="primary" onClick={() => navigate('/AssetManagement')}>
          Return to Assets
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
              color: colors.greenAccent[400] + ' !important',
            },
            '& .MuiTabs-flexContainer': {
              borderBottom: `2px solid ${colors.greenAccent[400]}`,
            },
          }}
        >
          <Tab label="Asset Details" />
          <Tab label="Service Plans" />
        </Tabs>
      </Box>

      <TabPanel value={tabIndex} index={0}>
        <AssetDetailsTab as_id={as_id} refetch={() => {}} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <PPMServicePlansTab as_id={as_id} />
      </TabPanel>
    </Box>
  );
};

export default AssetDetail;























