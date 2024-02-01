import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { Md5 } from "ts-md5";
import { decrypt, encrypt } from "@/helpers/crypto";
import supabase from "@/config/dbConfig";
async function userAuth(user) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("userid", user.username);
    if (!data.length) {
      console.log("User not found");
      return { status: 401, msg: "Invalid Username or Password" };
    }
    const hashed_password = await Md5.hashStr(user.password);
    if (hashed_password === data[0].password_hash) {
      console.log("User Authenticated");
      return { status: 200,msg:"Invalid Username or Password"};
    }
    else{
        return {status:401,msg:"Invalid Username or Password"}
    }
}
async function fetchData(user) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("userid", user.username);
  if (!data.length) {
    console.log("User not found");
    return { status: 401, msg: "Unauthorized Access" };
  }
  const hashed_password = await Md5.hashStr(user.password);
  if (hashed_password === data[0].password_hash && data[0].role !== "admin") {
    console.log("User Authenticated");
    return { status: 200, data: data };
  }
  if (hashed_password !== data[0].password_hash) {
    console.log("Wrong Password");
    return { status: 401, msg: "Unauthorized Access" };
  }
  if (data[0].role == "admin") {
    console.log("Admin User Active")
    const { data, error } = await supabase.from("users").select("*");
    return { status: 200, data: data };
  }
  if (error) {
    return { status: 500, msg: error };
  }
}
export async function POST(req) {
  const user = await req.json();

  const response = await userAuth(user);
  if (response.status===200){
    const userdetails = user.username + "&password=" + user.password;
    const encrypted = await encrypt(userdetails);
  
    cookies().set("userdetails", encrypted, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: "1800",
    });
  }
  return NextResponse.json(response);
}
export async function GET(req,res){
    const cookie = await cookies().get("userdetails");
    if (typeof(cookie)==="undefined"){
    return NextResponse.json({status:401,msg:"Session Timeout"});
    }
    try{
    await decrypt(cookie.value);
    }
    catch(err){
      console.log(err)
      cookies().delete("userdetails");
      return NextResponse.json({status:401,msg:"Unauthorized Access"});
    }
    const userdetails = await decrypt(cookie.value);
    const user = {
        username:userdetails.split("&password=")[0],
        password:userdetails.split("&password=")[1]
    }
    console.log(user)
    const response = await fetchData(user);
  if (response.status!=200){
  cookies().delete("userdetails");
  }
  return NextResponse.json(response);
}
export async function DELETE(){
  cookies().delete("userdetails");
  return NextResponse.json({status:200,msg:"Logout Successful"});
}