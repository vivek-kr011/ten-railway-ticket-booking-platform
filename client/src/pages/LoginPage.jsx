import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { loginUser } from "@/api/AuthApi";
import { AuthContext } from "@/context/AuthContext";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Browser autofill ko blue ki jagah cream rakhta hai
const inputClass =
  "border-[#d9cfb8] bg-white/80 focus-visible:border-[#b8893a] focus-visible:ring-[#b8893a]/30 " +
  "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#fffdf6_inset]";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await loginUser(loginData);

      // Save token
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Save user + update AuthContext
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
      }

      toast.success(response.message || "Login successful");

      // Reset form
      setFormData({
        email: "",
        password: "",
      });

      const from = location.state?.from || "/";

      // console.log("Login Location State:", location.state);
      // console.log("Login Redirect From:", from);

      navigate(from, { replace: true });

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    // pt-24 keeps the card clear of the fixed navbar
    <div className="flex min-h-screen items-center justify-center bg-[#f3efe4] px-4 pb-12 pt-24">
      <Card className="w-full max-w-md border border-[#d9cfb8] bg-gradient-to-b from-[#f9f5ea] to-[#ece3cf] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle
            className="text-3xl font-semibold text-[#1b2a44]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Login
          </CardTitle>

          <CardDescription className="text-[#5b5546]">
            Login to your Ticket Booking System account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1b2a44]">
                Email
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1b2a44]">
                Password
              </Label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-[#1b2a44] font-semibold text-[#e9c97f] hover:bg-[#14213a]"
            >
              Login
            </Button>
          </form>

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-[#5b5546]">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#8a5a14] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
