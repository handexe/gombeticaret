// components/FavoriteButton.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFavorite,
  setUserFavorites,
} from "../../redux/slices/favoriteSlices";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../api/api";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { MdOutlineDownloading } from "react-icons/md";
import Warning from '../Toast/Warning';

const FavoriteButton = ({ itemId }) => {
  const dispatch = useDispatch();
  const { userFavorites, loading } = useSelector((state) => state.favorites);
  const userId = useSelector((state) => state.auth.uid);
  const [showToast, setShowToast] = useState(false); // Toast state

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (userId) {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          dispatch(setUserFavorites(userData.favorites || []));
        }
      }
    };

    fetchUserFavorites();
  }, [dispatch, userId]);

  const handleFavoriteToggle = () => {
    if (userId) {
      dispatch(toggleFavorite({ userId, itemId }));
    } else {
      console.error("Kullanıcı bulunamadı");
      setShowToast(true); // Kullanıcı yoksa toast göster
    }
  };

  const isFavorited = userFavorites.includes(itemId);

  return (
    <>
      <Button
        onClick={handleFavoriteToggle}
        disabled={loading}
        variant="outline"
        className="ms-5">
        {loading ? (
          <MdOutlineDownloading size={20} />
        ) : isFavorited ? (
          <BsHeartFill size={20} className="text-light" />
        ) : (
          <BsHeart size={20} className="text-light" />
        )}
      </Button>
      <Warning toast={showToast} setShowToast={setShowToast} />
    </>
  );
};

export default FavoriteButton;
