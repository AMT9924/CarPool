import { useCallback } from 'react';
import styles from './authPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import { useForm } from '../../hooks/useForm';

export default function AuthPage() {
    const [signUpData, setSignUpData] = useForm({
            name: "",
            email: "",
            password: "",
            mobile: "",
            gender:'default',
            age:0
          });
    const navigate = useNavigate();

    const {signUpUser} = useAuthContext();

    const handleOnSubmit = useCallback(async (e)=>{
        e.preventDefault();
            const result = await signUpUser(signUpData);
            result && navigate('/signin')
    },[navigate, signUpData, signUpUser])

    const handleCancel = useCallback((e)=>{
        e.preventDefault();
        navigate('/welcome');
    },[navigate]);

    return <div className={styles.main}>
        <div className={styles.pageHead}>Sign Up</div>
        <form onSubmit={handleOnSubmit} className={styles.form}>
            <div className={styles.formItem}>
                <label htmlFor='name' className={styles.formLabel}>Name</label>
                <input type='text' id='name' placeholder='Enter name' value={signUpData.name} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='email' className={styles.formLabel}>Email</label>
                <input type='email' id='email' placeholder='Enter email' value={signUpData.email} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='password' className={styles.formLabel}>Password</label>
                <input type='password' id='password' placeholder='Create password' value={signUpData.password} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='mobile' className={styles.formLabel}>Mobile</label>
                <input type='tel' id='mobile' placeholder='Enter mobile' value={signUpData.mobile} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='age' className={styles.formLabel}>Age</label>
                <input type='number' id='age' placeholder='Enter age' value={signUpData.age} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='gender' className={styles.formLabel}>Gender</label>
                <select id='gender' defaultValue={signUpData.gender} onChange={setSignUpData} className={styles.formInput}>
                    <option value={'default'} disabled>Select gender</option>
                    <option value={'male'}>Male</option>
                    <option value={'female'}>Female</option>
                </select>
            </div>
            <div className={styles.buttonContainer}>
                <button type='submit' className={`${styles.button} ${styles.submitButton}`}>Sign up</button>
                <button className={styles.button} onClick={handleCancel}>Cancel</button>
                <div className={styles.switchMessage}>Already registered? <Link to={'/signin'}>Sign in</Link> here.</div>
            </div>
        </form>
    </div>
}