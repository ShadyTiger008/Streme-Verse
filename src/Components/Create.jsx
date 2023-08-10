import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data";
import { FaLocationDot } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import { Editor } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor";
import { fetchUser } from "../utils/fetchUser";
import {
  IoCloudUploadOutline,
  IoCheckmark,
  IoCloudUpload,
  IoTrash,
  IoWarning,
} from "react-icons/io5";

import Spinner from "./Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firebaseApp } from "../firebase-config";
import AlertMsg from "./AlertMsg";
import { doc, getFirestore, setDoc } from "firebase/firestore";


const Create = ({ theme }) => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Choose a Category");
  const [location, setLocation] = useState("");
  const [videoAsset, setVideoAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [alert, setAlert] = useState(true);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertIcon, setAlertIcon] = useState(null);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [userInfo] = fetchUser();


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setIsDropdownOpen(false);
  };

  const storage = getStorage(firebaseApp);
  const fireStoreDb = getFirestore(firebaseApp);

  const uploadVideo = (e) => {
    setLoading(true);
    const videoFile = e.target.files[0];
    const storageRef = ref(storage, `Videos/${Date.now()}-${videoFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoAsset(downloadURL);
          setLoading(false);
          setAlert(true);
          setAlertStatus("success");
          setAlertIcon(<IoCheckmark fontSize={25} />);
          setAlertMsg("Your video is uploaded to our server");
          setTimeout(() => {
            setAlert(false);
          }, 4000);
        });
      }
    );
  };

  const deleteVideo = () => {
    const deleteRef = ref(storage, videoAsset);
    deleteObject(deleteRef)
      .then(() => {
        setVideoAsset(null);
        setAlert(true);
        setAlertStatus("error");
        setAlertIcon(<IoWarning fontSize={25} />);
        setAlertMsg("Your video was removed from our server");
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDescriptionValue = () => {
    if (editorRef.current) {
      setDescription(editorRef.current.getContent());
    }
  };

  const uploadDetails = async () => {
    try {
      setLoading(true);
      if (!title && !category && !videoAsset) {
        setAlert(true);
        setAlertStatus("error");
        setAlertIcon(<IoWarning fontSize={25} />);
        setAlertMsg("Required Fields are missing!");
        setTimeout(() => {
          setAlert(false);
        }, 4000);
        setLoading(false);
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          userId: userInfo?.uid,
          category: category,
          location: location,
          videoUrl: videoAsset,
          description: description,
        };

        await setDoc(doc(fireStoreDb, "videos", `${Date.now()}`), data);
        setLoading(false);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {},[title, location, description, category]);

  return (
    <div className="flex justify-center items-center w-full min-h-[100vh] p-10">
      <div className="w-[90%] h-full border border-gray-300 rounded-md p-4 flex flex-col">
        {alert && (
          <AlertMsg status={alertStatus} msg={alertMsg} icon={alertIcon} />
        )}
        <input
          type="text"
          placeholder="Title"
          required
          aria-errormessage="Try another title"
          className={`font-[20] outline-none ${
            theme === "dark" ? "bg-slate-950" : ""
          }`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="w-full h-px bg-gray-300"></div>

        <div className="flex justify-between w-full gap-8 my-4">
          <div className="relative inline-block text-left w-1/2">
            <button
              onClick={toggleDropdown}
              type="button"
              className="btn bg-blue-400 p-2 w-full"
            >
              {category}
            </button>
            {isDropdownOpen && (
              <ul className="origin-top-right left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 w-full">
                {categories &&
                  categories.map((data) => (
                    <li
                      key={data.id}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex flex-row text-lg f"
                      onClick={() => handleCategorySelect(data.name)}
                    >
                      {data.iconSrc}&nbsp;&nbsp;{data.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="w-3/5 relative flex justify-center border border-gray-300">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {theme === "dark" ? <FaLocationDot /> : <GrLocation />}
            </span>
            <input
              type="text"
              placeholder="Location"
              className={`form-input block w-full pl-10 sm:text-sm sm:leading-5 outline-none ${
                theme === "dark" ? "bg-slate-950" : ""
              }`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="flex border border-gray-500 h-[400px] border-dashed w-full rounded-md overflow-hidden relative mb-5">
          {!videoAsset ? (
            <section className="w-full">
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div
                  className="flex flex-col items-center justify-center h-full w-full cursor-pointer"
                  onClick={() => {
                    if (!loading) {
                      document.getElementById("fileInput").click();
                    }
                  }}
                >
                  {loading ? (
                    <Spinner msg={"Uploading your video"} progress={progress} />
                  ) : theme === "dark" ? (
                    <>
                      <IoCloudUploadOutline fontSize={30} />
                      <p>Click here to upload</p>
                    </>
                  ) : (
                    <>
                      <IoCloudUpload fontSize={30} />
                      <p>Click here to upload</p>
                    </>
                  )}
                </div>
              </div>
              <input
                id="fileInput"
                type="file"
                name="Upload a Video"
                onChange={uploadVideo}
                style={{ display: "none" }}
                accept="video/mp4,video/x-m4v,video/*"
              />
            </section>
          ) : (
            // Render 'Nothing' when videoAsset is present
            <>
              <div className="relative w-full h-full">
                <div
                  className="flex justify-center items-center w-[40px] h-[40px] rounded-full bg-red-600 top-5 right-5 absolute cursor-pointer z-10"
                  onClick={deleteVideo}
                >
                  <IoTrash fontSize={20} color="white" />
                </div>
                <video
                  src={videoAsset}
                  controls
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </>
          )}
        </div>

        <Editor
          onChange={getDescriptionValue}
          onInit={(evt, editor) => (editorRef.current = editor)}
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
          init={{
            height: 500,
            width: "100%",
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            content_css: "dark",
            skin: "oxide-dark",
          }}
        />

        <button
          className={`flex mx-auto w-1/2 p-2 text-center my-5 rounded-xl ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-300 hover:bg-blue-500"
          } justify-center font-semibold`}
          onClick={uploadDetails}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="mr-2">Uploading</span>
              <svg
                className="animate-spin h-5 w-5 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                {/* Placeholder for the loading SVG */}
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291a7.962 7.962 0 01-2-4.59h2V17z"
                ></path>
              </svg>
            </>
          ) : (
            <p>Upload</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default Create;
