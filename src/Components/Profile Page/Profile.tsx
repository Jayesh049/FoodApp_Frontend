import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/profile.css';
import { useAuth } from '../Context/AuthProvider';

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profileBox" data-testid="profile-page">
        <div className="profileDetails">
          <h1 className="h1">Profile</h1>
          <div className="line" />
          <p className="profile-muted">Please log in to view your profile.</p>
          <Link to="/login" className="custom__button profile-cta">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profileBox" data-testid="profile-page">
      <div className="profileDetails">
        <p className="profile-eyebrow">Your account</p>
        <h1 className="h1">Profile</h1>
        <div className="line" />
        <div className="profileImg">
          <img src={user.pic || '/logo192.png'} alt={user.name || 'Profile'} />
        </div>
        <div className="userDetail">
          <div className="profdetail">
            <h3>Name</h3>
            <p>{user.name}</p>
          </div>
          <div className="profdetail">
            <h3>Email</h3>
            <p>{user.email}</p>
          </div>
          {user.role && (
            <div className="profdetail">
              <h3>Role</h3>
              <p>{user.role}</p>
            </div>
          )}
        </div>
        <div className="profile-actions">
          <Link to="/allPlans" className="custom__button">
            Browse plans
          </Link>
          <Link to="/review" className="profile-link">
            Your reviews
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
