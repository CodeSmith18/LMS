import { useState } from "react";
import "./ls.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                toast.success("✅ Account created successfully!");
                navigate("/login")
            } else {
                toast.error(data.error || "Signup failed");
            }
        }
        catch (err) {
            console.log(err);
        }

    }



    const handelFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handelFormChange}
                    required
                ></input>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handelFormChange}
                    required
                ></input>
                <input
                    type="text"
                    name="password"
                    placeholder="Email"
                    value={formData.password}
                    onChange={handelFormChange}
                    required
                ></input>
                <button
                    type="submit">SignUp</button>

            </form>
        </div>
    );
}

export default SignUp;
