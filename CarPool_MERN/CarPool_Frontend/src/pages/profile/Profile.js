import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import styles from './profile.module.css';
import { useCallback } from 'react';
export default function Profile() {
    const {user, logoutUser} = useAuthContext();
    const navigate = useNavigate();
    const handleAddEmergency = useCallback(()=>{
      navigate('/addEmergency')
    },[navigate])
    return (
      <div className={styles.main}>
        <div className={styles.pageHeader}>Profile</div>
        <div className={styles.info}>
          <div className={styles.infoContainer}>
          <i className="fi fi-tr-id-card-clip-alt"></i>
            <div className={styles.infoItem}>
                <div className={styles.infoKey}>Name</div>
                <div className={styles.infoValue}>{user?.name}</div>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <i className="fi fi-tr-mobile-button"></i>
            <div className={styles.infoItem}>
                <div className={styles.infoKey}>Mobile</div>
                <div className={styles.infoValue}>{user?.mobile}</div>
            </div>
          </div>
          <div className={styles.infoContainer}>
          <i className="fi fi-tr-at"></i>
            <div className={styles.infoItem}>
                <div className={styles.infoKey}>Email</div>
                <div className={styles.infoValue}>{user?.email}</div>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <i className="fi fi-tr-venus-mars"></i>
            <div className={styles.infoItem}>
                <div className={styles.infoKey}>Gender</div>
                <div className={styles.infoValue}>{user?.gender}</div>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <i className="fi fi-tr-age"></i>
            <div className={styles.infoItem}>
                <div className={styles.infoKey}>Age</div>
                <div className={styles.infoValue}>{user?.age}</div>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <i className="fi fi-tr-address-book"></i>
            <div className={styles.infoItem}>
                <div className={styles.infoKey}>Emergency contacts</div>
                {user?.emergencyContacts?.length>0 ? user?.emergencyContacts?.map((contact, index)=>
                  <div key={index} className={styles.contact}>
                    <div>{contact.friendlyName}</div>
                    <div>{contact.email}</div>
                    <div>{contact.contact}</div>
                  </div>
                ): "No emergency contacts added"}
            </div>
          </div>
        </div>

        <div className={styles.profileActions}>
            <button onClick={handleAddEmergency} className={`${styles.button} ${styles.updateButton}`}>Add Emergency Contact</button>
            <button onClick={logoutUser} className={`${styles.button} ${styles.cancelButton}`}>Logout</button>
        </div>
      </div>
    );
}