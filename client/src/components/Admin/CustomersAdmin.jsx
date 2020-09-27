import React, { Fragment, useEffect, useState } from "react";

import ShowProducts from "./ShowProducts";

const CustomersAdmin = () => {
  const [customersData, setCustomersData] = useState([]);

  useEffect(() => {
    const fetchLink = `/admin/customers`;

    fetch(fetchLink)
      .then((res) => res.json())
      .then((json) => {
        setCustomersData(json);
      });
  }, []);

  return (
    <Fragment>
      <div className="all-products-container">
        <div className="titles">
          <h1>ALL YOUR CUSTOMERS</h1>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>PHONE</th>
              <th>UPDATE</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {customersData
              ? customersData.map((product, index) => (
                  <ShowProducts data={product} index={index} />
                ))
              : null}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default CustomersAdmin;
