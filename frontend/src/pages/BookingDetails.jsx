import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

//style
import "../styles/dashboard/restaurantOwenr/BookingDetails.css";

const BookingCalendar = () => {
  const userId = localStorage.getItem("userId");

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/bookings/${userId}`
        );
        const formattedEvents = response.data.bookings.map((booking) => {
          const startDate = new Date(
            `${booking.date.substring(0, 11)}${booking.time}:00.000Z`
          );
          const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

          return {
            title: `${booking.reservationPerson}'s Reservation with ${booking.participants} people`,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            color: getEventColor(booking.status),
            participants: booking.participants,
            status: booking.status,
          };
        });
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchEvents();
  }, [userId]);

  const getEventColor = (status) => {
    switch (status) {
      case "pending":
        return "#337ab7"; // blue == pending
      case "confirmed":
        return "#5cb85c"; // green == confirmed
      case "declined":
        return "#d9534f"; // red == declined
      case "cancelled":
        return "#777"; // grey == canceled
      case "finished":
        return "#5bc0de"; // light blue == finished(or done)
      default:
        return "#337ab7"; // default blue (default is pending)
    }
  };
  console.log("booking detail page", events);
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotMinTime="11:00:00"
        slotMaxTime="24:00:00"
        events={events}
        contentHeight="auto"
        eventContent={(eventInfo) => (
          <div>
            <b
              style={{
                marginLeft: "5px",
                fontSize: "1em",
                whiteSpace: "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {eventInfo.event.title}
            </b>
            <i style={{ marginLeft: "5px" }}>
              {eventInfo.event.extendedProps.status}
            </i>
          </div>
        )}
      />
    </div>
  );
};

export default BookingCalendar;
