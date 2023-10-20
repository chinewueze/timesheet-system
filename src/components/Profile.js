import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
export const Profile = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        firstName: 'John ',
        lastName: 'Doe',
        middleName: 'Rawlings',
        email: 'johndoe@example.com',
        username: 'johndoe',
    });
    return (
        <div className='w-screen h-screen'>
            <div className='w-full bg-green-500 h-[10vh] justify-center flex items-center'>
                <h1 className='text-2xl font-bold'> User Profile</h1>
            </div>
            <div className='w-full h-90vh'>
                <div className=' mx-auto w-fit p-[5%] lg:mt-[3%] sm:mt-[5%] '>
                    <div>
                        <div>
                            <h1 className='text-lg font-bold'> First Name </h1>
                        </div>
                        <div className=' h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md'>
                            <h2>
                                {user.firstName}
                            </h2>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1 className='text-lg font-bold'> Last Name </h1>
                        </div>
                        <div className=' h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md mb-3'>
                            <h2> {user.lastName} </h2>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1 className='text-lg font-bold'> Middle Name </h1>
                        </div>
                        <div className=' h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md mb-3'>
                            <h2> {user.middleName} </h2>
                        </div>
                    </div>
                    <div>
                        <div>
                           <h1 className='text-lg font-bold'> Email Address </h1>
                        </div>
                        <div className=' h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md mb-3'>
                            <h2> {user.email} </h2>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1 className='text-lg font-bold'> Username </h1>
                        </div>
                        <div className=' h-[35px] bg-gray-200 w-[355px] pl-5 pt-1 text-md font-semibold rounded-md mb-3'>
                            <h2> {user.username} </h2>
                        </div>
                    </div>
                    <button
                    onClick={ () => navigate("/edit") }
                     className='bg-green-500 text-white rounded-md p-2 mx-[35%] mt-3'
                     >
                        Edit profile
                    </button>
                </div>
            </div>
        </div>
    )
}