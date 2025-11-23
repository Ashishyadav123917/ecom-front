import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

//export default function NewUser() {
const NewUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await register(name, email, mobile, password);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">New User</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="E-mail ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Mobile No"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        required
      />

      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="px-8 py-2 mt-4 font-light text-white bg-black"
      >
        Submit
      </button>
    </form>
  );
};

export default NewUser;