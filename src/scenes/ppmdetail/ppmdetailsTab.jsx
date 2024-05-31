import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Snackbar } from '@mui/material';
import { Formik, Form } from 'formik';
import { GET_PPM_BY_PK, GET_SUPPLIERS, GET_DISCIPLINES } from "../../api/queries/ppmdetail";
import { UPDATE_PPM } from "../../api/mutations/ppmdetail";

const PPMDetailsTab = ({ ppm_id, setDisciplineAndBuilding, refetch }) => {
  const { loading, data } = useQuery(GET_PPM_BY_PK, { variables: { ppm_id: parseInt(ppm_id) } });
  const [updatePPM] = useMutation(UPDATE_PPM);

  const { data: suppliersData, loading: suppliersLoading } = useQuery(GET_SUPPLIERS);
  const { data: disciplinesData, loading: disciplinesLoading } = useQuery(GET_DISCIPLINES);

  const [editMode, setEditMode] = useState(false);
  const [ppmDetails, setPPMDetails] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (data) {
      setPPMDetails(data.ppm_service_plan_by_pk);
      setDisciplineAndBuilding(data.ppm_service_plan_by_pk.fk_disc_id, data.ppm_service_plan_by_pk.fk_bld_id);
    }
  }, [data, setDisciplineAndBuilding]);

  const handleSavePPM = async (values) => {
    try {
      console.log('Saving PPM Details with values:', values);
      await updatePPM({
        variables: {
          ppm_id: parseInt(ppm_id),
          compliance_ppm: values.compliance_ppm,
          compliance_ppm_expiry: values.compliance_ppm_expiry,
          fk_sup_id: values.fk_sup_id,
          last_service_date: values.last_service_date,
          next_service_date: values.next_service_date,
          notes: values.notes,
          ppm_archive: values.ppm_archive,
          ppm_cost: values.ppm_cost,
          ppm_created_date: values.ppm_created_date,
          ppm_description: values.ppm_description,
          ppm_frequency: values.ppm_frequency,
          ppm_key: values.ppm_key,
          ppm_schedule: values.ppm_schedule,
          ppm_service_name: values.ppm_service_name,
          ppm_standard: values.ppm_standard,
          ppm_status: values.ppm_status,
          ppm_type: values.ppm_type
        }
      });
      refetch();
      setSnackbarMessage('PPM details updated successfully!');
      setSnackbarOpen(true);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating PPM:", error);
      setSnackbarMessage(`Error updating PPM: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setPPMDetails(data.ppm_service_plan_by_pk); // Reset to original values
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  if (loading || suppliersLoading || disciplinesLoading) return <p>Loading...</p>;

  return (
    <>
      <Formik
        initialValues={ppmDetails}
        enableReinitialize
        onSubmit={handleSavePPM}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="16px">
              <TextField name="ppm_standard" label="PPM Standard" value={values.ppm_standard || ''} onChange={handleChange} disabled={!editMode} />
              <TextField name="ppm_status" label="Status" value={values.ppm_status || ''} onChange={handleChange} disabled={!editMode} />
              <TextField name="ppm_type" label="Type" value={values.ppm_type || ''} onChange={handleChange} disabled={!editMode} />
              <TextField name="last_service_date" type="date" label="Last Service Date" value={values.last_service_date || ''} onChange={handleChange} disabled={!editMode} InputLabelProps={{ shrink: true }} />
              <TextField name="next_service_date" type="date" label="Next Service Date" value={values.next_service_date || ''} onChange={handleChange} disabled={!editMode} InputLabelProps={{ shrink: true }} />
              <TextField name="ppm_schedule" type="date" label="Schedule" value={values.ppm_schedule || ''} onChange={handleChange} disabled={!editMode} InputLabelProps={{ shrink: true }} />
              <TextField name="ppm_cost" type="number" label="Cost" value={values.ppm_cost || ''} onChange={handleChange} disabled={!editMode} />
              <TextField name="notes" label="Notes" value={values.notes || ''} onChange={handleChange} disabled={!editMode} />
              <TextField name="ppm_description" label="Description" value={values.ppm_description || ''} onChange={handleChange} disabled={!editMode} />
              <TextField name="ppm_frequency" label="Frequency" value={values.ppm_frequency || ''} onChange={handleChange} disabled={!editMode} />
              <TextField name="ppm_service_name" label="Service Name" value={values.ppm_service_name || ''} onChange={handleChange} disabled={!editMode} />
              <TextField name="ppm_archive" type="date" label="PPM Archive" value={values.ppm_archive || ''} onChange={handleChange} disabled={!editMode} InputLabelProps={{ shrink: true }} />

              {editMode ? (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Supplier</InputLabel>
                    <Select name="fk_sup_id" value={values.fk_sup_id} onChange={handleChange}>
                      {suppliersData?.suppliers.map((supplier) => (
                        <MenuItem key={supplier.sup_id} value={supplier.sup_id}>
                          {supplier.sup_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Discipline</InputLabel>
                    <Select name="fk_disc_id" value={values.fk_disc_id} onChange={handleChange}>
                      {disciplinesData?.ppm_discipline.map((discipline) => (
                        <MenuItem key={discipline.disc_id} value={discipline.disc_id}>
                          {discipline.disc_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <TextField label="Supplier" value={data?.ppm_service_plan_by_pk?.supplier?.sup_name || ''} disabled />
                  <TextField label="Discipline" value={data?.ppm_service_plan_by_pk?.ppm_discipline?.disc_name || ''} disabled />
                </>
              )}

              <Box display="flex" justifyContent="flex-end" gap="16px">
                {editMode ? (
                  <>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="contained" color="secondary" type="submit">
                      Save PPM Details
                    </Button>
                  </>
                ) : (
                  <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}
              </Box>
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
    </>
  );
};

export default PPMDetailsTab;




