import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { GET_PPM_SERVICE_PLANS, GET_SUPPLIERS } from '../../api/queries/ppmdata';
import { UPDATE_SINGLE_PPM_SERVICE_PLAN } from '../../api/mutations/ppmdata';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material/styles';
import Header from '../../components/Header';
import CreatePPMServicePlan from '../../components/createppm';

const PPMData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_PPM_SERVICE_PLANS);
  const { data: supplierData } = useQuery(GET_SUPPLIERS);

  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [updateField, setUpdateField] = useState('ppm_cost');
  const [errorMessage, setErrorMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('days');
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    ppm_status: false,
    ppm_type: false,
    notes: false,
    compliance_ppm_expiry: false,
    ppm_standard: false,
    next_service_date: false,
  });

  const [updateSinglePPMServicePlan] = useMutation(UPDATE_SINGLE_PPM_SERVICE_PLAN);

  useEffect(() => {
    if (data && data.ppm_service_plan) {
      const formattedRows = data.ppm_service_plan.flatMap((plan) =>
        plan.ppm_building_service_plans.map((bsp) => ({
          ...plan,
          id: `${plan.ppm_id}-${bsp.building.bld_name}`, // Ensure unique ID for each row
          bld_name: bsp.building.bld_name || 'N/A',
          org_name: bsp.building.organization.org_name || 'N/A',
          disc_name: plan.ppm_discipline?.disc_name || 'N/A',
          sup_name: plan.supplier?.sup_name || 'N/A',
          ppm_bsp_key: bsp.ppm_bsp_key,
        }))
      );
      setRows(formattedRows);
    }
  }, [data]);

  const handleEditClick = (id, disc_id, bld_id) => () => {
    navigate(`/ppmdetail/${id}?disc_id=${disc_id}&bld_id=${bld_id}`);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllChange = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rows.map((row) => row.id));
    }
    setAllSelected(!allSelected);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

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

  const validateInput = () => {
    let isValid = true;
    let error = '';
    if (updateField === 'ppm_cost') {
      if (!/^\d+$/.test(newValue)) {
        isValid = false;
        error = 'Cost must be an integer.';
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
      for (const id of selectedIds) {
        const updateValue =
          updateField === 'sup_name'
            ? { fk_sup_id: supplierData.suppliers.find((sup) => sup.sup_name === newValue).sup_id }
            : { [updateField]: updateField === 'ppm_frequency' ? `${amount} ${unit}` : newValue };

        const ppmId = id.split('-')[0];
        await updateSinglePPMServicePlan({
          variables: { ppm_id: parseInt(ppmId), fields: updateValue },
        });
      }
      const updatedRows = rows.map((row) => {
        if (selectedIds.includes(row.id)) {
          return { ...row, [updateField]: updateField === 'ppm_frequency' ? `${amount} ${unit}` : newValue };
        }
        return row;
      });
      setRows(updatedRows);
      setSelectedIds([]);
      setAllSelected(false);
      setOpen(false);
    } catch (error) {
      console.error('Error updating PPM service plan', error);
    }
  };

  const handleColumnVisibilityModelChange = (newModel) => {
    setColumnVisibilityModel(newModel);
  };

  const columns = [
    {
      field: 'checkbox',
      headerName: (
        <Checkbox
          indeterminate={selectedIds.length > 0 && selectedIds.length < rows.length}
          checked={rows.length > 0 && selectedIds.length === rows.length}
          onChange={handleSelectAllChange}
          sx={{ '& .MuiDataGrid-columnSeparator': { display: 'none' } }}
        />
      ),
      width: 50,
      sortable: false,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: (params) => (
        <Checkbox
          indeterminate={selectedIds.length > 0 && selectedIds.length < rows.length}
          checked={rows.length > 0 && selectedIds.length === rows.length}
          onChange={handleSelectAllChange}
          sx={{ '& .MuiDataGrid-columnSeparator': { display: 'none' } }}
        />
      ),
      renderCell: (params) => (
        <Checkbox checked={selectedIds.includes(params.row.id)} onChange={() => handleCheckboxChange(params.row.id)} />
      ),
      hide: true,
    },
    { field: 'org_name', headerName: 'Organization', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'bld_name', headerName: 'Building', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'disc_name', headerName: 'Discipline', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'ppm_service_name', headerName: 'Service Name', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'sup_name', headerName: 'Supplier', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'ppm_schedule', headerName: 'Schedule', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'ppm_frequency', headerName: 'Frequency', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'last_service_date', headerName: 'Last Service Date', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'next_service_date', headerName: 'Next Service Date', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'ppm_cost', headerName: 'Cost', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'ppm_status', headerName: 'Status', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'ppm_type', headerName: 'Type', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'ppm_standard', headerName: 'Standard', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'notes', headerName: 'Notes', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'compliance_ppm_expiry', headerName: 'Compliance Expiry', flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: 'compliance_ppm',
      headerName: 'Compliance',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          color={params.row.compliance_ppm ? colors.greenAccent[500] : colors.redAccent[500]}
        >
          {params.row.compliance_ppm ? 'Compliance' : 'Non-Compliance'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      cellClassName: 'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Edit'
          onClick={handleEditClick(row.ppm_id, row.disc_id, row.bld_id)}
          color='inherit'
        />,
      ],
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box m='20px'>
      <Header title='PPM MANAGEMENT' subtitle='List of PPM Service Plans' />
      <Box display='flex' justifyContent='space-between' mb={2}>
        <Button
          onClick={handleClickOpen}
          variant='contained'
          color='primary'
          style={{ marginBottom: '20px', backgroundColor: colors.greenAccent[600], color: colors.grey[100] }}
        >
          Bulk Revision
        </Button>
        <Button
          onClick={handleDialogOpen}
          variant='contained'
          color='primary'
          style={{ marginBottom: '20px', backgroundColor: colors.greenAccent[600], color: colors.grey[100] }}
        >
          Create PPM
        </Button>
      </Box>
      <CreatePPMServicePlan open={dialogOpen} onClose={handleDialogClose} onCreate={refetch} />
      <Dialog open={open} onClose={handleClose}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleUpdate} color='primary'>
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        m='40px 0 0 0'
        height='75vh'
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.greenAccent[600]} !important`,
          },
          '& .MuiDataGrid-columnMenu': {
            display: 'none',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{
            toolbar: GridToolbar,
          }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
          pageSize={100}
          rowsPerPageOptions={[100, 500, 1000]}
        />
      </Box>
    </Box>
  );
};

export default PPMData;





