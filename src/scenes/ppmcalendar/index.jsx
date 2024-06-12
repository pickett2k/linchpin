import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { formatDate } from '@fullcalendar/core';
import { format } from 'date-fns';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { GET_SERVICE_PLANS } from "../../api/queries/ppmcalendar";
import { UPDATE_SERVICE_PLAN } from "../../api/mutations/ppmcalendar";
import EventModal from "../../components/ppmeventmodal"; // Adjust the import path as necessary

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [currentStart, setCurrentStart] = useState(null);
  const [currentEnd, setCurrentEnd] = useState(null);

  const { loading, error, data, refetch } = useQuery(GET_SERVICE_PLANS);
  const [updateServicePlan] = useMutation(UPDATE_SERVICE_PLAN);

  useEffect(() => {
    if (data) {
      const plans = data.ppm_service_plan?.flatMap(plan =>
        plan.ppm_building_service_plans.map(bsp => ({
          id: bsp.ppm_bsp_key,
          title: plan.ppm_service_name,
          start: bsp.ppm_b_schedule_date,
          extendedProps: {
            ppm_bsp_key: bsp.ppm_bsp_key,
            ppm_fk_ppm_id: plan.ppm_id,
            fk_disc_id: plan.ppm_discipline?.disc_name,
            fk_bld_id: bsp.fk_bld_id,
            disc_name: plan.ppm_discipline?.disc_name,
            bld_name: data.buildings.find(bld => bld.pk_bld_id === bsp.fk_bld_id)?.bld_name,
            assets: data.ppm_asset_service_plan?.map(sp => ({
              as_id: sp.asset?.as_id,
              as_name: sp.asset?.as_name,
            })),
            ppm_b_schedule_date: bsp.ppm_b_schedule_date,
          }
        }))
      );

      setCurrentEvents(plans);
      setFilteredEvents(plans);
    }
  }, [data]);

  useEffect(() => {
    if (currentStart && currentEnd) {
      const filtered = currentEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= currentStart && eventDate <= currentEnd;
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(currentEvents);
    }
  }, [currentView, currentStart, currentEnd, currentEvents]);

  useEffect(() => {
    const filtered = currentEvents.filter(event => {
      const disciplineMatch = selectedDiscipline ? event.extendedProps.disc_name === selectedDiscipline : true;
      const buildingMatch = selectedBuilding ? event.extendedProps.bld_name === selectedBuilding : true;
      return disciplineMatch && buildingMatch;
    });
    setFilteredEvents(filtered);
  }, [selectedDiscipline, selectedBuilding, currentEvents]);

  const handleDatesSet = (dateInfo) => {
    setCurrentView(dateInfo.view.type);
    setCurrentStart(new Date(dateInfo.start));
    setCurrentEnd(new Date(dateInfo.end));
  };

  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  const handleEventClick = (selected) => {
    setSelectedEvent(selected.event);
    setModalOpen(true);
  };

  const handleEventDrop = async (eventDropInfo) => {
    const { event } = eventDropInfo;
    const newStart = format(new Date(event.startStr), 'yyyy-MM-dd'); // Ensure date is in the correct format
    const ppm_bsp_key = event.id;

    try {
      await updateServicePlan({
        variables: {
          ppm_bsp_key,
          ppm_b_schedule_date: newStart,
        },
      });

      // Refetch the events to update the left-hand side list
      await refetch();

      alert(`Event '${event.title}' updated to ${newStart}`);
    } catch (error) {
      alert('Failed to update the event. Please try again.');
      console.error('ApolloError:', error);
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(`GraphQL error: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      if (error.networkError) {
        console.error('Network error:', error.networkError);
      }
      console.error('Error message:', error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Filter Controls */}
        <Box display="flex" gap="10px">
          <FormControl variant="outlined">
            <InputLabel id="discipline-label">Discipline</InputLabel>
            <Select
              labelId="discipline-label"
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              label="Discipline"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {data?.ppm_discipline?.map((discipline) => (
                <MenuItem key={discipline.disc_name} value={discipline.disc_name}>
                  {discipline.disc_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel id="building-label">Building</InputLabel>
            <Select
              labelId="building-label"
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              label="Building"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {data?.buildings?.map((building) => (
                <MenuItem key={building.pk_bld_id} value={building.bld_name}>
                  {building.bld_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="20px">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {filteredEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
                button
                onClick={() => {
                  setSelectedEvent(event);
                  setModalOpen(true);
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <>
                      <Typography component="span">
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                      <Typography component="span">
                        Discipline: {event.extendedProps?.disc_name || "N/A"}
                      </Typography>
                      <Typography component="span">
                        Building: {event.extendedProps?.bld_name || "N/A"}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            datesSet={handleDatesSet}
            eventClick={handleEventClick}
            events={filteredEvents} // Update to use filteredEvents
            eventDrop={handleEventDrop}
          />
        </Box>
      </Box>

      {/* Event Modal */}
      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
        refetch={refetch} // Pass refetch function to the EventModal
      />
    </Box>
  );
};

export default Calendar;




