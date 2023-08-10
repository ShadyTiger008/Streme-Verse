import React from "react";
import MusicBg from "../img/musicbg.jpg";
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const firebaseAuth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const firebaseDb = getFirestore(firebaseApp);

  const navigate = useNavigate();
  const login = async () => {
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { refreshToken, providerData } = user;
    console.log(refreshToken, providerData); 
    localStorage.setItem('user', JSON.stringify(providerData));
    localStorage.setItem('accessToken', JSON.stringify(refreshToken));

    await setDoc(doc(firebaseDb, 'users', providerData[0].uid),providerData[0]);
    navigate('/', {replace: true});
  };
  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh] relative">
      <img src={MusicBg} alt="" className="object-cover w-full h-full" />
      <div className="flex absolute w-[100vw] h-[100vh] bg-white/20 top-0 left-0 justify-center items-center">
        <button className="flex justify-center items-center shadow-lg space-x-2 px-5 py-2 rounded-lg bg-white/40 hover:bg-white/60" onClick={() => login()}>
          <FcGoogle fontSize={"25px"} />
          <p className="text-white font-semibold">Sign in with Google</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
