import { useForm } from "react-hook-form";
import api from "../api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AddSchool() {
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      setServerMsg("");
      setSubmitting(true);
      const formData = new FormData();
      for (const [k, v] of Object.entries(values)) formData.append(k, v);
      formData.append("image", values.image[0]);

      await api.post("/api/schools", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setServerMsg("✅ School added successfully!");
      reset();
    } catch (err) {
      console.error("Error while adding school:", err);
      setServerMsg("❌ Failed to add school.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Add School</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="font-medium">School Name</label>
          <input
            className="w-full border rounded-lg p-2 mt-1"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium">Email</label>
          <input
            className="w-full border rounded-lg p-2 mt-1"
            {...register("email_id", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            })}
          />
          {errors.email_id && (
            <p className="text-red-500 text-sm">{errors.email_id.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium">Contact</label>
          <input
            className="w-full border rounded-lg p-2 mt-1"
            {...register("contact", { required: "Contact is required" })}
          />
          {errors.contact && (
            <p className="text-red-500 text-sm">{errors.contact.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium">State</label>
          <input
            className="w-full border rounded-lg p-2 mt-1"
            {...register("state", { required: "State is required" })}
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="font-medium">Address</label>
          <textarea
            className="w-full border rounded-lg p-2 mt-1"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium">City</label>
          <input
            className="w-full border rounded-lg p-2 mt-1"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-lg p-2 mt-1"
            {...register("image", { required: "Image is required" })}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        <div className="md:col-span-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            {submitting && <Loader2 className="animate-spin w-5 h-5" />}
            {submitting ? "Saving..." : "Save School"}
          </button>
          {serverMsg && <p>{serverMsg}</p>}
        </div>
      </form>
    </div>
  );
}
