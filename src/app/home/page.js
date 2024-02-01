"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import './home.css'
function Data() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    function fetchData() {
      setIsLoading(true);
      axios({
        method: "GET",
        url: "/api/backend",
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        if (res.data.status === 200) {
          setData(res.data.data);
          setIsLoggedIn(true);
          console.log("Session will be terminated after half an hour")
        } else {
          console.log(res.data.status, res.data.msg);
          alert("Authorization Failed, Please Login Again");
          router.push("/");
        }
        setIsLoading(false);
      });
    }
    fetchData();
  }, []);
  function LogoutHandler() {
    axios({
      method: "DELETE",
      url: "/api/backend",
      headers: { "Content-Type": "multipart/form-data" },
    }).then(router.replace("/"));
    alert("Logged Out Successfully");
    setIsLoggedIn(false);
  }
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      {!isLoggedIn && !isLoading && <h1>Unauthorized Access</h1>}
      {isLoading && (<h1>Fetching Data...</h1>)}
      {isLoggedIn && (
        <div className="max-w-[98%]  flex flex-col justify-center items-center gap-5 ">
          <table id="data-table" className="text-[9px] sm:text-[15px] border-[--theme-color] border-solid border-2">
            <thead className="bg-[--theme-color] text-white">
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Password Hash</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr className="h-[20px] sm:h-[40px]" key={index}>
                    <td>{item.userid}</td>
                    <td>{item.role}</td>
                    <td>{item.password_hash}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button onClick={LogoutHandler}
          className="my-1 self-start hover:bg-blue-600 bg-blue-500 active:bg-blue-700 px-[20px] py-[6px] rounded-sm text-white"
          >Logout</button>
        </div>
      )}
    </div>
  );
}
export default Data;
