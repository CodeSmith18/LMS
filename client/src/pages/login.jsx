import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                })
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                toast.success("✅ Logged in successfully!");
                navigate("/Lead");
            } else {
                toast.error(data.error || "Login failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="login-container-rr">
            <form onSubmit={handleSubmit} className="login-form-rr">
                <h2>Login.</h2>
                <h3 class="signup-text">
                    Don't have an account?
                    <a href="/signin">Sign up</a>
                </h3>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
