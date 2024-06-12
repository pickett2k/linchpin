import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, Typography, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_ORGANIZATIONS, GET_BUILDINGS, GET_LOCATIONS } from '../api/queries/orgsettings';
import { ADD_ORGANIZATION, DELETE_ORGANIZATION, ADD_BUILDING, DELETE_BUILDING, ADD_LOCATION, DELETE_LOCATION } from '../api/mutations/orgsettings';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const OrganizationSettings = () => {
  const { loading: orgLoading, error: orgError, data: orgData, refetch: refetchOrgs } = useQuery(GET_ORGANIZATIONS);
  const [getBuildings, { loading: bldLoading, error: bldError, data: bldData, refetch: refetchBlds }] = useLazyQuery(GET_BUILDINGS);
  const [getLocations, { loading: locLoading, error: locError, data: locData, refetch: refetchLocs }] = useLazyQuery(GET_LOCATIONS);

  const [addOrganization] = useMutation(ADD_ORGANIZATION, { onCompleted: refetchOrgs });
  const [deleteOrganization] = useMutation(DELETE_ORGANIZATION, { onCompleted: refetchOrgs });
  const [addBuilding] = useMutation(ADD_BUILDING, { onCompleted: refetchBlds });
  const [deleteBuilding] = useMutation(DELETE_BUILDING, { onCompleted: refetchBlds });
  const [addLocation] = useMutation(ADD_LOCATION, { onCompleted: refetchLocs });
  const [deleteLocation] = useMutation(DELETE_LOCATION, { onCompleted: refetchLocs });

  const [organizations, setOrganizations] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [newOrg, setNewOrg] = useState({ org_name: '', org_address: '', org_contact: '', org_email: '', org_phone: '' });
  const [newBuilding, setNewBuilding] = useState({ bld_name: '', bld_address: '', bld_contact: '', bld_email: '', bld_phone: '' });
  const [newLocation, setNewLocation] = useState({ loc_name: '', loc_description: '' });
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [warningOpen, setWarningOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (orgData) {
      setOrganizations(orgData.organizations);
    }
  }, [orgData]);

  useEffect(() => {
    if (selectedOrg) {
      getBuildings({ variables: { orgId: parseInt(selectedOrg) } });
    } else {
      setBuildings([]);
      setSelectedBuilding('');
      setLocations([]);
    }
  }, [selectedOrg, getBuildings]);

  useEffect(() => {
    if (bldData) {
      setBuildings(bldData.buildings);
    }
  }, [bldData]);

  useEffect(() => {
    if (selectedBuilding) {
      getLocations({ variables: { bldId: parseInt(selectedBuilding) } });
    } else {
      setLocations([]);
    }
  }, [selectedBuilding, getLocations]);

  useEffect(() => {
    if (locData) {
      setLocations(locData.locations);
    }
  }, [locData]);

  const handleAddOrg = () => {
    addOrganization({ variables: newOrg });
    setNewOrg({ org_name: '', org_address: '', org_contact: '', org_email: '', org_phone: '' });
    setOpen(false);
  };

  const handleRemoveOrg = () => {
    if (selectedOrg) {
      deleteOrganization({ variables: { org_id: parseInt(selectedOrg) } });
      setSelectedOrg('');
      setBuildings([]);
      setSelectedBuilding('');
      setLocations([]);
      setSelectedLocation('');
    }
  };

  const handleAddBuilding = () => {
    addBuilding({ variables: { ...newBuilding, org_id: parseInt(selectedOrg) } });
    setNewBuilding({ bld_name: '', bld_address: '', bld_contact: '', bld_email: '', bld_phone: '' });
    setOpen(false);
  };

  const handleRemoveBuilding = () => {
    if (selectedBuilding) {
      deleteBuilding({ variables: { bld_id: parseInt(selectedBuilding) } });
      setSelectedBuilding('');
      setLocations([]);
      setSelectedLocation('');
    }
  };

  const handleAddLocation = () => {
    addLocation({ variables: { ...newLocation, bld_id: parseInt(selectedBuilding) } });
    setNewLocation({ loc_name: '', loc_description: '' });
    setOpen(false);
  };

  const handleRemoveLocation = () => {
    if (selectedLocation) {
      deleteLocation({ variables: { loc_id: parseInt(selectedLocation) } });
      setSelectedLocation('');
    }
  };

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleOpenWarning = (target) => {
    setDeleteTarget(target);
    setWarningOpen(true);
  };

  const handleCloseWarning = () => {
    setWarningOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget === 'organization') {
      handleRemoveOrg();
    } else if (deleteTarget === 'building') {
      handleRemoveBuilding();
    }
    setWarningOpen(false);
  };

  if (orgLoading || bldLoading || locLoading) return <CircularProgress />;
  if (orgError) return <p>Error loading organizations: {orgError.message}</p>;
  if (bldError) return <p>Error loading buildings: {bldError.message}</p>;
  if (locError) return <p>Error loading locations: {locError.message}</p>;

  return (
    <Box p={2}>
      <Typography variant="h4">Organization Settings</Typography>

      <Box mt={4}>
        <Typography variant="h6">Organizations</Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Button variant="contained" onClick={() => handleOpenDialog('Add Organization')} startIcon={<AddIcon />}>Add Organization</Button>
        </Box>
        <Box mb={2}>
          <Select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select an organization</MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org.pk_org_id} value={org.pk_org_id}>{org.org_name}</MenuItem>
            ))}
          </Select>
          <Box mt={2}>
            <Button variant="outlined" onClick={() => handleOpenDialog('Edit Organization')} disabled={!selectedOrg}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => handleOpenWarning('organization')} startIcon={<DeleteIcon />} sx={{ ml: 2 }} disabled={!selectedOrg}>Remove</Button>
          </Box>
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Buildings</Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Button variant="contained" onClick={() => handleOpenDialog('Add Building')} startIcon={<AddIcon />} disabled={!selectedOrg}>Add Building</Button>
        </Box>
        <Box mb={2}>
          <Select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            displayEmpty
            fullWidth
            disabled={!selectedOrg}
          >
            <MenuItem value="" disabled>Select a building</MenuItem>
            {buildings.map((building) => (
              <MenuItem key={building.pk_bld_id} value={building.pk_bld_id}>{building.bld_name}</MenuItem>
            ))}
          </Select>
          <Box mt={2}>
            <Button variant="outlined" onClick={() => handleOpenDialog('Edit Building')} disabled={!selectedBuilding}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => handleOpenWarning('building')} startIcon={<DeleteIcon />} sx={{ ml: 2 }} disabled={!selectedBuilding}>Remove</Button>
          </Box>
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Locations</Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Button variant="contained" onClick={() => handleOpenDialog('Add Location')} startIcon={<AddIcon />} disabled={!selectedBuilding}>Add Location</Button>
        </Box>
        <Box mb={2}>
          <Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            displayEmpty
            fullWidth
            disabled={!selectedBuilding}
          >
            <MenuItem value="" disabled>Select a location</MenuItem>
            {locations.map((location) => (
              <MenuItem key={location.pk_loc_id} value={location.pk_loc_id}>{location.loc_name}</MenuItem>
            ))}
          </Select>
          <Box mt={2}>
            <Button variant="outlined" onClick={() => handleOpenDialog('Edit Location')} disabled={!selectedLocation}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => handleRemoveLocation()} startIcon={<DeleteIcon />} sx={{ ml: 2 }} disabled={!selectedLocation}>Remove</Button>
          </Box>
        </Box>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{dialogContent}</DialogTitle>
        <DialogContent>
          {dialogContent === 'Add Organization' && (
            <Box>
              <TextField
                label="Organization Name"
                value={newOrg.org_name}
                onChange={(e) => setNewOrg({ ...newOrg, org_name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                value={newOrg.org_address}
                onChange={(e) => setNewOrg({ ...newOrg, org_address: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Contact"
                value={newOrg.org_contact}
                onChange={(e) => setNewOrg({ ...newOrg, org_contact: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={newOrg.org_email}
                onChange={(e) => setNewOrg({ ...newOrg, org_email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone"
                value={newOrg.org_phone}
                onChange={(e) => setNewOrg({ ...newOrg, org_phone: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" onClick={handleAddOrg} fullWidth>Add</Button>
            </Box>
          )}
          {dialogContent === 'Add Building' && (
            <Box>
              <TextField
                label="Building Name"
                value={newBuilding.bld_name}
                onChange={(e) => setNewBuilding({ ...newBuilding, bld_name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                value={newBuilding.bld_address}
                onChange={(e) => setNewBuilding({ ...newBuilding, bld_address: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Contact"
                value={newBuilding.bld_contact}
                onChange={(e) => setNewBuilding({ ...newBuilding, bld_contact: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={newBuilding.bld_email}
                onChange={(e) => setNewBuilding({ ...newBuilding, bld_email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone"
                value={newBuilding.bld_phone}
                onChange={(e) => setNewBuilding({ ...newBuilding, bld_phone: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" onClick={handleAddBuilding} fullWidth>Add</Button>
            </Box>
          )}
          {dialogContent === 'Add Location' && (
            <Box>
              <TextField
                label="Location Name"
                value={newLocation.loc_name}
                onChange={(e) => setNewLocation({ ...newLocation, loc_name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={newLocation.loc_description}
                onChange={(e) => setNewLocation({ ...newLocation, loc_description: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" onClick={handleAddLocation} fullWidth>Add</Button>
            </Box>
          )}
          {/* Placeholder for Edit dialogs */}
          {dialogContent.startsWith('Edit') && (
            <Typography>Edit functionality not implemented yet.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Warning Dialog */}
      <Dialog open={warningOpen} onClose={handleCloseWarning}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteTarget}? This action will remove all associated buildings and locations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarning} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizationSettings;



