import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { GET_ASSET_DISCIPLINE, GET_PPM_DISCIPLINE_NAME, GET_REACT_DISCIPLINE_NAME, GET_PPM_SERVICE_PLANS, GET_PPM_DISCIPLINES, GET_REACT_DISCIPLINES } from '../../../api/queries/ppmServicePlans';
import { UPDATE_PPM_ASSET_DISCIPLINE, UPDATE_REACT_ASSET_DISCIPLINE, DELETE_PPM_SERVICE_PLANS } from '../../../api/mutations/ppmServicePlans';
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { useNavigate } from 'react-router-dom';

const PPMServicePlansTab = ({ as_id, parentRefetch }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const { data: assetData, loading: assetLoading, refetch: refetchAsset } = useQuery(GET_ASSET_DISCIPLINE, { variables: { as_id: parseInt(as_id) } });
  const [ppmDiscId, setPPMDiscId] = useState(null);
  const [reactDiscId, setReactDiscId] = useState(null);
  const [buildingId, setBuildingId] = useState(null);

  useEffect(() => {
    if (assetData) {
      setPPMDiscId(assetData.asset_by_pk.fk_disc_id);
      setReactDiscId(assetData.asset_by_pk.fk_r_disc_id);
      setBuildingId(assetData.asset_by_pk.fk_loc_id);
    }
  }, [assetData]);

  const { data: ppmDisciplineData, loading: ppmDisciplineLoading } = useQuery(GET_PPM_DISCIPLINE_NAME, {
    variables: { disc_id: ppmDiscId },
    skip: !ppmDiscId,
  });

  const { data: reactDisciplineData, loading: reactDisciplineLoading, refetch: refetchReactDiscipline } = useQuery(GET_REACT_DISCIPLINE_NAME, {
    variables: { disc_id: reactDiscId },
    skip: !reactDiscId,
  });

  const { data: servicePlansData, loading: servicePlansLoading, refetch: refetchServicePlans } = useQuery(GET_PPM_SERVICE_PLANS, { variables: { as_id: parseInt(as_id) } });

  const { data: allPPMDisciplinesData, loading: allPPMDisciplinesLoading } = useQuery(GET_PPM_DISCIPLINES);
  const { data: allReactDisciplinesData, loading: allReactDisciplinesLoading } = useQuery(GET_REACT_DISCIPLINES);

  const [updatePPMDiscipline] = useMutation(UPDATE_PPM_ASSET_DISCIPLINE);
  const [updateReactDiscipline] = useMutation(UPDATE_REACT_ASSET_DISCIPLINE);
  const [deleteServicePlans] = useMutation(DELETE_PPM_SERVICE_PLANS);

  const [editMode, setEditMode] = useState(false);
  const [selectedPPMDiscipline, setSelectedPPMDiscipline] = useState(ppmDiscId);
  const [selectedReactDiscipline, setSelectedReactDiscipline] = useState(reactDiscId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    setSelectedPPMDiscipline(ppmDiscId);
  }, [ppmDiscId]);

  useEffect(() => {
    setSelectedReactDiscipline(reactDiscId);
  }, [reactDiscId]);

  const handleSave = async () => {
    if (selectedPPMDiscipline !== ppmDiscId) {
      setDialogOpen(true);
    } else {
      try {
        await updateReactDiscipline({
          variables: {
            as_id: parseInt(as_id),
            fk_r_disc_id: selectedReactDiscipline,
          },
        });
        setSnackbarMessage('Reactive discipline updated successfully!');
        setSnackbarOpen(true);
        setEditMode(false);
        refetchAsset();
        refetchReactDiscipline();
        if (typeof parentRefetch === 'function') {
          parentRefetch();
        }
      } catch (error) {
        console.error("Error updating reactive discipline:", error);
        setSnackbarMessage(`Error updating reactive discipline: ${error.message}`);
        setSnackbarOpen(true);
      }
    }
  };

  const handleConfirmSave = async () => {
    try {
      if (selectedPPMDiscipline !== ppmDiscId) {
        await deleteServicePlans({ variables: { as_id: parseInt(as_id) } });
        await updatePPMDiscipline({
          variables: {
            as_id: parseInt(as_id),
            fk_disc_id: selectedPPMDiscipline,
          },
        });
      }
      await updateReactDiscipline({
        variables: {
          as_id: parseInt(as_id),
          fk_r_disc_id: selectedReactDiscipline,
        },
      });
      setSnackbarMessage('Disciplines updated successfully!');
      setSnackbarOpen(true);
      setDialogOpen(false);
      setEditMode(false);
      refetchAsset();
      refetchReactDiscipline();
      refetchServicePlans();
      if (typeof parentRefetch === 'function') {
        parentRefetch();
      }
    } catch (error) {
      console.error("Error updating disciplines:", error);
      setSnackbarMessage(`Error updating disciplines: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedPPMDiscipline(ppmDiscId);
    setSelectedReactDiscipline(reactDiscId);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  const handleNavigateToPPMData = () => {
    navigate('/ppmdata', { state: { buildingId, ppmDiscId } });
  };

  if (assetLoading || ppmDisciplineLoading || reactDisciplineLoading || servicePlansLoading || allPPMDisciplinesLoading || allReactDisciplinesLoading) return <p>Loading...</p>;

  return (
    <Box p={2} bgcolor={colors.primary[400]}>
      <Typography variant="h5" gutterBottom>PPM Discipline</Typography>

      {editMode ? (
        <FormControl fullWidth margin="normal">
          <InputLabel>PPM Discipline</InputLabel>
          <Select
            name="fk_disc_id"
            value={selectedPPMDiscipline}
            onChange={(e) => setSelectedPPMDiscipline(e.target.value)}
          >
            {allPPMDisciplinesData?.ppm_discipline?.map((discipline) => (
              <MenuItem key={discipline.disc_id} value={discipline.disc_id}>
                {discipline.disc_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          label="PPM Discipline"
          value={ppmDisciplineData?.ppm_discipline_by_pk?.disc_name || 'N/A'}
          fullWidth
          margin="normal"
          disabled
        />
      )}

      <Typography variant="h5" gutterBottom>Reactive Discipline</Typography>

      {editMode ? (
        <FormControl fullWidth margin="normal">
          <InputLabel>React Discipline</InputLabel>
          <Select
            name="fk_r_disc_id"
            value={selectedReactDiscipline}
            onChange={(e) => setSelectedReactDiscipline(e.target.value)}
          >
            {allReactDisciplinesData?.react_discipline?.map((discipline) => (
              <MenuItem key={discipline.disc_id} value={discipline.disc_id}>
                {discipline.disc_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          label="React Discipline"
          value={reactDisciplineData?.react_discipline_by_pk?.disc_name || 'N/A'}
          fullWidth
          margin="normal"
          disabled
        />
      )}

      <Box mt={2}>
        <Typography variant="h5" gutterBottom>PPM Service Plans</Typography>
        {servicePlansData?.ppm_asset_service_plan?.map((plan, index) => (
          <Typography key={index} variant="body1" gutterBottom>
            {plan.ppm_service_plan.ppm_service_name}
          </Typography>
        ))}
        {servicePlansData?.ppm_asset_service_plan?.length === 0 && (
          <Box>
            <Typography variant="body1" p="4px 0 10px 0" style={{ color: colors.primary[200] }}>
              No Service Plans Available
            </Typography>
            <Button variant="contained" color="primary" onClick={handleNavigateToPPMData}>
              Review Service Plans
            </Button>
          </Box>
        )}
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        {editMode ? (
          <>
            <Button variant="contained" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSave} style={{ marginLeft: '10px' }}>
              Save
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Discipline Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Changing the PPM discipline will remove all linked service plans. Do you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSave} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default PPMServicePlansTab;

























