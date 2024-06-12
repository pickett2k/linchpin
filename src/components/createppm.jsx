import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel, Grid, FormControlLabel, Checkbox, IconButton, Box, Typography
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  CREATE_PPM_SERVICE_PLAN, CREATE_PPM_BUILDING_RELATIONSHIP, INSERT_INSTRUCTION
} from '../api/mutations/ppmdata';
import {
  GET_PPM_DISCIPLINES, GET_BUILDINGS, GET_SUPPLIERS, GET_ORGANIZATIONS
} from '../api/queries/ppmdata';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme";

const CreatePPMServicePlan = ({ open, onClose, onCreate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading: loadingDisciplines, error: errorDisciplines, data: dataDisciplines } = useQuery(GET_PPM_DISCIPLINES);
  const { loading: loadingBuildings, error: errorBuildings, data: dataBuildings } = useQuery(GET_BUILDINGS);
  const { loading: loadingSuppliers, error: errorSuppliers, data: dataSuppliers } = useQuery(GET_SUPPLIERS);
  const { loading: loadingOrganizations, error: errorOrganizations, data: dataOrganizations } = useQuery(GET_ORGANIZATIONS);

  const [createPPMServicePlan] = useMutation(CREATE_PPM_SERVICE_PLAN);
  const [linkServicePlanToBuilding] = useMutation(CREATE_PPM_BUILDING_RELATIONSHIP);
  const [insertInstruction] = useMutation(INSERT_INSTRUCTION);

  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [instructions, setInstructions] = useState([]);

  const handleOrganizationChange = (event) => {
    setSelectedOrganization(event.target.value);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const handleDeleteInstruction = (index) => {
    const updatedInstructions = [...instructions];
    updatedInstructions.splice(index, 1);
    setInstructions(updatedInstructions);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Submitting values:", values);

      // Ensure date fields are not empty strings
      const lastServiceDate = values.last_service_date || null;

      // Create PPM Service Plan
      const { data } = await createPPMServicePlan({
        variables: {
          fields: {
            ppm_standard: values.ppm_standard,
            ppm_status: values.ppm_status,
            ppm_type: values.ppm_type,
            last_service_date: lastServiceDate,
            fk_disc_id: values.fk_disc_id,
            fk_sup_id: values.fk_sup_id,
            notes: values.notes,
            ppm_description: values.ppm_description,
            ppm_frequency: values.ppm_frequency,
            ppm_service_name: values.ppm_service_name,
            compliance_ppm: values.compliance_ppm
          }
        }
      });

      console.log("PPM Service Plan created:", data);

      if (!data.insert_ppm_service_plan_one) {
        throw new Error("Failed to create PPM Service Plan");
      }

      const ppmId = data.insert_ppm_service_plan_one.ppm_id;

      // Link Service Plan to Buildings with Cost
      const linkPromises = values.buildings.map(buildingId =>
        linkServicePlanToBuilding({
          variables: {
            ppm_id: ppmId,
            building_id: buildingId,
            ppm_cost: parseInt(values.ppm_cost, 10),  // Ensure cost is an integer
            supplier_id: values.fk_sup_id
          }
        })
      );

      await Promise.all(linkPromises);

      console.log("PPM Service Plan linked to buildings");

      // Insert Instructions
      const instructionPromises = instructions.map(instruction =>
        insertInstruction({
          variables: {
            ppm_id: ppmId,
            instruction: instruction
          }
        })
      );

      await Promise.all(instructionPromises);

      console.log("Instructions inserted");

      setSubmitting(false);
      onCreate();  // Call the callback function to refresh the data
      onClose();
    } catch (error) {
      console.error("Error creating PPM Service Plan", error);
      if (error.networkError) {
        console.error("Network Error:", error.networkError);
      }
      if (error.graphQLErrors) {
        console.error("GraphQL Errors:", error.graphQLErrors);
      }
      setSubmitting(false);
    }
  };

  if (loadingDisciplines || loadingBuildings || loadingSuppliers || loadingOrganizations) return <p>Loading...</p>;
  if (errorDisciplines || errorBuildings || errorSuppliers || errorOrganizations) return <p>Error: {errorDisciplines?.message || errorBuildings?.message || errorSuppliers?.message || errorOrganizations?.message}</p>;

  const filteredBuildings = dataBuildings.buildings.filter(building => building.fk_org_id === selectedOrganization);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create PPM Service Plan</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            ppm_standard: '',
            ppm_status: '',
            ppm_type: '',
            last_service_date: '',
            fk_disc_id: '',
            fk_sup_id: '',
            ppm_cost: '',
            notes: '',
            ppm_description: '',
            ppm_frequency: '',
            ppm_service_name: '',
            compliance_ppm: false,
            buildings: []
          }}
          validationSchema={Yup.object({
            ppm_standard: Yup.string().required('Required'),
            ppm_status: Yup.string().required('Required'),
            ppm_type: Yup.string().required('Required'),
            last_service_date: Yup.date().required('Required'),
            fk_disc_id: Yup.number().required('Required'),
            fk_sup_id: Yup.number().required('Required'),
            ppm_cost: Yup.number().required('Required'),
            notes: Yup.string().required('Required'),
            ppm_description: Yup.string().required('Required'),
            ppm_frequency: Yup.string().required('Required'),
            ppm_service_name: Yup.string().required('Required'),
            buildings: Yup.array().of(Yup.number()).required('Required'),
            compliance_ppm: Yup.boolean().required('Required')
          })}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="organization-label">Organization</InputLabel>
                    <Select
                      labelId="organization-label"
                      name="organization"
                      value={selectedOrganization}
                      onChange={handleOrganizationChange}
                      onBlur={handleBlur}
                    >
                      {dataOrganizations.organizations.map((org) => (
                        <MenuItem key={org.pk_org_id} value={org.pk_org_id}>
                          {org.org_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="discipline-label">Discipline</InputLabel>
                    <Select
                      labelId="discipline-label"
                      name="fk_disc_id"
                      value={values.fk_disc_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.fk_disc_id && Boolean(errors.fk_disc_id)}
                    >
                      {dataDisciplines.ppm_discipline.map((disc) => (
                        <MenuItem key={disc.disc_id} value={disc.disc_id}>
                          {disc.disc_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.fk_disc_id && errors.fk_disc_id && (
                      <div style={{ color: theme.palette.error.main, marginTop: '5px' }}>{errors.fk_disc_id}</div>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="buildings-label">Buildings</InputLabel>
                    <Select
                      labelId="buildings-label"
                      multiple
                      name="buildings"
                      value={values.buildings}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {filteredBuildings.map((bld) => (
                        <MenuItem key={bld.pk_bld_id} value={bld.pk_bld_id}>
                          {bld.bld_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.buildings && errors.buildings && (
                      <div style={{ color: theme.palette.error.main, marginTop: '5px' }}>{errors.buildings}</div>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="supplier-label">Supplier</InputLabel>
                    <Select
                      labelId="supplier-label"
                      name="fk_sup_id"
                      value={values.fk_sup_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.fk_sup_id && Boolean(errors.fk_sup_id)}
                    >
                      {dataSuppliers.suppliers.map((sup) => (
                        <MenuItem key={sup.sup_id} value={sup.sup_id}>
                          {sup.sup_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.fk_sup_id && errors.fk_sup_id && (
                      <div style={{ color: theme.palette.error.main, marginTop: '5px' }}>{errors.fk_sup_id}</div>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="ppm_service_name"
                    label="PPM Service Name"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ppm_service_name}
                    error={touched.ppm_service_name && Boolean(errors.ppm_service_name)}
                    helperText={touched.ppm_service_name && errors.ppm_service_name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="ppm_frequency"
                    label="PPM Frequency"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ppm_frequency}
                    error={touched.ppm_frequency && Boolean(errors.ppm_frequency)}
                    helperText={touched.ppm_frequency && errors.ppm_frequency}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="ppm_cost"
                    label="PPM Cost"
                    type="number"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ppm_cost}
                    error={touched.ppm_cost && Boolean(errors.ppm_cost)}
                    helperText={touched.ppm_cost && errors.ppm_cost}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="ppm_description"
                    label="PPM Description"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ppm_description}
                    error={touched.ppm_description && Boolean(errors.ppm_description)}
                    helperText={touched.ppm_description && errors.ppm_description}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="ppm_standard"
                    label="PPM Standard"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ppm_standard}
                    error={touched.ppm_standard && Boolean(errors.ppm_standard)}
                    helperText={touched.ppm_standard && errors.ppm_standard}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="ppm_status"
                    label="PPM Status"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ppm_status}
                    error={touched.ppm_status && Boolean(errors.ppm_status)}
                    helperText={touched.ppm_status && errors.ppm_status}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="ppm_type"
                    label="PPM Type"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ppm_type}
                    error={touched.ppm_type && Boolean(errors.ppm_type)}
                    helperText={touched.ppm_type && errors.ppm_type}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="notes"
                    label="Notes"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.notes}
                    error={touched.notes && Boolean(errors.notes)}
                    helperText={touched.notes && errors.notes}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="last_service_date"
                    label="Last Service Date"
                    type="date"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.last_service_date}
                    error={touched.last_service_date && Boolean(errors.last_service_date)}
                    helperText={touched.last_service_date && errors.last_service_date}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="compliance_ppm"
                        checked={values.compliance_ppm}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        color="primary"
                      />
                    }
                    label="Compliance PPM"
                  />
                  {touched.compliance_ppm && errors.compliance_ppm && (
                    <div style={{ color: theme.palette.error.main, marginTop: '5px' }}>{errors.compliance_ppm}</div>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Instructions
                  </Typography>
                  {instructions.map((instruction, index) => (
                    <Grid container spacing={2} key={index} alignItems="center">
                      <Grid item xs={11}>
                        <TextField
                          label="Instruction"
                          fullWidth
                          margin="dense"
                          value={instruction}
                          onChange={(e) => handleInstructionChange(index, e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton onClick={() => handleDeleteInstruction(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={handleAddInstruction} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  Create
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePPMServicePlan;






