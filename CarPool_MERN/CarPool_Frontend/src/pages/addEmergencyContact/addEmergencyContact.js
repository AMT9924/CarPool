import { useNavigate } from 'react-router-dom';
import styles from './addEmergency.module.css';
import { useCallback, useEffect } from 'react';
import { useAuthContext } from '../../context/authContext';
export default function AddEmergencyContacts(){
  const {user, emergencyContacts, setEmergencyContacts, handleOnChange, updateEmergencyContacts} = useAuthContext();
    const navigate = useNavigate();
    const goBack = useCallback(()=>{
                navigate(-1);
            },[navigate])
        
    const handleOnSubmit = useCallback(async(e)=>{
      e.preventDefault();
      await updateEmergencyContacts();
      navigate(-1);
    },[updateEmergencyContacts, navigate])
    const handleAddMore = useCallback(()=>{
      setEmergencyContacts([...emergencyContacts, {friendlyName:"", email:"", contact:""}])
    },[emergencyContacts, setEmergencyContacts])
    useEffect(()=>{
      setEmergencyContacts(user?.emergencyContacts?[...user?.emergencyContacts]:[{friendlyName:"", email:"", contact:""}])
    },[user, setEmergencyContacts])
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <button onClick={goBack} className={styles.backButton}>
            <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
          </button>
          <div className={styles.pageHead}>Add Emergency Contacts</div>
        </div>
        <form onSubmit={handleOnSubmit} className={styles.contactForm}>
          {emergencyContacts.map((contact, index)=><div key={index} className={styles.contactContainer}>
            <div className={styles.formItem}>
              <i className="fi fi-tr-id-card-clip-alt"></i>
              <input type='text' name='friendlyName' value={contact.friendlyName} onChange={(e)=>{handleOnChange(e,index)}} required placeholder='Enter name' className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
            <i className="fi fi-tr-at"></i>
              <input type='email' name='email' value={contact.email} onChange={(e)=>{handleOnChange(e,index)}} required placeholder='Enter email' className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
            <i className="fi fi-tr-mobile-button"></i>
              <input type='tel' name='contact' value={contact.contact} onChange={(e)=>{handleOnChange(e,index)}} required placeholder='Enter Mobile' className={styles.formInput}/>
            </div>
          </div>)}
          <div className={styles.buttonContainer}>
            {emergencyContacts.length<2 && <button type='submit' onClick={handleAddMore} className={`${styles.button} ${styles.addButton}`}>Add more</button>}
            <button type='submit' className={styles.button}>Update contacts</button>
          </div>
        </form>

      </div>
    );
}