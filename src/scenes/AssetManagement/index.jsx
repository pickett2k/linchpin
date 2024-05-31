import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, Switch, FormControlLabel } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { GET_ASSET_OVERVIEW, GET_ASSET, GET_CATEGORIES } from "../../api/queries/assetmanagement";
import EditIcon from "@mui/icons-material/Edit";
import AssetModal from '../../components/assetmodal';

const AssetManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const { loading: overviewLoading, error: overviewError, data: overviewData } = useQuery(GET_ASSET_OVERVIEW);
  const { loading: detailsLoading, error: detailsError, data: detailsData, refetch } = useQuery(GET_ASSET);
  const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery(GET_CATEGORIES);

  const [mergedData, setMergedData] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (overviewData && detailsData && categoriesData) {
      const detailsMap = new Map(detailsData.asset.map(item => [item.as_id, item]));
      const categoriesMap = new Map(categoriesData.as_category.map(item => [item.as_cat_id, {
        as_cat_name: item.as_cat_name,
        as_type_name: item.as_type.as_type_name,
        as_group_name: item.as_type.as_group.as_group_name
      }]));

      const merged = overviewData.vw_asset_bld_org.map(item => ({
        ...item,
        ...detailsMap.get(item.as_id),
        ...(detailsMap.get(item.as_id)?.fk_as_cat_id ? categoriesMap.get(detailsMap.get(item.as_id).fk_as_cat_id) : {})
      })).filter(item => !item.as_deleted);
      setMergedData(merged);
    }
  }, [overviewData, detailsData, categoriesData]);

  const handleToggleArchived = (event) => {
    setShowArchived(event.target.checked);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    as_archived: false,
    as_expected_life: false,
    as_warranty: false,
    as_next_service_date: false,
    as_type_name: false,
    as_group_name: false,
    as_verified_status: false,
    as_warranty_length: false,
    as_warranty_expiry: false,
    as_parent_id: false,
  });

  const handleColumnVisibilityModelChange = (newModel) => {
    setColumnVisibilityModel(newModel);
  };

  if (overviewLoading || detailsLoading || categoriesLoading) return <p>Loading...</p>;
  if (overviewError) return <p>Error: {overviewError.message}</p>;
  if (detailsError) return <p>Error: {detailsError.message}</p>;
  if (categoriesError) return <p>Error: {categoriesError.message}</p>;

  const handleEditClick = (as_id) => {
    navigate(`/assetdetail/${as_id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const filteredData = mergedData.filter(item => item.as_archived === showArchived);

  const columns = [
    { field: "as_id", headerName: "ID", align: 'center', headerAlign: 'center' },
    { field: "org_name", headerName: "Organization", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "bld_name", headerName: "Building", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "loc_name", headerName: "Location", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_group_name", headerName: "Asset Group", flex: 1, align: 'center', headerAlign: 'center', hide: true },
    { field: "as_type_name", headerName: "Asset Type", flex: 1, align: 'center', headerAlign: 'center', hide: true },
    { field: "as_cat_name", headerName: "Asset Category", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_name", headerName: "Name", flex: 1, cellClassName: "name-column--cell", align: 'center', headerAlign: 'center' },
    { field: "as_manufacturer", headerName: "Manufacturer", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_model_name", headerName: "Model Name", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_serial_num", headerName: "Serial Number", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_manufacture_year", headerName: "Manufacture Year", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_archived", headerName: "Archived Asset", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_expected_life", headerName: "Expected Life", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_warranty", headerName: "Warranty", flex: 1, align: 'center', headerAlign: 'center', hide: true },
    { field: "as_next_service_date", headerName: "Next Service Date", flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: "as_created_date",
      headerName: "Created Date",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return formatDate(params.row.as_created_date);
      }
    },
    { field: "as_verified_status", headerName: "Verified Status", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_warranty_expiry", headerName: "Warranty Expiry", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_warranty_length", headerName: "Warranty Length", flex: 1, align: 'center', headerAlign: 'center' },
    { field: "as_parent_id", headerName: "Parent ID", flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: "as_status",
      headerName: "Status",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          color={params.row.as_status ? colors.greenAccent[500] : colors.redAccent[500]}>
          {params.row.as_status ? 'Operational' : 'Non-Operational'}
        </Typography>
      )
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      align: "center",
      headerAlign: "center",
      cellClassName: "actions",
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(row.as_id)}
          color="inherit"
        />,
      ],
    },
  ];

  return (
    <Box m="20px">
      <Header title="ASSET MANAGEMENT" subtitle="List of Assets" />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={openModal}
          sx={{ backgroundColor: colors.greenAccent[600], color: colors.grey[400], }}
        >
          Create New Asset
        </Button>
        <FormControlLabel
          control={<Switch checked={showArchived} onChange={handleToggleArchived} />}
          label="Show Archived"
          sx={{ ml: 'auto' }}
        />
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.greenAccent[600]} !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          slots={{
            toolbar: GridToolbar,
          }}
          getRowId={(row) => row.as_id}
          checkboxSelection
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
        />
      </Box>

      <AssetModal isOpen={isModalOpen} onClose={closeModal} refetchAssets={refetch} />
    </Box>
  );
};

export default AssetManagement;







