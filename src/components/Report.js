import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export const Report = () => {
    const [formData, setFormData] = useState({
        date: "",
        project: "",
        task: "",
        status: "",
        duration: "",
        link: "",
    });

    const [isOnline, setIsOnline] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDisplayDuration, setModalDisplayDuration] = useState(4500);
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
    const [reportEntries, setReportEntries] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const accessToken = sessionStorage.getItem("access_token");
    const userId = sessionStorage.getItem("user_id");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const navigate = useNavigate()
    const handleLogout = () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('user_id');
        navigate('/login')
    }

    const fetchReportData = async () => {
        try {
            const response = await fetch(`https://timesheet-api-main.onrender.com/view/reports/${userId}`, {
                method: "GET",
                headers: {
                    "x-api-key": "a57cca53d2086ab3488b358eebbca2e7",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setReportData(data.data.report);
            } else {
                console.log('user_id')
                console.error("Failed to fetch report data. Status:", response.status);
            }
        } catch (error) {
            console.error("An error occurred while fetching report data:", error);
        }
    };
    useEffect(() => {
        fetchReportData();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (!isOnline) {
            setIsModalOpen(true);
            setLoading(false)
            return;
        }

        const requestData = {
            date: formData.date,
            project: formData.project,
            task: formData.task,
            link: formData.link,
            status: formData.status,
            duration: formData.duration,
        };

        try {
            const response = await fetch('https://timesheet-api-main.onrender.com/record/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'a57cca53d2086ab3488b358eebbca2e7',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestData),
            });

            if (response.status === 201) {
                setReportEntries([...reportEntries, requestData]);
                fetchReportData();
                console.log("Response:", response)
                console.log('Report submitted successfully.');
            } else {
                alert('Report submission failed.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false);
        }
        setFormData({
            date: "",
            project: "",
            task: "",
            status: "",
            duration: "",
            link: "",
        });
    }
    const handleEdit = (data) => {
        setEditMode(true);
        setFormData(data);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setFormData({
            date: "",
            project: "",
            task: "",
            status: "",
            duration: "",
            link: "",
        });
    };
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formattedDate = new Date(formData.date).toISOString().split('T')[0];
        const requestData = {
            date: formattedDate,
            project: formData.project,
            task: formData.task,
            link: formData.link,
            status: formData.status,
            duration: formData.duration,
        };
        try {
            const response = await fetch('https://timesheet-api-main.onrender.com/record/report', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'a57cca53d2086ab3488b358eebbca2e7',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestData),
            });
            if (response.status === 200) {
                const updatedReportEntries = reportData.map(report => {
                    if (report.id === formData.id) {
                        return { ...requestData, id: report.id };
                    }
                    return report;
                });
                setReportData(updatedReportEntries);
                console.log('Report updated successfully.');
                fetchReportData();
            } else {
                alert('Report update failed.');
                console.log("Respose:", response)
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false);
        }
        setEditMode(false);
        setFormData({
            date: "",
            project: "",
            task: "",
            status: "",
            duration: "",
            link: "",
        });
    };
    return (
        <div>
            <Helmet>
                <title> REPORTS </title>
                <link rel="icon" type="image/png" href="./assets/Images/adviewicon.png" />
            </Helmet>
            <div className='flex  w-full h-[75px] justify-end items-center bg-[#232f3e]'>
                <div className='flex p-5'>
                    <div className="">
                        <button className="bg-blue-500 text-white rounded-md p-1 mr-3" onClick={() => navigate("/profile")} > View profile </button>
                    </div>
                    <div className="">
                        <button className="bg-blue-500 text-white rounded-md p-1 mr-[3%]" onClick={handleLogout} > LOGOUT </button>
                    </div>
                </div>
            </div>
            <div>
                {isModalOpen && !isOnline && (
                    <div className=" inset-0 flex items-center justify-center relative">
                        <div className="bg-white p-6 rounded-lg w-4/6 absolute top-7">
                            <p className="text-lg font-semibold mb-4 text-center">No network/WiFi detected!</p>
                        </div>
                    </div>
                )}
                <div className=" border lg:w-3/5 sm:w-4/5  mt-[3%] rounded   lg:mx-[20%] sm:mx-[10%] bg-white ">
                    <p> <h1 className="text-center text-2xl font-semibold font-mono"> {!editMode ? "Add Report" : "Edit Report"}</h1> </p>
                    {editMode ? (
                        <div>
                            <div className="mx-[5%] my-[5%]">
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <div className="mx-[5%] my-[5%]">
                                <input
                                    type="text"
                                    id="project"
                                    name="project"
                                    value={formData.project}
                                    onChange={handleChange}
                                    placeholder="Project"
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <div className="mx-[5%] my-[5%]">
                                <input
                                    type="text"
                                    id="task"
                                    name="task"
                                    value={formData.task}
                                    onChange={handleChange}
                                    placeholder="Task"
                                    className=" outline-none w-4/5  p-2 border-2 border-gray-500 rounded-md "
                                />
                            </div>
                            <div className="mx-[5%] my-[5%]">
                                <input
                                    id='status'
                                    name='status'
                                    value={formData.status}
                                    type="text"
                                    onChange={handleChange}
                                    placeholder="Status"
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <div className="mx-[5%] mt-[5%] mb-[2%]">
                                <input
                                    id="duration"
                                    name='duration'
                                    value={formData.duration}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Duration"
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <div className="mx-[5%] mt-[5%] mb-[2%]">
                                <input
                                    id="link"
                                    name='link'
                                    value={formData.link}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Link"
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <div className=' w-[65%] p-2 mx-auto flex justify-evenly  '>
                                <button
                                    className="bg-blue-500  p-2  rounded-lg"
                                    onClick={handleSaveChanges}
                                    disabled={loading}
                                >
                                    {loading ? (<div> <FontAwesomeIcon icon={faSpinner} spin />  <span> Submitting </span> </div>
                                    ) : (
                                        "Save changes"
                                    )}
                                </button>
                                <button
                                    className="bg-gray-500  p-2 rounded-lg"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mx-[5%] my-[5%]">
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <div className="mx-[5%] my-[5%]">
                                <input
                                    type="text"
                                    id="project"
                                    name="project"
                                    value={formData.project}
                                    onChange={handleChange}
                                    placeholder="Project"
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <div className="mx-[5%] my-[5%]">
                                <input
                                    type="text"
                                    id="task"
                                    name="task"
                                    value={formData.task}
                                    onChange={handleChange}
                                    placeholder="Task"
                                    className=" outline-none w-4/5  p-2 border-2 border-gray-500 rounded-md "
                                />
                            </div>
                            <div className="mx-[5%] my-[5%]">
                                <input
                                    id='status'
                                    name='status'
                                    value={formData.status}
                                    type="text"
                                    onChange={handleChange}
                                    placeholder="Status"
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <div className="mx-[5%] mt-[5%] mb-[2%]">
                                <input
                                    id="duration"
                                    name='duration'
                                    value={formData.duration}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Duration"
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <div className="mx-[5%] mt-[5%] mb-[2%]">
                                <input
                                    id="link"
                                    name='link'
                                    value={formData.link}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Link"
                                    className=" w-4/5  p-2 border-2 border-gray-500 rounded-md  outline-none "
                                />
                            </div>
                            <button
                                className=" bg-gray-400 mx-[33%] my-[5%]  p-1 w-32 rounded-lg"
                                disabled={loading}
                            >
                                {loading ? (<div> <FontAwesomeIcon icon={faSpinner} spin />  <span> Submitting </span> </div>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </form>
                    )}
                </div>
                <div className='my-[5%]  sm:overflow-x-scroll lg:overflow-x-hidden '>
                    <table className=' mx-auto'>
                        <thead>
                            <th className='border-2 border-solid border-black p-1'> S/N </th>
                            <th className='border-2 border-solid border-black p-1'> DATE </th>
                            <th className='border-2 border-solid border-black p-1'> PROJECT </th>
                            <th className='border-2 border-solid border-black p-1'> TASK </th>
                            <th className='border-2 border-solid border-black p-1'> STATUS </th>
                            <th className='border-2 border-solid border-black p-1'> DURATION </th>
                            <th className='border-2 border-solid border-black p-1'> LINK </th>
                        </thead>
                        <tbody>
                            {Object.keys(reportData).map((dayOfWeek, index) => {
                                const report = reportData[dayOfWeek];
                                if (!report) {
                                    return null;
                                }
                                return (
                                    <tr key={index}>
                                        <td className="border-2 border-solid border-black p-3 ">{index + 1}</td>
                                        <td className="border-2 border-solid border-black p-3 "> {new Date(report.date).toDateString()}</td>
                                        <td className="border-2 border-solid border-black p-3 ">{report.project}</td>
                                        <td className="border-2 border-solid border-black p-3 ">{report.task}</td>
                                        <td className="border-2 border-solid border-black p-3 ">{report.status}</td>
                                        <td className="border-2 border-solid border-black p-3 ">{report.duration}</td>
                                        <td className="border-2 border-solid border-black p-3 text-blue-500">
                                            <a href={report.link.startsWith("http") ? report.link : `http://${report.link}`} target="_blank" rel="noopener noreferrer">{report.link}</a>
                                        </td>
                                        <td className="border-2 border-solid border-black p-3">
                                            <button
                                                className="bg-gray-500 text-white p-2 rounded-lg w-20 mx-2 cursor-pointer"
                                                onClick={() => handleEdit(report)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
