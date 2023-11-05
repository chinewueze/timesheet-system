import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
export const Profile = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        firstname: '',
        lastname: '',
        middlename: '',
    });
    const accessToken = sessionStorage.getItem("access_token");
    useEffect(() => {
        const apiUrl = 'https://timesheet-api-main.onrender.com/user/account/personal-information/';
        const headers = {
            'x-api-key': 'a57cca53d2086ab3488b358eebbca2e7',
            Authorization: `Bearer ${accessToken}`,
        };
        fetch(apiUrl, { headers })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('API request failed with status code: ' + response.status);
                }
            })
            .then((data) => {
                setUserData(data.data);
            })
            .catch((error) => {
                console.error('An error occurred while making the API request: ' + error);
            });
    }, [accessToken]);
    const handleEditProfile = () => {
        setIsEditing(true);
    };
    const handleSaveProfile = () => {
        const editApiUrl = 'https://timesheet-api-main.onrender.com/user/account/personal-information/name';
        const editHeaders = {
            'x-api-key': 'a57cca53d2086ab3488b358eebbca2e7',
            Authorization: `Bearer ${accessToken}`,
        };

        // Make a PUT request to update the user's profile
        fetch(editApiUrl, {
            method: 'PUT',
            headers: editHeaders,
            body: JSON.stringify(editedData),
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('API request failed with status code: ' + response.status);
                }
            })
            .then((data) => {
                setUserData(data.data);
                setIsEditing(false); // Switch back to view mode after saving
            })
            .catch((error) => {
                console.error('An error occurred while making the API request: ' + error);
            });
    };
    return (
        <div className='w-screen h-screen'>
            <div className='w-full bg-[#232f3e] h-[10vh]  flex items-center'>
                <h1 className='text-2xl text-white font-bold mx-auto'> {!isEditing ? `User Profile` : "Edit Profile"}</h1>
                <button className="bg-blue-500 text-white rounded-md p-1 mr-3" onClick={() => navigate("/reports")} > Back </button>
            </div>"
            <div className='w-full h-90vh'>
                <div className=' mx-auto w-fit p-[5%] lg:mt-[3%] sm:mt-[5%] '>
                    {isEditing ? (
                        <div>
                            <input
                                className='outline-none border-2 border-solid border-black rounded'
                                type="text"
                                placeholder="First Name"
                                value={editedData?.firstname}
                                onChange={(e) => setEditedData({ ...editedData, firstname: e.target.value })}
                            />
                            <input
                                className='outline-none border-2 border-solid border-black rounded lg:my-0 sm:my-2 lg:mx-[2%] sm:mx-0'
                                type="text"
                                placeholder="Last Name"
                                value={editedData.lastname}
                                onChange={(e) => setEditedData({ ...editedData, lastname: e.target.value })}
                            />
                            <input
                                className='outline-none border-2 border-solid border-black rounded'
                                type="text"
                                placeholder="Middle Name (optional)"
                                value={editedData.middlename}
                                onChange={(e) => setEditedData({ ...editedData, middlename: e.target.value })}
                            />
                            <button onClick={handleSaveProfile} className="bg-gray-500 text-white rounded-md p-2 mx-[35%] mt-3">
                                Save Profile
                            </button>
                        </div>
                    ) : (
                        /* Render the profile data when isEditing is false */
                        <div>
                            <div>
                                <div>
                                    <h1 className="text-lg font-bold">First Name</h1>
                                </div>
                                <div className="h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md">
                                    <h2>{userData?.firstname}</h2>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h1 className="text-lg font-bold">Last Name</h1>
                                </div>
                                <div className="h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md mb-3">
                                    <h2>{userData?.lastname}</h2>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h1 className="text-lg font-bold">Middle Name</h1>
                                </div>
                                <div className="h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md mb-3">
                                    <h2>{userData?.middlename}</h2>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h1 className="text-lg font-bold">Email Address</h1>
                                </div>
                                <div className="h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md mb-3">
                                    <h2>{userData?.email}</h2>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold">Username</h1>
                                </div>
                                <div className="h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md mb-3">
                                    <h2>{userData?.username}</h2>
                                </div>
                            </div>
                            <button onClick={handleEditProfile} className="bg-gray-500 text-white rounded-md p-2 mx-[35%] mt-3">
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}