"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
function page() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [inputType, setInputType] = useState("password");
  async function formHandler(e) {
    e.preventDefault();
    if (userDetails.username === "" || userDetails.password === "") {
      return;
    }
    try {
    await axios({
        method: "POST",
        url: "/api/backend",
        data: JSON.stringify(userDetails),
        headers: { "Content-Type": "multipart/form-data" },
      }).then(res=>{
        if (res.data.status === 200) {
          router.push("/home");
        }
        else{
          console.log(res.data.status,res.data.msg)
          alert(res.data.msg)
        }
      })
    } catch (err) {
      console.log(err);
    }

  }
  useEffect(() => {
    if (isVisible) {
      setInputType("text");
    } else {
      setInputType("password");
    }
  }, [isVisible]);
  return (
    <div
      id="main-container"
      className="flex justify-center items-center h-[100vh]"
    >
      <div
        id="login-box"
        style={{boxShadow:"0px 0px 10px 0px rgba(0,0,0,0.2"}}
        className=" rounded-lg bg-[#f7f7f7] w-[90%] max-w-[400px] h-[300px] flex flex-col justify-start items-center"
      >
        <h1 className="text-[--theme-color] font-bold text-xl p-5 uppercase">Login Portal</h1>
        <form
          onSubmit={formHandler}
          className="w-[80%] h-[70%] flex flex-col justify-evenly items-center"
        >
          <label htmlFor="username" className="imp self-start">
            Username
          </label>
          <input
            required
            spellCheck={false}
            value={userDetails.username}
            onChange={(e) =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
            id="username"
            className=" text-sm focus:outline-none w-full h-[40px] p-5 rounded-md"
            type="text"
            name="username"
            placeholder="Enter Username"
          />
          <label htmlFor="password" className="pt-1 imp self-start">
            Password
          </label>
          <input
            required
            spellCheck={false}
            value={userDetails.password}
            onChange={(e) =>
              setUserDetails({ ...userDetails, password: e.target.value })
            }
            id="password"
            className="text-sm focus:outline-none w-full h-[40px] p-5 rounded-md"
            type={inputType}
            name="password"
            placeholder="Enter Password"
          />
          <div className="w-full flex flex-row-reverse items-center justify-end py-2 px-1 gap-2 ">
            <label htmlFor="visible" className="text-sm cursor-pointer select-none">
              Show Password
            </label>
            <input
              type="checkbox"
              className="size-[16px] cursor-pointer"
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
              name="visible"
              id="visible"
            />
          </div>
          <button
            type="submit"
            className="my-1 self-start hover:bg-blue-600 bg-blue-500 active:bg-blue-700 px-[20px] py-[6px] rounded-sm text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default page;
