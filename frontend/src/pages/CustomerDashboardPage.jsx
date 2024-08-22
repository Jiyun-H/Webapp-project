import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserProfile from "../components/dashboard/Userprofile";
import DashboardSection from "../components/dashboard/DashboardSection";
import PointsComponent from "../components/dashboard/PointsComponent";
import BookingsComponent from "../components/dashboard/BookingsComponent";
import CouponsComponent from "../components/dashboard/CouponsComponent";
import ReviewsComponent from "../components/dashboard/ReviewsComponent";
import "../../src/styles/dashboard/DashboardSection.css";

export default function CustomerDashboardPage() {
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState([]);
  const [coupon, setCoupon] = useState([]);
  const [review, setReview] = useState([]);
  const { userId } = useParams();
  useEffect(() => {
    // const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios

      .get(`http://localhost:5001/api/customers/${userId}`, config)
      .then((response) => {
        if (response) {
          //console.log(response.data);
          setUser({
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            profileImg:
              response.data.profileImg || "../../assets/default_profile.jpeg",
            point: response.data.point,
          });
          // bring booking data when successfully brind user data
          axios
            .get(
              `http://localhost:5001/api/customers/bookings/${userId}`,
              config
            )
            .then((bookingResponse) => {
              //console.log(bookingResponse.data);
              setBooking(bookingResponse.data.bookings);
            })
            .catch((bookingError) => {
              console.error(
                "There was an error fetching the booking data: ",
                bookingError
              );
            });
          //  bring coupon data when successfully brind user data
          axios
            .get(
              `http://localhost:5001/api/customers/coupons/${userId}`,
              config
            )
            .then((couponResponse) => {
              console.log(couponResponse.data);
              setCoupon(couponResponse.data.coupons);
            })
            .catch((couponResponse) => {
              console.error(
                "There was an error fetching the booking data: ",
                couponResponse
              );
            });
          //  bring review data when successfully brind user data
          axios
            .get(
              `http://localhost:5001/api/customers/reviews/${userId}`,
              config
            )
            .then((reviewResponse) => {
              //console.log(reviewResponse.data);
              setReview(reviewResponse.data.reviews);
            })
            .catch((reviewResponse) => {
              console.error(
                "There was an error fetching the booking data: ",
                reviewResponse
              );
            });
        } else {
          console.log("No users found");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the user data: ", error);
      });
  }, []);

  //if no user return false
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <UserProfile user={user} />
      <div className="dashboard-cards">
        <DashboardSection title="My Booking">
          <BookingsComponent bookings={booking} />
        </DashboardSection>

        <DashboardSection title="My Points">
          <PointsComponent points={user.point} />
        </DashboardSection>

        <DashboardSection title="My Coupons">
          <CouponsComponent initCoupons={coupon} />
        </DashboardSection>

        <DashboardSection title="My Reviews">
          <ReviewsComponent initReviews={review} />
        </DashboardSection>
      </div>
    </div>
  );
}
