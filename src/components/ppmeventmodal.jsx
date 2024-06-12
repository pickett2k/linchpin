import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, List, ListItem, ListItemText, Button, IconButton, TextField, useTheme, Snackbar } from '@mui/material';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CalendarToday as CalendarTodayIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { UPDATE_PPM_SCHEDULE_DATE } from '../api/mutations/ppmdata';
import { tokens } from "../theme";

const EventModal = ({ open, onClose, event, refetch }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [updatePPMScheduleDate] = useMutation(UPDATE_PPM_SCHEDULE_DATE);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (!open) {
      setIsEditingDate(false);
    }
  }, [open]);

  if (!event || !event.extendedProps) return null;

  // Debugging: Log the event object and its extendedProps
  console.log("Event:", event);
  console.log("ExtendedProps:", event.extendedProps);

  const initialValues = {
    ppm_b_schedule_date: event.extendedProps.ppm_b_schedule_date ? format(new Date(event.extendedProps.ppm_b_schedule_date), 'yyyy-MM-dd') : ''
  };

  const validationSchema = Yup.object().shape({
    ppm_b_schedule_date: Yup.date().required('Required')
  });

  const handleSaveDate = async (values) => {
    try {
      await updatePPMScheduleDate({
        variables: {
          ppm_bsp_key: event.extendedProps.ppm_bsp_key, // Ensure this is correctly passed
          ppm_b_schedule_date: values.ppm_b_schedule_date
        }
      });

      setSnackbarMessage('PPM schedule date updated successfully!');
      setSnackbarOpen(true);
      await refetch();  // Refetch data after saving
      onClose();  // Close the modal after saving
    } catch (error) {
      console.error("Error updating PPM schedule date:", error);
      setSnackbarMessage(`Error updating PPM schedule date: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleNavigateToPPMDetail = () => {
    navigate(`/ppmdetail/${event.extendedProps.ppm_fk_ppm_id}?disc_id=${event.extendedProps.fk_disc_id}&bld_id=${event.extendedProps.fk_bld_id}`);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: colors.primary[400], 
          border: `2px solid ${colors.primary[500]}`, 
          boxShadow: 24, 
          p: 4
        }}>
          <Typography id="modal-title" variant="h6" component="h2" color={colors.grey[100]}>
            {event.title}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography component="span" color={colors.grey[100]}>
              Schedule Date: {event.extendedProps?.ppm_b_schedule_date ? format(new Date(event.extendedProps.ppm_b_schedule_date), 'MMM dd, yyyy') : 'N/A'}
            </Typography>
            <IconButton onClick={() => setIsEditingDate(true)} color="primary">
              <CalendarTodayIcon />
            </IconButton>
          </Box>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSaveDate}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <Box display="flex" flexDirection="column" gap="16px">
                  {isEditingDate && (
                    <Field
                      as={TextField}
                      name="ppm_b_schedule_date"
                      type="date"
                      label="Schedule Date"
                      InputLabelProps={{ shrink: true }}
                      value={values.ppm_b_schedule_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.ppm_b_schedule_date && Boolean(errors.ppm_b_schedule_date)}
                      helperText={touched.ppm_b_schedule_date && errors.ppm_b_schedule_date}
                      fullWidth
                    />
                  )}
                  <Box component="span" color={colors.grey[100]}>Discipline: {event.extendedProps?.disc_name || "N/A"}</Box>
                  <Box component="span" color={colors.grey[100]}>Building: {event.extendedProps?.bld_name || "N/A"}</Box>
                  <Box component="span" color={colors.grey[100]}>Assets:</Box>
                  <List>
                    {event.extendedProps?.assets?.map((asset) => (
                      <ListItem key={asset.as_id}>
                        <ListItemText primary={asset.as_name} />
                      </ListItem>
                    ))}
                  </List>
                  <Button variant="contained" color="primary" onClick={handleNavigateToPPMDetail}>
                    Go to PPM Detail
                  </Button>
                  <Button variant="contained" color="secondary" onClick={onClose}>
                    Close
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default EventModal;











