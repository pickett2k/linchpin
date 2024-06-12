import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Select, MenuItem, Button, List, ListItem, ListItemText, IconButton, FormControl, InputLabel, Snackbar } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { GET_ASSETS_OVERVIEW, GET_LINKED_ASSETS, GET_ASSETS_BY_DISCIPLINE_AND_BUILDING } from "../../api/queries/ppmdetail";
import { ADD_ASSET_TO_PPM, DELETE_ASSET_FROM_PPM } from "../../api/mutations/ppmdetail";

const AssetsTab = ({ ppm_id, refetch }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bld_id = queryParams.get('bld_id');
  const disc_id = queryParams.get('disc_id');

  const { data: assetsOverviewData, loading: assetsOverviewLoading, error: assetsOverviewError, refetch: refetchAssetsOverview } = useQuery(GET_ASSETS_OVERVIEW, {
    variables: { ppm_id: parseInt(ppm_id) },
  });

  const { data: linkedAssetsData, loading: linkedAssetsLoading, error: linkedAssetsError, refetch: refetchLinkedAssets } = useQuery(GET_LINKED_ASSETS, {
    variables: { ppm_id: parseInt(ppm_id) },
  });

  const { data: availableAssetsData, refetch: refetchAvailableAssets } = useQuery(GET_ASSETS_BY_DISCIPLINE_AND_BUILDING, {
    skip: !disc_id || !bld_id,
    variables: { fk_disc_id: parseInt(disc_id), fk_pk_bld_id: parseInt(bld_id) },
  });

  const [addAssetToPPM] = useMutation(ADD_ASSET_TO_PPM, {
    onError: (error) => {
      setSnackbarMessage(`Error adding asset: ${error.message}`);
      setSnackbarOpen(true);
    },
    onCompleted: () => {
      refetchLinkedAssets();
      refetchAssetsOverview();
      refetchAvailableAssets();
      setSnackbarMessage('Asset added successfully!');
      setSnackbarOpen(true);
    }
  });

  const [deleteAssetFromPPM] = useMutation(DELETE_ASSET_FROM_PPM, {
    onError: (error) => {
      setSnackbarMessage(`Error deleting asset: ${error.message}`);
      setSnackbarOpen(true);
    },
    onCompleted: () => {
      refetchLinkedAssets();
      refetchAssetsOverview();
      refetchAvailableAssets();
      setSnackbarMessage('Asset deleted successfully!');
      setSnackbarOpen(true);
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [linkedAssets, setLinkedAssets] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (linkedAssetsData && availableAssetsData) {
      const linked = linkedAssetsData.ppm_asset_service_plan
        .filter(l => l.asset.location?.fk_bld_id === parseInt(bld_id)) // Ensure linked assets are filtered by building ID
        .map(a => a.asset);
      const available = availableAssetsData.asset.filter(a =>
        !linked.find(la => la.as_id === a.as_id)
      );

      setLinkedAssets(linked);
      setAvailableAssets(available);
    }
  }, [linkedAssetsData, availableAssetsData, bld_id]);

  const handleAddAssets = async (values) => {
    try {
      for (const assetId of values.assetsToAdd) {
        await addAssetToPPM({ variables: { fk_as_id: assetId, ppm_fk_ppm_id: parseInt(ppm_id) } });
      }
      setEditMode(false);
    } catch (error) {
      console.error("Error adding assets:", error);
    }
  };

  const handleRemoveAsset = async (assetId) => {
    try {
      await deleteAssetFromPPM({ variables: { fk_as_id: assetId, ppm_fk_ppm_id: parseInt(ppm_id) } });
    } catch (error) {
      console.error("Error removing asset:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  const validationSchema = Yup.object().shape({
    assetsToAdd: Yup.array().of(Yup.number()).required('Select at least one asset to add.')
  });

  if (assetsOverviewLoading || linkedAssetsLoading) return <p>Loading...</p>;
  if (assetsOverviewError) return <p>Error loading assets overview: {assetsOverviewError.message}</p>;
  if (linkedAssetsError) return <p>Error loading linked assets: {linkedAssetsError.message}</p>;

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      <Typography variant="h6">Linked Assets</Typography>
      <List>
        {linkedAssets.map((asset, index) => (
          <ListItem key={index}>
            <ListItemText primary={asset.as_name} />
            {editMode && (
              <IconButton onClick={() => handleRemoveAsset(asset.as_id)} color="secondary">
                <DeleteIcon />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
      {editMode ? (
        <Formik
          initialValues={{ assetsToAdd: [] }}
          validationSchema={validationSchema}
          onSubmit={handleAddAssets}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <InputLabel>Assets</InputLabel>
                <Select
                  multiple
                  name="assetsToAdd"
                  value={values.assetsToAdd}
                  onChange={handleChange}
                  renderValue={(selected) => selected.map((id) => availableAssets.find(asset => asset.as_id === id)?.as_name).join(', ')}
                >
                  {availableAssets.map((asset) => (
                    <MenuItem key={asset.as_id} value={asset.as_id}>
                      {asset.as_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box display="flex" justifyContent="flex-end" gap="16px">
                <Button variant="contained" color="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button variant="contained" color="secondary" type="submit">
                  Save Assets
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      ) : (
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AssetsTab;





















