import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { signupUser } from "../api/AuthApi";
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

const fields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "Enter your phone number",
    autoComplete: "tel",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    autoComplete: "new-password",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      await signupUser(userData); // API CALL
      toast.success("Account created successfully!");

      setFormData(emptyForm);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    }
  };

  return (
    // pt-28 keeps the card clear of the fixed navbar
    <div className="flex min-h-screen items-center justify-center bg-[#f3efe4] px-4 pb-12 pt-28">
      <Card className="w-full max-w-md border border-[#d9cfb8] bg-gradient-to-b from-[#f9f5ea] to-[#ece3cf] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle
            className="text-3xl font-semibold text-[#1b2a44]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Create Account
          </CardTitle>

          <CardDescription className="text-[#5b5546]">
            Create your Ticket Booking System account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="space-y-2">
                <Label htmlFor={f.name} className="text-[#1b2a44]">
                  {f.label}
                </Label>

                <Input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={formData[f.name]}
                  onChange={handleChange}
                  autoComplete={f.autoComplete}
                  className="border-[#d9cfb8] bg-white/80 focus-visible:border-[#b8893a] focus-visible:ring-[#b8893a]/30"
                />
              </div>
            ))}

            <Button
              type="submit"
              className="w-full bg-[#1b2a44] font-semibold text-[#e9c97f] hover:bg-[#14213a]"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#5b5546]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#8a5a14] hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;