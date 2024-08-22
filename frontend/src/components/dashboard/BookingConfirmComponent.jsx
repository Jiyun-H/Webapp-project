import { useState, useEffect } from "react";
import {
  CircularProgress,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
} from "@mui/material";

import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

function BookingConfirmComponent({ bookings = [], userId, onBookingsChange }) {
  const [localBookings, setLocalBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  useEffect(() => {
    console.log("Received bookings: ", bookings);

    // Filtering only 'pending' bookings to be shown.
    setLocalBookings(
      bookings.filter((booking) => booking.status === "pending")
    );
  }, [bookings]);

  if (isLoading) {
    return (
      <CircularProgress style={{ display: "block", margin: "20px auto" }} />
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, localBookings.length - page * rowsPerPage);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    const requestData = {
      bookingId: bookingId,
      status: newStatus,
    };

    fetch("http://localhost:5001/api/bookings/status-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.success) {
          const updatedBookings = bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          );

          onBookingsChange(updatedBookings);

          setLocalBookings(
            updatedBookings.filter((booking) => booking.status === "pending")
          );
        } else {
          console.error("Failed to update the booking status:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating booking status:", error);
      });
  };

  if (localBookings.length === 0) {
    return (
      <Paper
        sx={{
          borderRadius: 2,
          backgroundColor: "#ff8c00",
          padding: 1,
          color: "#fff",
          textAlign: "center",
          minHeight: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "bold",
        }}
        elevation={0}
      >
        No further pending bookings
      </Paper>
    );
  }

  return (
    <div className="today-card">
      <div className="table-container">
        <Paper
          sx={{
            borderRadius: 2,
            backgroundColor: "#ff8c00",
            padding: 1,
            color: "#fff",
            textAlign: "center",
            minHeight: "200px",
            position: "relative",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          elevation={0}
        >
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead sx={{ backgroundColor: "#ff8c00" }}>
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>Date</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Time</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Participants
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Confirm</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Decline</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {localBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell
                        sx={{ textAlign: "center", padding: "6px 10px" }}
                      >
                        {formatDate(booking.date)}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", padding: "6px 10px" }}
                      >
                        {booking.time}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", padding: "6px 10px" }}
                      >
                        {booking.participants}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", padding: "6px 10px" }}
                      >
                        <IconButton
                          onClick={() =>
                            handleStatusChange(booking._id, "confirmed")
                          }
                        >
                          <EventAvailableIcon color="success" />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", padding: "6px 10px" }}
                      >
                        <IconButton
                          onClick={() =>
                            handleStatusChange(booking._id, "declined")
                          }
                        >
                          <EventBusyIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {localBookings.length > 0 && (
            <TablePagination
              sx={{
                position: "absolute",
                right: 0,
                bottom: 0,
              }}
              rowsPerPageOptions={[{ label: "All", value: -1 }]}
              component="div"
              count={localBookings.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
      </div>
    </div>
  );
}

export default BookingConfirmComponent;
