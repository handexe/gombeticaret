import React from "react";
import ProductActions from "../components/admin/ProductsActions";
import UpdatePrice from "../components/admin/UpdatePrice";
const Admin = () => {
  return (
    <div>
      <UpdatePrice />
      <hr/>
      <hr/>
      <ProductActions />
    </div>
  );
};

export default Admin;
