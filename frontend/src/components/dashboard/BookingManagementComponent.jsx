import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function BookingManagementComponent({
  bookings = [],
  userId,
  onBookingsChange,
}) {
  const [localBookings, setLocalBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000); // 모의 로딩 효과
  }, []);

  useEffect(() => {
    console.log("Received today's bookings: ", bookings);

    const today = new Date().toISOString().slice(0, 10);
    const filteredBookings = bookings.filter(
      (booking) =>
        booking.date.slice(0, 10) === today &&
        (booking.status === "confirmed" || booking.status === "cancelled")
    );
    setLocalBookings(filteredBookings);
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

  const handleStatusChange = (bookingId) => {
    const requestData = {
      bookingId: bookingId,
      status: "finished",
    };

    // Fetch status update request to backend
    fetch("http://localhost:5001/api/bookings/status-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const updatedBookings = bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "finished" }
              : booking
          );
          setLocalBookings(
            updatedBookings.filter(
              (booking) =>
                booking.date.slice(0, 10) ===
                  new Date().toISOString().slice(0, 10) &&
                (booking.status === "confirmed" ||
                  booking.status === "cancelled")
            )
          );

          onBookingsChange(updatedBookings);
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
        No bookings for today :(
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
                  <TableCell sx={{ textAlign: "center" }}>Time</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Name</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Participants
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Done</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {localBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell
                        sx={{ textAlign: "center", padding: "15px 20px" }}
                      >
                        {booking.time}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", padding: "15px 20px" }}
                      >
                        {booking.reservationPerson}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", padding: "15px 20px" }}
                      >
                        {booking.participants}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", padding: "15px 20px" }}
                      >
                        {booking.status}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", padding: "6px 10px" }}
                      >
                        <IconButton
                          onClick={() => handleStatusChange(booking._id)}
                        >
                          <CheckCircleOutlineIcon color="success" />
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

export default BookingManagementComponent;
