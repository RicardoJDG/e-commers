import React from "react";

const LoginAsk = (props) => {
  const state = props.state;
  const setState = props.setState;

  return (
    <div>
      {state ? (
        <div className="modal">
          <div className="Login-modal">
            <button id="LoginbuttonClose" onClick={() => setState(!state)}>
              X
            </button>
            <div className="login-ask">
            <h3>You have to Login to add products to your cart</h3>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LoginAsk;
