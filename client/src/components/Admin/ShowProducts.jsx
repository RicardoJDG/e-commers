import React from "react";
import { Link } from "react-router-dom";

const ShowProducts = (props) => {
  const data = props.data;

  //DELETE FUNCTION

  const deleteProduct = async (id) => {
    if (data.product_name) {
      let respuesta = window.confirm(
        `Are you sure you want to delete the product ${data.product_name}? `
      );
      if (respuesta) {
        fetch(`/admin/products/${id}`, {
          method: "DELETE",
        })
          .then(() => {
            window.location.href = "/owner/products";
          })
          .catch((err) => console.error(err));
      }
    } else {
      let respuesta = window.confirm(
        `Are you sure you want to delete the customer ${data.first_name}? `
      );
      if (respuesta) {
        fetch(`/admin/customers/${id}`, {
          method: "DELETE",
        })
          .then(() => {
            window.location.href = "/owner/customers";
          })
          .catch((err) => console.error(err));
      }
    }
  };

  return (
    <tr>
      <th>{data.id}</th>
      <th>{data.product_name || data.first_name} </th>
      <th>{data.category || data.last_name || "undefined"}</th>
      <th>{data.unit_price || data.email}</th>
      <th>
        {<img src={`${data.image}`} alt="" /> ||
          data.address + data.city + data.postcode + data.country}
      </th>
      <th>{data.description || data.movile || "undefined"}</th>

      <th>
        <Link to={`/admin/products/update/${data.id}`}>
          <button className="button-update">UPDATE</button>
        </Link>
      </th>
      <th>
        <button
          onClick={() => deleteProduct(data.id)}
          className="button-delete"
        >
          DELETE
        </button>
      </th>
    </tr>
  );
};

export default ShowProducts;
