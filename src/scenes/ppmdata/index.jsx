import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox } from '@mui/material';
import { useQuery } from '@apollo/client';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { GET_PPM_SERVICE_PLANS, GET_SUPPLIERS } from '../../api/queries/ppmdata';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material/styles';
import Header from '../../components/Header';
import CreatePPMServicePlan from '../../components/createppm';
import BulkChangeModal from './BulkChangeModal';

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
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    ppm_status: false,
    ppm_type: false,
    notes: false,
    compliance_ppm_expiry: false,
    ppm_standard: false,
    next_service_date: false,
  });

  useEffect(() => {
    if (data && data.ppm_service_plan) {
      const formattedRows = data.ppm_service_plan.flatMap((plan) =>
        plan.ppm_building_service_plans.map((bsp) => ({
          id: bsp.ppm_bsp_key,
          ppm_fk_ppm_id: bsp.ppm_fk_ppm_id,
          ppm_id: plan.ppm_id,
          ppm_key: plan.ppm_key,
          ppm_service_name: plan.ppm_service_name,
          ppm_schedule: plan.ppm_schedule,
          ppm_frequency: plan.ppm_frequency,
          last_service_date: plan.last_service_date,
          next_service_date: plan.next_service_date,
          ppm_cost: bsp.ppm_cost,
          ppm_status: plan.ppm_status,
          ppm_type: plan.ppm_type,
          ppm_standard: plan.ppm_standard,
          notes: plan.notes,
          compliance_ppm_expiry: plan.compliance_ppm_expiry,
          compliance_ppm: plan.compliance_ppm,
          disc_name: plan.ppm_discipline?.disc_name || 'N/A',
          disc_id: plan.ppm_discipline?.disc_id || 'N/A',
          sup_name: plan.supplier?.sup_name || 'N/A',
          bld_id: bsp.fk_bld_id,
          bld_name: bsp.building.bld_name || 'N/A',
          org_name: bsp.building.organization.org_name || 'N/A',
          ppm_bsp_key: bsp.ppm_bsp_key,
        }))
      );
      setRows(formattedRows);
    }
  }, [data]);

  const handleEditClick = (ppm_id, disc_id, bld_id) => () => {
    navigate(`/ppmdetail/${ppm_id}?disc_id=${disc_id}&bld_id=${bld_id}`);
  };

  const handleCheckboxChange = (ppm_bsp_key) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(ppm_bsp_key)
        ? prevSelected.filter((selectedId) => selectedId !== ppm_bsp_key)
        : [...prevSelected, ppm_bsp_key]
    );
  };

  const handleSelectAllChange = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      const allBspKeys = rows.map((row) => row.ppm_bsp_key);
      setSelectedIds(allBspKeys);
    }
    setAllSelected(!allSelected);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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
        <Checkbox checked={selectedIds.includes(params.row.ppm_bsp_key)} onChange={() => handleCheckboxChange(params.row.ppm_bsp_key)} />
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
      <BulkChangeModal
        open={open}
        onClose={handleClose}
        selectedIds={selectedIds}
        supplierData={supplierData}
        refetch={refetch}
        rows={rows}
        data={data}
        setRows={setRows}
        setSelectedIds={setSelectedIds}
        setAllSelected={setAllSelected}
      />
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



