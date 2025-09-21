import { useState } from "react";
import "./signup.css"; // renamed to match the new unique class
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                toast.success("✅ Account created successfully!");
                navigate("/");
            } else {
                toast.error(data.error || "Signup failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="signup-container-rr">
            <form onSubmit={handleSubmit} className="signup-form-rr">
                <h2>Create Account</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleFormChange}
                    required
                />
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
