import React from 'react';
import { Box, Modal, Typography, List, ListItem, ListItemText, Button, useTheme } from '@mui/material';
import { formatDate } from '@fullcalendar/core';
import { tokens } from "../theme";

const EventModal = ({ open, onClose, event }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!event) return null;

  console.log("Event in Modal:", event); // Debugging line

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 400, 
        bgcolor: 'background.paper', 
        border: '2px solid #000', 
        boxShadow: 24, 
        p: 4
      }}>
        <Typography id="modal-title" variant="h6" component="h2">
          {event.title}
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Date: {formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}
        </Typography>
        <Typography>Discipline: {event.extendedProps?.disc_name || "N/A"}</Typography>
        <Typography>Building: {event.extendedProps?.bld_name || "N/A"}</Typography>
        <Typography>Assets:</Typography>
        <List>
          {event.extendedProps?.assets?.length > 0 ? (
            event.extendedProps.assets.map((asset, index) => (
              <ListItem key={index}>
                <ListItemText primary={asset.as_name} />
              </ListItem>
            ))
          ) : (
            <Typography>No assets available</Typography>
          )}
        </List>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default EventModal;
