import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Select, MenuItem, Button, List, ListItem, ListItemText, IconButton, FormControl, InputLabel, Snackbar, useTheme } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { GET_LINKED_ASSETS, GET_ASSETS_BY_DISCIPLINE_AND_BUILDING } from "../../api/queries/ppmdetail";
import { ADD_ASSET_TO_PPM, DELETE_ASSET_FROM_PPM } from "../../api/mutations/ppmdetail";
import { tokens } from '../../theme';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
    '&:before, &:after': {
      borderColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  },
  '& .MuiSelect-select': {
    borderColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
  },
}));

const AssetsTab = ({ ppm_id, refetch }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bld_id = queryParams.get('bld_id');
  const disc_id = queryParams.get('disc_id');

  const { data: linkedAssetsData, loading: linkedAssetsLoading = true, error: linkedAssetsError, refetch: refetchLinkedAssets } = useQuery(GET_LINKED_ASSETS, {
    variables: { ppm_id: parseInt(ppm_id), bld_id: parseInt(bld_id) },
  });

  const { data: availableAssetsData, loading: availableAssetsLoading = true, error: availableAssetsError, refetch: refetchAvailableAssets } = useQuery(GET_ASSETS_BY_DISCIPLINE_AND_BUILDING, {
    skip: !disc_id || !bld_id,
    variables: { fk_disc_id: parseInt(disc_id), bld_id: parseInt(bld_id) },
  });

  const [addAssetToPPM] = useMutation(ADD_ASSET_TO_PPM, {
    onError: (error) => {
      setSnackbarMessage(`Error adding asset: ${error.message}`);
      setSnackbarOpen(true);
    },
    onCompleted: () => {
      refetchLinkedAssets();
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
      refetchAvailableAssets();
      setSnackbarMessage('Asset deleted successfully!');
      setSnackbarOpen(true);
      setEditMode(false); // Exit edit mode after deleting an asset
    }
  });

  const [linkedAssets, setLinkedAssets] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('');

  useEffect(() => {
    if (!linkedAssetsLoading && !availableAssetsLoading && linkedAssetsData && linkedAssetsData.ppm_asset_service_plan && availableAssetsData && availableAssetsData.vw_asset_bld_org) {
      const linked = linkedAssetsData.ppm_asset_service_plan.map(a => a.asset);

      const available = availableAssetsData.vw_asset_bld_org.filter(a =>
        !linked.find(la => la.as_id === a.as_id)
      );

      setLinkedAssets(linked);
      setAvailableAssets(available);
    }
  }, [linkedAssetsData, availableAssetsData, linkedAssetsLoading, availableAssetsLoading]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRemoveAsset = (as_id) => {
    deleteAssetFromPPM({ variables: { fk_as_id: as_id, ppm_fk_ppm_id: parseInt(ppm_id) } });
  };

  if (linkedAssetsLoading || availableAssetsLoading) return <Typography>Loading...</Typography>;
  if (linkedAssetsError || availableAssetsError) return <Typography>Error loading data</Typography>;

  return (
    <Box>
      <Typography variant="h6">Linked Assets</Typography>
      <List>
        {linkedAssets.map((asset) => (
          <ListItem key={asset.as_id}>
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
          initialValues={{ assetsToAdd: [], selectedAssetId: '' }}
          validationSchema={Yup.object().shape({
            assetsToAdd: Yup.array().min(1, 'Select at least one asset').required('Required'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              for (const asset of values.assetsToAdd) {
                await addAssetToPPM({ variables: { fk_as_id: asset.as_id, ppm_fk_ppm_id: parseInt(ppm_id) } });
              }
              setSubmitting(false);
              refetchLinkedAssets();  // Refetch the linked assets
              setEditMode(false);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <List>
                {values.assetsToAdd.map((asset, index) => (
                  <ListItem key={asset.as_id}>
                    <ListItemText primary={asset.as_name} />
                    <IconButton onClick={() => {
                      const newAssetsToAdd = values.assetsToAdd.filter((_, i) => i !== index);
                      setFieldValue('assetsToAdd', newAssetsToAdd);
                    }} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Box mt={2}>
                <StyledFormControl fullWidth>
                  <InputLabel style={{ color: colors.grey[100] }}>Assets</InputLabel>
                  <Select
                    style={{ border: colors.grey[100] }}
                    value={dropdownValue}
                    onChange={(event) => {
                      const selectedAssetId = event.target.value;
                      const selectedAsset = availableAssets.find(asset => asset.as_id === selectedAssetId);
                      if (selectedAsset) {
                        setFieldValue('assetsToAdd', [selectedAsset, ...values.assetsToAdd]);
                        setDropdownValue(''); // Reset dropdown value
                      }
                    }}
                  >
                    {availableAssets.map((asset) => (
                      <MenuItem key={asset.as_id} value={asset.as_id}>
                        {asset.as_name}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap="16px" mt={2}>
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




















