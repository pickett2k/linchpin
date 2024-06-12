import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { Formik, Form } from 'formik';
import { GET_ASSET_BY_PK, GET_CATEGORIES, GET_LOCATIONS } from "../../../api/queries/assetmanagement";
import { UPDATE_ASSET, TOGGLE_ARCHIVE_ASSET, VERIFY_ASSET } from "../../../api/mutations/assetmanagement";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";

const AssetDetailsTab = ({ as_id, refetch }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { loading, data, refetch: refetchAsset } = useQuery(GET_ASSET_BY_PK, { variables: { as_id: parseInt(as_id) } });
  const [updateAsset] = useMutation(UPDATE_ASSET);
  const [toggleArchivedAsset] = useMutation(TOGGLE_ARCHIVE_ASSET);
  const [verifyAsset] = useMutation(VERIFY_ASSET);

  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);
  const { data: locationsData, loading: locationsLoading } = useQuery(GET_LOCATIONS);

  const [editMode, setEditMode] = useState(false);
  const [assetDetails, setAssetDetails] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (data && locationsData) {
      setAssetDetails(data.asset_by_pk);
    }
  }, [data, locationsData]);

  const handleSaveAsset = async (values) => {
    // Filter out null values
    const filteredValues = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== null && value !== undefined));

    try {
      await updateAsset({
        variables: {
          as_id: parseInt(as_id),
          ...filteredValues,
        }
      });
      refetchAsset();
      setSnackbarMessage('Asset details updated successfully!');
      setSnackbarOpen(true);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating asset:", error);
      setSnackbarMessage(`Error updating asset: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setAssetDetails(data.asset_by_pk); // Reset to original values
  };

  const handleArchiveToggle = async () => {
    try {
      await toggleArchivedAsset({ variables: { as_id: parseInt(as_id), as_archived: !assetDetails.as_archived } });
      refetchAsset();
    } catch (error) {
      console.error("Error toggling archive status:", error);
      setSnackbarMessage(`Error toggling archive status: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleVerify = async () => {
    try {
      await verifyAsset({ variables: { as_id: parseInt(as_id) } });
      refetchAsset();
    } catch (error) {
      console.error("Error verifying asset:", error);
      setSnackbarMessage(`Error verifying asset: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  if (loading || categoriesLoading || locationsLoading) return <p>Loading...</p>;

  const getCategoryDisplayText = (category) => {
    if (!category) return '';
    return editMode
      ? `${category.as_type?.as_group?.as_group_name || ''} | ${category.as_type?.as_type_name || ''} | ${category.as_cat_name}`
      : category.as_cat_name;
  };

  return (
    <Box p={2}>
      <Typography variant="h4">Asset Details</Typography>
      <Typography
        variant="h5"
        p="0 0 10px 0"
        style={{ 
          color: assetDetails.as_status ? colors.greenAccent[500] : colors.redAccent[500],
          textAlign: 'right'
        }}
      >
        <Typography
        variant="h4"
        p="0 0 10px 0"
        style={{
          color: assetDetails.as_status ? colors.grey[200] : colors.grey[100],
          textAlign: 'right'
        }}
      >
        Asset Status </Typography>{assetDetails.as_status ? "Asset in Use" : "Asset Out of use"}
      </Typography>

      <Formik
        initialValues={assetDetails}
        enableReinitialize
        onSubmit={handleSaveAsset}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box flex={1} p={2} bgcolor={colors.primary[400]}>
                <Typography variant="h5" gutterBottom>Key Information</Typography>
                <TextField name="as_id" label="Asset ID" value={values.as_id || ''} onChange={handleChange} fullWidth margin="normal" disabled />
                <TextField name="as_name" label="Asset Name" value={values.as_name || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField name="as_manufacturer" label="Manufacturer" value={values.as_manufacturer || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField name="as_model_name" label="Model Type" value={values.as_model_name || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField name="as_serial_num" label="Serial Number" value={values.as_serial_num || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField name="as_manufacture_year" label="Manufacture Year" value={values.as_manufacture_year || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Location</InputLabel>
                  <Select name="fk_loc_id" value={values.fk_loc_id || ''} label="Location" onChange={handleChange} disabled={!editMode}>
                    {locationsData?.locations?.map((location) => (
                      <MenuItem key={location.pk_loc_id} value={location.pk_loc_id}>
                        {location.loc_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="test-label">Category</InputLabel>
                  <Select name="fk_as_cat_id" value={values.fk_as_cat_id || ''} label="Category" onChange={handleChange} disabled={!editMode}>
                    {categoriesData?.as_category?.map((category) => (
                      <MenuItem key={category.as_cat_id} value={category.as_cat_id}>
                        {getCategoryDisplayText(category)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={<Checkbox checked={values.as_business_critical || false} onChange={handleChange} name="as_business_critical" />}
                  label="Business Critical"
                  disabled={!editMode}
                />
                <FormControlLabel
                  control={<Checkbox checked={values.as_archived || false} onChange={handleChange} name="as_archived" />}
                  label="Archived"
                  disabled={!editMode}
                />
                <TextField name="as_parent_id" label="Parent ID" value={values.as_parent_id || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
              </Box>

              <Box flex={1} p={2} bgcolor={colors.primary[400]}>
                <Typography variant="h5" gutterBottom>Extra Information</Typography>
                <TextField name="as_created_date" label="Created Date" value={values.as_created_date || ''} fullWidth margin="normal" disabled />
                <TextField name="as_created_by" label="Created By" value={values.as_created_by || ''} fullWidth margin="normal" disabled />
                <TextField name="as_archived_date" label="Archived Date" value={values.as_archived_date || ''} fullWidth margin="normal" disabled />
                <TextField name="as_verified_date" label="Verified Date" value={values.as_verified_date || ''} fullWidth margin="normal" disabled />
                <TextField name="as_verified_by" label="Verified By" value={values.as_verified_by || ''} fullWidth margin="normal" disabled />
                <TextField name="as_modified_date" label="Modified Date" value={values.as_modified_date || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField name="as_modified_by" label="Modified By" value={values.as_modified_by || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <FormControlLabel
                  control={<Checkbox checked={values.as_verified_status || false} onChange={handleChange} name="as_verified_status" />}
                  label="Verified Status"
                  disabled={!editMode}
                />
              </Box>

              <Box flex={1} p={2} bgcolor={colors.primary[400]}>
                <Typography variant="h5" gutterBottom>Service Information</Typography>
                <TextField name="as_warranty_expiry" label="Warranty Expiry" value={values.as_warranty_expiry || ''} fullWidth margin="normal" disabled />
                <TextField name="as_warranty_length" label="Warranty Length" value={values.as_warranty_length || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField name="as_last_service_date" label="Last Service Date" value={values.as_last_service_date || ''} fullWidth margin="normal" disabled />
                <TextField name="as_next_service_date" label="Next Service Date" value={values.as_next_service_date || ''} fullWidth margin="normal" disabled />
                <TextField name="as_access_restrictions" label="Access Restrictions" value={values.as_access_restrictions || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField name="as_extra_info" label="Extra Info" value={values.as_extra_info || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
                <TextField name="as_standard" label="Standard" value={values.as_standard || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
              </Box>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              {editMode ? (
                <>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="secondary" type="submit" style={{ marginLeft: '10px' }}>
                    Save Asset Details
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleArchiveToggle}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: assetDetails.as_archived ? colors.redAccent[400] : colors.greenAccent[400],
                    }}
                  >
                    {assetDetails.as_archived ? 'Unarchive' : 'Archive'}
                  </Button>
                  {!assetDetails.as_verified_status && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleVerify}
                      style={{ marginLeft: '10px' }}
                    >
                      Verify Asset
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Form>
        )}
      </Formik>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AssetDetailsTab;









































