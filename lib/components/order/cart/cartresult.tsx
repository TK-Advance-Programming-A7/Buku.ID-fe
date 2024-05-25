"use client"
import React from 'react'
import { useState } from 'react';

const trackingform = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const[status,setStatus] = useState("");

    const fetchOrders = async (e: any) => {
        e.preventDefault();
        const idUser = e.target.idUser.value;
        const statusUser = e.target.statusUser.value;
        const orders = await getOrders(idUser, statusUser);
        if (orders === "No Order Found") {
            setStatus("");
            return;
        } else{
            setStatus(orders);
            console.log(orders);
        }
    }

    const getOrders = async (idUser: number, status: string) => {
        const requestBody = {
            idUser: idUser, // Example user ID
            status: status // Example status
        };

        const response = await fetch("http://localhost:8080/api/v1/order/users/status", {
            method: 'POST', // Assuming your endpoint uses POST method
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            cache: 'no-store'
        });
        if (!response.ok) {
            return "No Order Found";
        }
        return response.json();
    }

    return (
        <div>
            <title>Tracking Form</title>
            <h2>Track Your Order Here</h2>
            <form onSubmit={fetchOrders}>
                <div className='flex flex-col py-10 px-20 border-gray-500 border-2 items-center'>
                    <label className=' text-center'>Order Id:</label>
                    <br></br>
                    <input className=' h-12 w-[550px] bg-gray-200 rounded-xl border border-black border-opacity-50 px-2 text-sm'
                           type="text" id="idUser" name="idUser" required placeholder='Contoh : ceaf99ff-dafe-47d2-b6f7-efdab07c6eb8'></input>
                    <br></br>

                    <button className=' bg-blue-300 rounded-full h-10 w-[100px] text-white font-medium' type="submit">Track</button>
                </div>
            </form>
            {/*<TrackingResult result={status}/>*/}
        </div>
    )
}

export default trackingform