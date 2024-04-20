'use client'
import { error } from 'console';
import React, { useState } from 'react';

export default function TestJWT() {
    const [accessToken, setAccessToken] = useState("");
    const [user,setUser] = useState(null)
    const [unAuthorized,setUnAuthorized] = useState(false)
    //handle login
    const handleLogin = async ()=>{
        const email = "dimvipha96@gmail.com";
        const password = "vip123456";
        fetch(process.env.NEXT_PUBLIC_API_URL + "/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
        .then(data => {
            console.log("Data in jwt :",data)
            setAccessToken(data.accessToken)
            setUser(data.user)
        })
        .catch(error => {
            console.log(error);
        })
    }

    //handle patial update
    const handlePartialUpdate = async ()=>{
        const body = {
            name:"updated",
        };
      const res = await  fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/${400}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
        if(res.status === 401){
            setUnAuthorized(true)
        }

        const data = await res.json()
        console.log("Update data :",data)
    }

    //hanlde refresh token
    const handleRefreshToken = async()=>{
        fetch(process.env.NEXT_PUBLIC_API_URL + "/refresh",{
            method: "POST",
            credentials:"include",
            body: JSON.stringify({}),
        }).then((res)=>res.json())
        .then((data)=>{
            console.log("Data refresh token :",data)
             setAccessToken(data.accessToken)
            
        }).catch((error)=>{
            console.log(error)
        });
    }
  return (
    <main className='grid h-screen place-content-center'>
      <h1 className='text-4xl text-gray-800 font-bold'>Test Handle JWT</h1>
      <button onClick={handleLogin} className='mt-6 p-4 bg-blue-600 rounded-xl text-gray-100 text-2xl font-semibold'>Login</button>
      <button onClick={handlePartialUpdate} className='mt-6 p-4 bg-blue-600 rounded-xl text-gray-100 text-2xl font-semibold'>Update Patial</button>
      {unAuthorized && <button onClick={handleRefreshToken} className='my-4 p-4 bg-blue-600 rounded-xl text-gray-100 text-2xl font-semibold'>Refresh Token</button>}
    </main>
  );
}
