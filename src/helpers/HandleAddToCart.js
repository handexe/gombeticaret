import { addToCart } from "../redux/slices/cartSlices";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../api/api";


const HandleAddToCart = async (item, dispatch, user, showToast, setShowToast) => {
  
  if (!item) {
    console.error("Ürün bilgileri bulunamadı");
    
    return;
  }

  console.log("Item:", item);
  console.log("User:", user);

  if (!user) {
    console.error("Kullanıcı girişi bulunamadı");
    setShowToast(true); // Warning bileşenine gösterilecek şekilde state'i güncelle

    return;
  }

  let userId = user; // Kullanıcının ID'sini Redux state'inden alın
  let imageUrl = item.image;

  if (!imageUrl) {
    try {
      const imageRef = ref(storage, `images/${item.id}`);
      imageUrl = await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Resim alınırken hata meydana geldi ", error);
      alert("Ürün resmi alınırken bir hata oluştu.");
      return;
    }
  }

  try {
    await dispatch(
      addToCart({
        productId: item.id,
        quantity: 1,
        userId: userId,
        name: item.name,
        image: imageUrl,
        price: item.price,
      })
    );

    alert(`${item.name} sepete eklendi`);
  } catch (error) {
    console.error("Ürün sepete eklenirken bir hata oluştu: ", error);
    alert("Ürün sepete eklenirken bir hata oluştu.");
  }
};

export default HandleAddToCart;
