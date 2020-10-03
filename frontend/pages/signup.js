import { useState, useContext } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";

import { UserDispatchContext } from "../context/UserContext";
import Input from "../components/input";
import Notice from "../components/notice";

const form = {
  id: "signup",
  inputs: [
    {
      id: "name",
      type: "text",
      label: "Name",
      required: true,
      value: "",
    },
    {
      id: "email",
      type: "email",
      label: "E-Mail Address",
      required: true,
      value: "",
    },
    {
      id: "password",
      type: "password",
      label: "Password",
      required: true,
      value: "",
    },
  ],
  button: {
    type: "submit",
    label: "Sign up",
  },
};

const SignupPage = () => {
  const dispatch = useContext(UserDispatchContext);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const values = {};
  form.inputs.forEach((input) => (values[input.id] = input.value));
  const [formData, setFormData] = useState(values);

  const handleInputChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/signup`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );
      const data = await response.json();
      if (data.errCode) {
        setErrorMessage(data.message);
      } else {
        dispatch({ type: "LOGIN" });
        router.push("/account");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Something unexpected happened. Please reload.");
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <form id={form.id} method="post" onSubmit={handleSubmit}>
      <h1>Signup</h1>
      {form.inputs.map((input, key) => {
        return (
          <Input
            key={key}
            formId={form.id}
            id={input.id}
            type={input.type}
            label={input.label}
            required={input.required}
            value={formData[input.id]}
            setValue={(value) => handleInputChange(input.id, value)}
          />
        );
      })}
      {errorMessage && (
        <Notice status="ERROR" mini>
          {errorMessage}
        </Notice>
      )}
      <button type={form.button}>{form.button.label}</button>
    </form>
  );
};

export const getServerSideProps = (context) => {
  const { token } = cookies(context);
  const res = context.res;
  if (token) {
    res.writeHead(302, { Location: `/account` });
    res.end();
  }
  return { props: {} };
};

export default SignupPage;
