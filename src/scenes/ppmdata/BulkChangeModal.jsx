import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select, Button } from '@mui/material';
import { useMutation } from '@apollo/client';
import { BULK_UPDATE_PPM_BUILDING_SERVICE_PLANS, BULK_INSERT_PPM_BULK_CHANGE } from '../../api/mutations/ppmdata';

const BulkChangeModal = ({ open, onClose, selectedIds, supplierData, refetch, rows, data, setRows, setSelectedIds, setAllSelected }) => {
  const [newValue, setNewValue] = useState('');
  const [updateField, setUpdateField] = useState('ppm_cost');
  const [errorMessage, setErrorMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('days');
  const [reason, setReason] = useState('');
  const [requesterName, setRequesterName] = useState('');

  const [bulkUpdatePPMBuildingServicePlans] = useMutation(BULK_UPDATE_PPM_BUILDING_SERVICE_PLANS);
  const [bulkInsertPPMBulkChange] = useMutation(BULK_INSERT_PPM_BULK_CHANGE);

  const handleValueChange = (event) => {
    setNewValue(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleFieldChange = (event) => {
    setUpdateField(event.target.value);
    setNewValue('');
    setAmount('');
    setUnit('days');
    setErrorMessage('');
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleRequesterNameChange = (event) => {
    setRequesterName(event.target.value);
  };

  const validateInput = () => {
    let isValid = true;
    let error = '';
    if (updateField === 'ppm_cost') {
      if (!/^\d+(\.\d{1,2})?$/.test(newValue)) {
        isValid = false;
        error = 'Cost must be a number with up to two decimal places.';
      }
    } else if (updateField === 'ppm_frequency') {
      if (!/^\d+$/.test(amount)) {
        isValid = false;
        error = 'Frequency amount must be a number.';
      }
    } else if (updateField === 'ppm_schedule') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(newValue)) {
        isValid = false;
        error = 'Schedule must be in yyyy-mm-dd format.';
      }
    } else if (updateField === 'sup_name') {
      if (newValue.trim() === '') {
        isValid = false;
        error = 'Supplier name cannot be empty.';
      }
    }
    setErrorMessage(error);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      const bulkChanges = [];
      const updates = [];
      const supplier = updateField === 'sup_name'
        ? supplierData.suppliers.find((sup) => sup.sup_name === newValue)
        : null;

      for (const id of selectedIds) {
        const row = rows.find(row => row.ppm_bsp_key === id);
        const updateValue = updateField === 'sup_name'
          ? { fk_sup_id: supplier.sup_id }
          : { [updateField]: updateField === 'ppm_frequency' ? `${amount} ${unit}` : newValue };

        updates.push({
          where: { ppm_bsp_key: { _eq: id } },
          _set: updateValue
        });

        bulkChanges.push({
          change_reason: reason,
          change_request_by: requesterName,
          change_type: updateField,
          ppm_service_plan_id: row.ppm_id,
          building_id: row.bld_id,
        });
      }

      // Perform bulk update
      const updateResponse = await bulkUpdatePPMBuildingServicePlans({ variables: { updates } });

      if (updateResponse.errors) {
        console.error('Bulk update errors:', updateResponse.errors);
        throw new Error('Bulk update failed');
      }

      // Perform bulk insert
      const insertResponse = await bulkInsertPPMBulkChange({
        variables: { objects: bulkChanges },
      });

      if (insertResponse.errors) {
        console.error('Bulk insert errors:', insertResponse.errors);
        throw new Error('Bulk insert failed');
      }

      const updatedRows = rows.map((row) => {
        if (selectedIds.includes(row.ppm_bsp_key)) {
          return { ...row, [updateField]: updateField === 'ppm_frequency' ? `${amount} ${unit}` : newValue };
        }
        return row;
      });

      setRows(updatedRows);
      setSelectedIds([]);
      setAllSelected(false);
      onClose();
      refetch(); // Ensure the DataGrid is refreshed
    } catch (error) {
      console.error('Error updating PPM service plan', error);
      setErrorMessage('Failed to update PPM service plans. Please check the console for more details.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update PPM Service Plan</DialogTitle>
      <DialogContent>
        <DialogContentText>Select the field to update and enter the new value for the selected PPM service plans.</DialogContentText>
        <Select value={updateField} onChange={handleFieldChange} fullWidth margin='dense'>
          <MenuItem value='ppm_cost'>Cost</MenuItem>
          <MenuItem value='ppm_schedule'>Schedule</MenuItem>
          <MenuItem value='ppm_frequency'>Frequency</MenuItem>
          <MenuItem value='sup_name'>Supplier</MenuItem>
        </Select>
        {updateField === 'sup_name' ? (
          <Select value={newValue} onChange={handleValueChange} fullWidth margin='dense'>
            {supplierData?.suppliers.map((supplier) => (
              <MenuItem key={supplier.sup_id} value={supplier.sup_name}>
                {supplier.sup_name}
              </MenuItem>
            ))}
          </Select>
        ) : updateField === 'ppm_frequency' ? (
          <>
            <TextField
              autoFocus
              margin='dense'
              label='Amount'
              type='number'
              fullWidth
              value={amount}
              onChange={handleAmountChange}
              error={Boolean(errorMessage)}
              helperText={errorMessage}
            />
            <Select value={unit} onChange={handleUnitChange} fullWidth margin='dense'>
              <MenuItem value='days'>Days</MenuItem>
              <MenuItem value='weeks'>Weeks</MenuItem>
              <MenuItem value='months'>Months</MenuItem>
              <MenuItem value='years'>Years</MenuItem>
            </Select>
          </>
        ) : (
          <TextField
            autoFocus
            margin='dense'
            label='New Value'
            type='text'
            fullWidth
            value={newValue}
            onChange={handleValueChange}

            error={Boolean(errorMessage)}
            helperText={errorMessage}
          />
        )}
        <TextField
          margin='dense'
          label='Reason for Change'
          type='text'
          fullWidth
          value={reason}
          onChange={handleReasonChange}
        />
        <TextField
          margin='dense'
          label='Requester Name'
          type='text'
          fullWidth
          value={requesterName}
          onChange={handleRequesterNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleUpdate} color='primary'>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkChangeModal;


