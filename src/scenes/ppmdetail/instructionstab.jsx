import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, TextField, Button, IconButton, Snackbar } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { GET_INSTRUCTIONS } from "../../api/queries/ppmdetail";
import { UPDATE_INSTRUCTION, INSERT_INSTRUCTION, DELETE_INSTRUCTION } from "../../api/mutations/ppmdetail";

const InstructionsTab = ({ ppm_id, refetch }) => {
  const { data: instructionsData, refetch: refetchInstructions } = useQuery(GET_INSTRUCTIONS, { variables: { ppm_id: parseInt(ppm_id) } });
  const [updateInstruction] = useMutation(UPDATE_INSTRUCTION);
  const [insertInstruction] = useMutation(INSERT_INSTRUCTION);
  const [deleteInstruction] = useMutation(DELETE_INSTRUCTION);

  const [editMode, setEditMode] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (instructionsData) {
      setInstructions(instructionsData.instruction_set);
    }
  }, [instructionsData]);

  const handleInstructionChange = (index, field, value) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = {
      ...updatedInstructions[index],
      [field]: value !== null ? value : '',
    };
    setInstructions(updatedInstructions);
  };

  const handleSaveInstructions = async () => {
    try {
      for (const instruction of instructions) {
        if (instruction.pk_inst_set_id) {
          await updateInstruction({ variables: { pk_inst_set_id: instruction.pk_inst_set_id, object: { inst_set_detail: instruction.inst_set_detail, fk_ppm_id: parseInt(ppm_id) } } });
        } else {
          await insertInstruction({ variables: { object: { fk_ppm_id: parseInt(ppm_id), inst_set_detail: instruction.inst_set_detail } } });
        }
      }
      setSnackbarMessage('Instructions updated successfully!');
      setSnackbarOpen(true);
      refetchInstructions();
      setEditMode(false);
    } catch (error) {
      console.error("Error updating instructions:", error);
    }
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, { pk_inst_set_id: null, fk_ppm_id: parseInt(ppm_id), inst_set_detail: '' }]);
  };

  const handleDeleteInstruction = async (index) => {
    const instruction = instructions[index];
    if (instruction.pk_inst_set_id) {
      try {
        await deleteInstruction({ variables: { pk_inst_set_id: instruction.pk_inst_set_id } });
        setSnackbarMessage('Instruction deleted successfully!');
        setSnackbarOpen(true);
        refetchInstructions();
      } catch (error) {
        console.error("Error deleting instruction:", error);
      }
    }
    const updatedInstructions = [...instructions];
    updatedInstructions.splice(index, 1);
    setInstructions(updatedInstructions);
  };

  const handleCancel = () => {
    setEditMode(false);
    setInstructions(instructionsData.instruction_set); // Reset to original values
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      {instructions.map((instruction, index) => (
        <Box key={index} display="flex" alignItems="center" gap="16px">
          <TextField label="Instruction Detail" value={instruction.inst_set_detail || ''} onChange={(e) => handleInstructionChange(index, 'inst_set_detail', e.target.value)} disabled={!editMode} fullWidth />
          {editMode && (
            <IconButton onClick={() => handleDeleteInstruction(index)} color="secondary">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}
      {editMode ? (
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddInstruction}>Add Instruction</Button>
      ) : (
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </Box>
      )}
      {editMode && (
        <Box display="flex" justifyContent="flex-end" gap="16px">
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSaveInstructions}>
            Save Instructions
          </Button>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default InstructionsTab;




