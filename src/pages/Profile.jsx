import axios from "axios";
import { useEffect, useState } from "react";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";
import "./MyProfile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:4000/api/user/profile", {
        headers: { token },
      })
      .then((res) => setProfile(res.data.user))
      .catch((err) => console.log("Profile fetch error:", err));
  }, []);

  if (!profile)
    return <p className="loading">Loading...</p>;

  return (
    <div className="profile-page">

      {/* HEADER LINE */}
      <div className="top-line" />

      {/* PAGE TITLE */}
      <div className="profile-header">
  <h2>
    <span className="light">MY</span>{" "}
    <span className="bold">PROFILE</span>
  </h2>

  {/* RIGHT SIDE LINE */}
  <div className="side-line"></div>
</div>


      {/* MAIN GRID */}
      <div className="profile-container">

        {/* LEFT CARD */}
        <div className="left-card">

          {/* TITLE WITH SIDE LINE */}
          <div className="left-title-row">
            <h3>My Profile</h3>
            <span className="left-title-line"></span>
          </div>

          <p className="welcome">Welcome back,</p>
          <p className="username">{profile.name}</p>

          <div className="badge">Verified User</div>
        </div>

        {/* RIGHT CARD */}
        <div className="right-card">
          <h3>Profile Details</h3>

          {[
            { label: "Name", value: profile.name, icon: <FiUser /> },
            { label: "Email", value: profile.email, icon: <FiMail /> },
            { label: "Mobile", value: profile.mobile, icon: <FiPhone /> },
          ].map((item, index) => (
            <div className="field" key={index}>
              <label className="field-label">
                {item.icon}
                {item.label}
              </label>
              <div className="field-value">{item.value}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Profile;
