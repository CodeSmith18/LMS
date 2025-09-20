import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ls.css"
function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate();

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                })
            })
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                toast.success("✅ Account created successfully!");
                navigate("/")
            } else {
                toast.error(data.error || "Signup failed");
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    required
                    onChange={handleFormChange} />

                <input type="text"
                    name="password"
                    placeholder="Password"
                    onChange={handleFormChange}
                    required
                    value={formData.password} />

                <button
                    type="submit">
                    Login
                </button>
            </form>
        </>
    );
}

export default Login;