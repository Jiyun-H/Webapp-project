import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import UserProfile from "../components/dashboard/Userprofile";
import DashboardSection from "../components/dashboard/DashboardSection";
import CouponsManagementComponent from "../components/dashboard/CouponsManagementComponent";
import BookingManagementComponent from "../components/dashboard/BookingManagementComponent";
import BookingConfirmComponent from "../components/dashboard/BookingConfirmComponent";
import BannerAdsComponent from "../components/dashboard/BannerAdsComponent";

import "../../src/styles/dashboard/DashboardSection.css";

export default function RestaurantDashboardPage() {
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState([]);
  const [coupon, setCoupon] = useState([]);
  const [banner, setBanner] = useState([]);
  //const userId = localStorage.getItem("userId");
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(`http://localhost:5001/api/restaurantowners/${userId}`, config)
      .then((response) => {
        if (response) {
          setUser({
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            profileImg:
              response.data.profileImg || "../../assets/default_profile.jpeg",
          });
          //  bring booking data when successfully
          axios
            .get(`http://localhost:5001/api/bookings/${userId}`, config)
            .then((bookingResponse) => {
              console.log(
                "here is restuarnt owner's booking on dashboardcomponent:",
                bookingResponse.data
              );
              setBooking(bookingResponse.data.bookings);
            })
            .catch((bookingResponse) => {
              console.error(
                "There was an error fetching the bookingResponse data: ",
                bookingResponse
              );
            });

          //  bring coupon data when successfully
          axios
            .get(
              `http://localhost:5001/api/restaurantowners/coupons/${userId}`,
              config
            )
            .then((couponResponse) => {
              console.log("here is restuarnt owner:", couponResponse.data);
              setCoupon(couponResponse.data.coupons);
            })
            .catch((couponResponse) => {
              console.error(
                "There was an error fetching the coupons data: ",
                couponResponse
              );
            });
          //bring banner ads data when successfully
          axios
            .get(`http://localhost:5001/api/restaurantowners/banners/${userId}`)
            .then((bannerResponse) => {
              console.log(bannerResponse.data);
              setBanner(bannerResponse.data.banners);
            })
            .catch((bannerResponse) => {
              console.error(
                "There was an error fetching the banner ad data: ",
                bannerResponse
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

  if (!user) {
    return <div> Loading...</div>;
  }

  const buttonHandler = () => {
    navigate("/bookingDetails");
  };

  return (
    <div className="dashboard-container">
      <UserProfile user={user}> </UserProfile>
      <Button
        sx={{
          backgroundColor: "#ff8c00",
          color: "#fff",
          "&:hover": {
            backgroundColor: "rgba(128, 128, 128, 1)",
          },
        }}
        variant="contained"
        onClick={buttonHandler}
      >
        See booking calender
      </Button>

      <div className="dashboard-cards">
        <DashboardSection title="Today's booking">
          <BookingManagementComponent
            userId={userId}
            bookings={booking}
            onBookingsChange={setBooking}
          />
        </DashboardSection>
        <DashboardSection title="Confirm Booking">
          <BookingConfirmComponent
            userId={userId}
            bookings={booking}
            onBookingsChange={setBooking}
          />
        </DashboardSection>

        <DashboardSection title="Setting Coupons">
          <CouponsManagementComponent
            coupons={coupon}
            onCouponsChange={setCoupon}
            userId={userId}
          />
        </DashboardSection>
        <DashboardSection title="Banner Ads">
          <BannerAdsComponent
            banners={banner}
            userId={userId}
            setBanners={setBanner}
          />
        </DashboardSection>
      </div>
    </div>
  );
}
