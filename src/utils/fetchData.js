import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";

// Fetch all docs from firebase
export const getAllFeeds = async (firestoreDb) => {
  const feeds = await getDocs(
    query(collection(firestoreDb, "videos"), orderBy("id", "desc"))
  );
  return feeds.docs.map((doc) => doc.data());
};

// fetch user data using user uid

export const getUserInfo = async (firestoreDb, userId) => {
  const userRef = doc(firestoreDb, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return "No such document";
  }
};

// fetch the specific Video
export const getSpecificVideo = async (firestoreDb, videoId) => {
  try {
    const videoRef = doc(firestoreDb, "videos", videoId);

    const videoSnap = await getDoc(videoRef);
    console.log("Video Snapshot:", videoSnap); // Log the snapshot

    if (videoSnap.exists()) {
      console.log("Video Data:", videoSnap.data()); // Log the data
      return videoSnap.data();
    } else {
      console.log("Video does not exist");
      return "No Such Document";
    }
  } catch (error) {
    console.error("Error fetching video:", error);
    return "Error fetching video";
  }
};

// Delete video
export const deleteVideo = async (fireStoreDb, videoId) => {
  await deleteDoc(doc(fireStoreDb, "videos", videoId));
};

// Get recommended feeds
export const recommendedFeed = async (firestoreDb, categoryId, videoId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, "videos"),
      where("category", "==", categoryId),
      where("id", "!=", videoId),
      orderBy("id", "desc")
    )
  );

  return feeds.docs.map((doc) => doc.data());
};

// useruploaded videos
export const userUploadedVideos = async (firestoreDb, userId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, "videos"),
      where("userId", "==", userId),
      orderBy("id", "desc")
    )
  );

  return feeds.docs.map((doc) => doc.data());
};

//category Feeds
export const categoryFeeds = async (firestoreDb, categoryId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, "videos"),
      where("category", "==", categoryId),
      orderBy("id", "desc")
    )
  );

  console.log("Fetched feeds:", feeds.docs.length); // Check the length of fetched documents

  return feeds.docs.map((doc) => doc.data());
};

