import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDisplayDuration, setModalDisplayDuration] = useState(4500);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [formData, setFormData] = useState({
        emailAddress: "",
        userPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    useEffect(() => {
        if (isModalOpen) {
            const modalCloseTimer = setTimeout(() => {
                setIsModalOpen(false);
            }, modalDisplayDuration);
            return () => clearTimeout(modalCloseTimer);
        }
    }, [isModalOpen]);
    const checkNetworkStatus = () => {
        setIsOnline(navigator.onLine);
    };
    useEffect(() => {
        checkNetworkStatus();
        window.addEventListener("online", checkNetworkStatus);
        window.addEventListener("offline", checkNetworkStatus);
        return () => {
            window.removeEventListener("online", checkNetworkStatus);
            window.removeEventListener("offline", checkNetworkStatus);
        };
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const [error, setError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (!isOnline) {
            setIsModalOpen(true);
            return;
        }
        if (formData.emailAddress.trim() === '' || formData.userPassword.trim() === '') {
            setError(true);
            setLoading(false)
        } else {
            setError(false)
        }
        const requestData = {
            email: formData.emailAddress,
            password: formData.userPassword,
        };
        try {
            const response = await fetch('https://timesheet-api-main.onrender.com/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'a57cca53d2086ab3488b358eebbca2e7',
                },
                body: JSON.stringify(requestData),
            });
            if (response.status === 200) {
                const responseData = await response.json();
                sessionStorage.setItem('accessToken', responseData.accessToken);
                navigate("/reports");
                console.log("valid ");
            } else {
                setError(true);
                setModalMessage("Invalid Email address/password⚠️");  
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                }, 5000);
                setLoading(false);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again later.';
            setErrorMessages([errorMessage]);
        } finally {
            setLoading(false);
            setError(false);
        }
        setFormData((prevData) => ({
            ...prevData,
            password: '',
        }));
    }
    return (
        <div className="w-full h-screen bg-green-500 relative">
            <Helmet>
                <title> SIGN IN </title>
                <link rel="icon" type="image/png" href="./assets/Images/login-icon.jpeg" />
            </Helmet>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center relative">
                    <div className="bg-white p-6 rounded-lg w-5/6 absolute top-7">
                        <p className="text-lg font-semibold mb-4 text-center"> {modalMessage}</p>
                    </div>
                </div>
            )}
            {isModalOpen && !isOnline && (
                <div className="fixed inset-0 flex items-center justify-center relative">
                    <div className="bg-white p-6 rounded-lg w-4/6 absolute top-7">
                        <p className="text-lg font-semibold mb-4 text-center">No network/WiFi detected!</p>
                    </div>
                </div>
            )}
            <div className=" border lg:w-3/5 sm:w-4/5  mb-2  rounded absolute top-[20%]  lg:mx-[20%] sm:mx-[10%] bg-white ">
                <p> <h1 className="text-center text-2xl font-semibold font-mono"> LOGIN </h1> </p>
                <form onSubmit={handleSubmit}>
                    <div className="mx-[5%] my-[5%]">
                        <input
                            type="text"
                            id="emailAddress"
                            name="emailAddress"
                            value={formData.emailAddress}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className={`w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none ${error && formData.emailAddress.trim() === '' ? 'border-red-500' : ''} `}
                        />
                        {error && formData.emailAddress.trim() === '' && <p className='text-red-500 text-center'>   Email address is required </p>}
                    </div>
                    <div className="mx-[5%] my-[5%]">
                        <input
                            id='userPasword'
                            name='userPassword'
                            value={formData.userPassword}
                            type={showPassword ? "text" : "password"}
                            onChange={handleChange}
                            placeholder="Password"
                            className={` w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none ${error && formData.userPassword.trim() === '' ? 'border-red-500' : ''}`}
                        />
                        <span
                            className="absolute  sm:left-[67%] lg:left-[70%] bottom-[37%] transform -translate-y-1/2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                        {error && formData.userPassword.trim() === '' && <p className='text-red-500 text-center'>   Password is required </p>}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className=" bg-green-600 lg:mx-[45%] sm:mx-[25%] mt-2  p-1 w-32 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? (<div> <FontAwesomeIcon icon={faSpinner} spin />  <span> Sign In </span> </div>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                    <h2 className='text-center my-[1%] font-serif'>
                        Don't have an account? <Link to="/" className='text-blue-600 font-semibold'> SIGN UP </Link>
                    </h2>
                </form>
            </div>
        </div>
    )
}
