import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, TextField, useTheme, Box, Typography
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  GET_GROUPS, GET_TYPES_BY_GROUP, GET_CATEGORIES_BY_TYPE, GET_ORGANIZATIONS,
  GET_BUILDINGS_BY_ORG, GET_LOCATIONS_BY_BUILDING, GET_PPM_DISCIPLINES, GET_REACT_DISCIPLINES
} from '../../src/api/queries/assetmanagement'; // Adjust the path as necessary
import { CREATE_ASSET } from '../api/mutations/assetmanagement'; // Adjust the path as necessary
import { tokens } from "../theme";

const AssetModal = ({ isOpen, onClose, refetchAssets }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading: loadingGroups, data: groupsData } = useQuery(GET_GROUPS);
  const [getTypes, { loading: loadingTypes, data: typesData }] = useLazyQuery(GET_TYPES_BY_GROUP);
  const [getCategories, { loading: loadingCategories, data: categoriesData }] = useLazyQuery(GET_CATEGORIES_BY_TYPE);
  const { loading: loadingOrgs, data: orgData } = useQuery(GET_ORGANIZATIONS);
  const [getBuildings, { loading: loadingBuildings, data: buildingData }] = useLazyQuery(GET_BUILDINGS_BY_ORG);
  const [getLocations, { loading: loadingLocations, data: locationsData }] = useLazyQuery(GET_LOCATIONS_BY_BUILDING);
  const { data: ppmDisciplinesData } = useQuery(GET_PPM_DISCIPLINES);
  const { data: reactDisciplinesData } = useQuery(GET_REACT_DISCIPLINES);
  const [createAsset, { loading: loadingCreate, error: createError }] = useMutation(CREATE_ASSET);

  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (selectedOrg) {
      getBuildings({ variables: { orgId: parseInt(selectedOrg) } });
    }
  }, [selectedOrg, getBuildings]);

  useEffect(() => {
    if (selectedBuilding) {
      getLocations({ variables: { bldId: parseInt(selectedBuilding) } });
    }
  }, [selectedBuilding, getLocations]);

  const handleOrgChange = (event) => {
    const orgId = event.target.value;
    setSelectedOrg(orgId);
    setSelectedBuilding('');
    setSelectedLocation('');
  };

  const handleBuildingChange = (event) => {
    const buildingId = event.target.value;
    setSelectedBuilding(buildingId);
    setSelectedLocation('');
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleGroupChange = (event) => {
    const groupId = event.target.value;
    setSelectedGroup(groupId);
    setSelectedType('');
    setSelectedCategory('');
    getTypes({ variables: { groupId: parseInt(groupId) } });
  };

  const handleTypeChange = (event) => {
    const typeId = event.target.value;
    setSelectedType(typeId);
    setSelectedCategory('');
    getCategories({ variables: { typeId: parseInt(typeId) } });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const initialValues = {
    as_name: '',
    as_manufacturer: '',
    as_manufacture_year: '',
    as_model_name: '',
    as_serial_num: '',
    as_expected_life: '',
    as_business_critical: '',
    as_warranty_length: '',
    as_warranty_expiry: '',
    as_status: '',
    as_extra_info: '',
    as_access_restrictions: '',
    as_last_service_date: '',
    as_parent_id: '',
    fk_loc_id: '',
    fk_disc_id: '',
    fk_r_disc_id: ''
  };

  const validationSchema = Yup.object().shape({
    as_name: Yup.string().required('Asset Name is required'),
    as_manufacturer: Yup.string().required('Manufacturer is required'),
    as_model_name: Yup.string().required('Model Name is required'),
    as_serial_num: Yup.string().required('Serial Number is required'),
    fk_loc_id: Yup.number().required('Location is required'),
    fk_disc_id: Yup.number().required('PPM Discipline is required'),
    fk_r_disc_id: Yup.number().required('Reactive Discipline is required')
  });

  const handleSubmit = async (values) => {
    const submitValues = {
      as_name: values.as_name,
      as_manufacturer: values.as_manufacturer,
      as_manufacture_year: values.as_manufacture_year || "",
      as_model_name: values.as_model_name,
      as_serial_num: values.as_serial_num,
      as_expected_life: values.as_expected_life || null,
      as_business_critical: values.as_business_critical || null,
      as_warranty_length: values.as_warranty_length || null,
      as_warranty_expiry: values.as_warranty_expiry || null,
      as_status: values.as_status || null,
      as_extra_info: values.as_extra_info || "",
      as_access_restrictions: values.as_access_restrictions || "",
      as_last_service_date: values.as_last_service_date || null,
      as_parent_id: values.as_parent_id || null,
      fk_loc_id: parseInt(values.fk_loc_id),
      fk_disc_id: parseInt(values.fk_disc_id),
      fk_r_disc_id: parseInt(values.fk_r_disc_id),
      fk_as_cat_id: selectedCategory ? parseInt(selectedCategory) : null
    };

    console.log("Submitting values:", submitValues);

    try {
      await createAsset({
        variables: submitValues
      });
      refetchAssets();
      onClose();
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create New Asset</DialogTitle>
      <DialogContent>
        <Box sx={{ backgroundColor: colors.grey[800], color: colors.grey[100], p: 3, borderRadius: 1 }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <FormControl fullWidth margin="normal" disabled={loadingOrgs}>
                  <InputLabel sx={{ color: colors.grey[100] }}>Organization</InputLabel>
                  <Select
                    value={selectedOrg}
                    onChange={handleOrgChange}
                    sx={{ color: colors.grey[100] }}
                  >
                    <MenuItem value="" disabled>Select an organization</MenuItem>
                    {orgData?.organizations.map((org) => (
                      <MenuItem key={org.pk_org_id} value={org.pk_org_id}>
                        {org.org_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingOrgs && <CircularProgress size={24} />}
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={loadingBuildings || !selectedOrg}>
                  <InputLabel sx={{ color: colors.grey[100] }}>Building</InputLabel>
                  <Select
                    value={selectedBuilding}
                    onChange={handleBuildingChange}
                    sx={{ color: colors.grey[100] }}
                  >
                    <MenuItem value="" disabled>Select a building</MenuItem>
                    {buildingData?.buildings.map((building) => (
                      <MenuItem key={building.pk_bld_id} value={building.pk_bld_id}>
                        {building.bld_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingBuildings && <CircularProgress size={24} />}
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={loadingLocations || !selectedBuilding}>
                  <InputLabel sx={{ color: colors.grey[100] }}>Location</InputLabel>
                  <Select
                    value={selectedLocation}
                    onChange={(e) => {
                      handleLocationChange(e);
                      handleChange(e);
                    }}
                    name="fk_loc_id"
                    sx={{ color: colors.grey[100] }}
                  >
                    <MenuItem value="" disabled>Select a location</MenuItem>
                    {locationsData?.locations.map((location) => (
                      <MenuItem key={location.pk_loc_id} value={location.pk_loc_id}>
                        {location.loc_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingLocations && <CircularProgress size={24} />}
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={loadingGroups || !selectedLocation}>
                  <InputLabel sx={{ color: colors.grey[100] }}>Group</InputLabel>
                  <Select
                    value={selectedGroup}
                    onChange={handleGroupChange}
                    sx={{ color: colors.grey[100] }}
                  >
                    <MenuItem value="" disabled>Select a group</MenuItem>
                    {groupsData?.as_group.map((group) => (
                      <MenuItem key={group.as_group_id} value={group.as_group_id}>
                        {group.as_group_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingGroups && <CircularProgress size={24} />}
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={loadingTypes || !selectedGroup}>
                  <InputLabel sx={{ color: colors.grey[100] }}>Type</InputLabel>
                  <Select
                    value={selectedType}
                    onChange={handleTypeChange}
                    sx={{ color: colors.grey[100] }}
                  >
                    <MenuItem value="" disabled>Select a type</MenuItem>
                    {typesData?.as_type.map((type) => (
                      <MenuItem key={type.as_type_id} value={type.as_type_id}>
                        {type.as_type_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingTypes && <CircularProgress size={24} />}
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={loadingCategories || !selectedType}>
                  <InputLabel sx={{ color: colors.grey[100] }}>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    sx={{ color: colors.grey[100] }}
                  >
                    <MenuItem value="" disabled>Select a category</MenuItem>
                    {categoriesData?.as_category.map((category) => (
                      <MenuItem key={category.as_cat_id} value={category.as_cat_id}>
                        {category.as_cat_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingCategories && <CircularProgress size={24} />}
                </FormControl>

                {selectedCategory && (
                  <>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Asset Name"
                      name="as_name"
                      value={values.as_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_name && Boolean(errors.as_name)}
                      helperText={touched.as_name && errors.as_name}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Manufacturer"
                      name="as_manufacturer"
                      value={values.as_manufacturer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_manufacturer && Boolean(errors.as_manufacturer)}
                      helperText={touched.as_manufacturer && errors.as_manufacturer}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Year of Manufacture"
                      name="as_manufacture_year"
                      value={values.as_manufacture_year}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_manufacture_year && Boolean(errors.as_manufacture_year)}
                      helperText={touched.as_manufacture_year && errors.as_manufacture_year}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Model Type"
                      name="as_model_name"
                      value={values.as_model_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_model_name && Boolean(errors.as_model_name)}
                      helperText={touched.as_model_name && errors.as_model_name}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Serial Number"
                      name="as_serial_num"
                      value={values.as_serial_num}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_serial_num && Boolean(errors.as_serial_num)}
                      helperText={touched.as_serial_num && errors.as_serial_num}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Expected Life"
                      name="as_expected_life"
                      value={values.as_expected_life}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_expected_life && Boolean(errors.as_expected_life)}
                      helperText={touched.as_expected_life && errors.as_expected_life}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: colors.grey[100] }}>Business Critical</InputLabel>
                      <Select
                        name="as_business_critical"
                        value={values.as_business_critical}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ color: colors.grey[100] }}
                      >
                        <MenuItem value="" disabled>Select an option</MenuItem>
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Warranty Length"
                      name="as_warranty_length"
                      value={values.as_warranty_length}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_warranty_length && Boolean(errors.as_warranty_length)}
                      helperText={touched.as_warranty_length && errors.as_warranty_length}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Warranty Expiry"
                      name="as_warranty_expiry"
                      type="date"
                      value={values.as_warranty_expiry}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_warranty_expiry && Boolean(errors.as_warranty_expiry)}
                      helperText={touched.as_warranty_expiry && errors.as_warranty_expiry}
                      InputLabelProps={{ shrink: true, sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: colors.grey[100] }}>Operational Status</InputLabel>
                      <Select
                        name="as_status"
                        value={values.as_status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ color: colors.grey[100] }}
                      >
                        <MenuItem value="" disabled>Select an option</MenuItem>
                        <MenuItem value={true}>Operational</MenuItem>
                        <MenuItem value={false}>Non-Operational</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Extra Information"
                      name="as_extra_info"
                      value={values.as_extra_info}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_extra_info && Boolean(errors.as_extra_info)}
                      helperText={touched.as_extra_info && errors.as_extra_info}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Access Restrictions"
                      name="as_access_restrictions"
                      value={values.as_access_restrictions}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_access_restrictions && Boolean(errors.as_access_restrictions)}
                      helperText={touched.as_access_restrictions && errors.as_access_restrictions}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Last Service Date"
                      name="as_last_service_date"
                      type="date"
                      value={values.as_last_service_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_last_service_date && Boolean(errors.as_last_service_date)}
                      helperText={touched.as_last_service_date && errors.as_last_service_date}
                      InputLabelProps={{ shrink: true, sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Parent Asset ID"
                      name="as_parent_id"
                      value={values.as_parent_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.as_parent_id && Boolean(errors.as_parent_id)}
                      helperText={touched.as_parent_id && errors.as_parent_id}
                      InputLabelProps={{ sx: { color: colors.grey[100] } }}
                      sx={{ input: { color: colors.grey[100] } }}
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: colors.grey[100] }}>PPM Discipline</InputLabel>
                      <Select
                        name="fk_disc_id"
                        value={values.fk_disc_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ color: colors.grey[100] }}
                      >
                        <MenuItem value="" disabled>Select a PPM discipline</MenuItem>
                        {ppmDisciplinesData?.ppm_discipline.map((discipline) => (
                          <MenuItem key={discipline.disc_id} value={discipline.disc_id}>
                            {discipline.disc_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: colors.grey[100] }}>Reactive Discipline</InputLabel>
                      <Select
                        name="fk_r_disc_id"
                        value={values.fk_r_disc_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ color: colors.grey[100] }}
                      >
                        <MenuItem value="" disabled>Select a reactive discipline</MenuItem>
                        {reactDisciplinesData?.react_discipline.map((discipline) => (
                          <MenuItem key={discipline.disc_id} value={discipline.disc_id}>
                            {discipline.disc_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}

                {createError && (
                  <Typography color="error" variant="body2">
                    Error creating asset: {createError.message}
                  </Typography>
                )}

                <DialogActions>
                  <Button onClick={onClose} sx={{ color: colors.grey[100] }}>Cancel</Button>
                  <Button type="submit" sx={{ color: colors.grey[100] }} disabled={isSubmitting || loadingCreate}>
                    {loadingCreate ? <CircularProgress size={24} /> : 'Create Asset'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AssetModal;









