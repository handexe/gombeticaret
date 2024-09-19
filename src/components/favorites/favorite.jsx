// components/FavoriteButton.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, setUserFavorites } from '../../redux/slices/favoriteSlices';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../api/api';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import { MdOutlineDownloading } from 'react-icons/md';

const FavoriteButton = ({ itemId }) => {
  const dispatch = useDispatch();
  const { userFavorites, loading } = useSelector((state) => state.favorites);
  const userId = useSelector((state) => state.auth.uid);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (userId) {
        const userRef = doc(db, 'users', userId);
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
      console.error('User ID is missing');
    }
  };

  const isFavorited = userFavorites.includes(itemId);

  return (
    <Button
      onClick={handleFavoriteToggle}
      disabled={loading} // Disable only when loading
      variant="link"
    >
      {loading ? (
        <MdOutlineDownloading />
      ) : isFavorited ? (
        <BsHeartFill size={20} className="text-light" />
      ) : (
        <BsHeart size={20} className="text-light" />
      )}
    </Button>
  );
};

export default FavoriteButton;
