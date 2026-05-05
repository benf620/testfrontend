import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { nwkrApi, businessExpertApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const BILDUNGSGANG_OPTIONS = ["INFORMATIK", "WIRTSCHFTSINFORMATIK"];
const OFFICE_OPTIONS = ["WINTERFELDSTRASSE"];

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [userType, setUserType] = useState(authUser?.profileType || "NWKR");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // ── Bild-State ──────────────────────────────────────────────────
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDropZoneDragging, setIsDropZoneDragging] = useState(false);
  const fileInputRef = useRef(null);
  // ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (location.state?.message) {
      setMessage({ type: "info", text: location.state.message });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [nwkrForm, setNwkrForm] = useState({
    id: authUser?.nwkrId || null,
    name: "",
    birthday: "",
    email: authUser?.email || "",
    bildungsgang: "",
    officelocation: "",
    pictureLink: "",
    codinglanguages: [],
    description: "",
  });

  const [beForm, setBeForm] = useState({
    id: authUser?.businessExpertId || null,
    name: "",
    birthday: "",
    email: authUser?.email || "",
    officelocation: "",
    pictureLink: "",
    bildungBetreuen: [],
    teamDescription: "",
    description: "",
  });

  useEffect(() => {
    if (authUser?.profileType) {
      setUserType(authUser.profileType);
    }
  }, [authUser]);

  useEffect(() => {
    fetchProfile();
  }, [userType]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profileId = authUser?.nwkrId || authUser?.businessExpertId;
      if (profileId) {
        if (userType === "NWKR") {
          const data = await nwkrApi.getById(profileId);
          if (data) {
            setNwkrForm({
              ...data,
              birthday: data.birthday
                  ? new Date(data.birthday).toISOString().slice(0, 10)
                  : "",
              bildungsgang: Array.isArray(data.bildungsgang)
                  ? data.bildungsgang[0] ?? ""
                  : data.bildungsgang ?? "",
              officelocation: Array.isArray(data.officelocation)
                  ? data.officelocation[0] ?? ""
                  : data.officelocation ?? "",
            });
            if (data.pictureLink) setImagePreview(data.pictureLink);
          }
        } else {
          const data = await businessExpertApi.getById(profileId);
          if (data) {
            setBeForm({
              ...data,
              birthday: data.birthday
                  ? new Date(data.birthday).toISOString().slice(0, 10)
                  : "",
              officelocation: Array.isArray(data.officelocation)
                  ? data.officelocation[0] ?? ""
                  : data.officelocation ?? "",
              bildungBetreuen: Array.isArray(data.bildungBetreuen)
                  ? data.bildungBetreuen
                  : data.bildungBetreuen
                      ? [data.bildungBetreuen]
                      : [],
            });
            if (data.pictureLink) setImagePreview(data.pictureLink);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Bild-Handling ────────────────────────────────────────────────
  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const onDrop = useCallback(
      (e) => {
        e.preventDefault();
        setIsDropZoneDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
      },
      [handleFile]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDropZoneDragging(true);
  };

  const onDragLeave = () => setIsDropZoneDragging(false);

  const onFileInputChange = (e) => handleFile(e.target.files?.[0]);

  const clearImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setNwkrForm((prev) => ({ ...prev, pictureLink: "" }));
    setBeForm((prev) => ({ ...prev, pictureLink: "" }));
  };
  // ────────────────────────────────────────────────────────────────

  const handleNwkrChange = (e) => {
    const { name, value, type, options } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(options)
          .filter((o) => o.selected)
          .map((o) => o.value);
      setNwkrForm((prev) => ({ ...prev, [name]: values }));
    } else {
      setNwkrForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBeChange = (e) => {
    const { name, value, type, options, checked } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(options)
          .filter((o) => o.selected)
          .map((o) => o.value);
      setBeForm((prev) => ({ ...prev, [name]: values }));
    }
    else if (type === "checkbox") {
      setBeForm((prev) => {
        const currentArray = Array.isArray(prev[name]) ? prev[name] : [];

        return {
          ...prev,
          [name]: checked
              ? [...currentArray, value] // Wenn angeklickt, zum Array hinzufügen
              : currentArray.filter((item) => item !== value), // Wenn abgewählt, aus Array entfernen
        };
      });
    }
    else {
      setBeForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const normalizeOfficelocation = (value) => (value ? [value] : []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (userType === "NWKR") {
        let response;
        const nwkrPayload = {
          ...nwkrForm,
          birthday: nwkrForm.birthday
              ? new Date(nwkrForm.birthday).toISOString()
              : null,
          officelocation: normalizeOfficelocation(nwkrForm.officelocation),
          bildungsgang: nwkrForm.bildungsgang ? [nwkrForm.bildungsgang] : [],
        };

        if (imageFile) {
          const formData = new FormData();
          const jsonBlob = new Blob([JSON.stringify(nwkrPayload)], {
            type: "application/json",
          });
          formData.append("data", jsonBlob);
          formData.append("picture", imageFile);
          response = nwkrForm.id
              ? await nwkrApi.updateWithImage(nwkrForm.id, formData)
              : await nwkrApi.createWithImage(formData);
        } else {
          response = nwkrForm.id
              ? await nwkrApi.update(nwkrPayload)
              : await nwkrApi.create(nwkrPayload);
        }

        if (nwkrForm.id) {
          setMessage({ type: "success", text: "Profile updated successfully!" });
          setTimeout(() => navigate("/"), 1000);
        } else if (response?.id) {
          setNwkrForm({
            ...response,
            birthday: response.birthday
                ? new Date(response.birthday).toISOString().slice(0, 10)
                : "",
            bildungsgang: Array.isArray(response.bildungsgang)
                ? response.bildungsgang[0] ?? ""
                : response.bildungsgang ?? "",
            officelocation: Array.isArray(response.officelocation)
                ? response.officelocation[0] ?? ""
                : response.officelocation ?? "",
          });
          if (response.pictureLink) setImagePreview(response.pictureLink);
          setImageFile(null);
          setMessage({
            type: "success",
            text: "Profile created successfully! Redirecting to home...",
          });
          setTimeout(() => navigate("/"), 1500);
        } else {
          setMessage({
            type: "error",
            text: "Failed to create profile. Please try again.",
          });
        }
      } else {
        let response;
        const bePayload = {
          ...beForm,
          birthday: beForm.birthday
              ? new Date(beForm.birthday).toISOString()
              : null,
          officelocation: normalizeOfficelocation(beForm.officelocation),
        };

        if (imageFile) {
          const formData = new FormData();
          const jsonBlob = new Blob([JSON.stringify(bePayload)], {
            type: "application/json",
          });
          formData.append("data", jsonBlob);
          formData.append("picture", imageFile);
          response = beForm.id
              ? await businessExpertApi.updateWithImage(beForm.id, formData)
              : await businessExpertApi.createWithImage(formData);
        } else {
          response = beForm.id
              ? await businessExpertApi.update(beForm.id, bePayload)
              : await businessExpertApi.create(bePayload);
        }

        if (beForm.id) {
          setMessage({ type: "success", text: "Profile updated successfully!" });
          setTimeout(() => navigate("/"), 1000);
        } else if (response?.id) {
          setBeForm({
            ...response,
            birthday: response.birthday
                ? new Date(response.birthday).toISOString().slice(0, 10)
                : "",
            officelocation: Array.isArray(response.officelocation)
                ? response.officelocation[0] ?? ""
                : response.officelocation ?? "",
            bildungBetreuen: Array.isArray(response.bildungBetreuen)
                ? response.bildungBetreuen
                : [],
          });
          if (response.pictureLink) setImagePreview(response.pictureLink);
          setImageFile(null);
          setMessage({
            type: "success",
            text: "Profile created successfully! Redirecting to home...",
          });
          setTimeout(() => navigate("/"), 1500);
        } else {
          setMessage({
            type: "error",
            text: "Failed to create profile. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({
        type: "error",
        text: "Failed to save profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-muted-foreground">Loading profile...</div>
        </div>
    );
  }

  const form = userType === "NWKR" ? nwkrForm : beForm;
  const handleChange = userType === "NWKR" ? handleNwkrChange : handleBeChange;
  const selectClass =
      "w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Your Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Profile Type:{" "}
              {userType === "NWKR"
                  ? "Nachwuchskraft (NwKR)"
                  : "Business Expert (BE)"}
            </p>
          </div>

          {message && (
              <div
                  className={`mb-4 p-3 rounded-lg ${
                      message.type === "success"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : message.type === "info"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
              >
                {message.text}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Basic Information ── */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={selectClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Birthday</label>
                <input
                    name="birthday"
                    type="date"
                    value={form.birthday}
                    onChange={handleChange}
                    className={selectClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="email@telekom.de"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={selectClass}
                />
              </div>

              {/* ── Profilbild ── */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Picture
                </label>

                {imagePreview ? (
                    <div className="flex flex-col items-start gap-3">
                      {/* Statische kreisförmige Vorschau */}
                      <div
                          className="rounded-full overflow-hidden border-3 border-primary shadow-lg bg-muted flex-shrink-0"
                          style={{ width: 190, height: 190 }}
                      >
                        <img
                            src={imagePreview}
                            alt="Profile preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition"
                        >
                          Replace
                        </button>
                        <button
                            type="button"
                            onClick={clearImage}
                            className="text-sm px-3 py-1.5 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10 transition"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        className={`relative w-full rounded-lg border-2 border-dashed transition-colors cursor-pointer
                    focus-within:ring-2 focus-within:ring-primary
                    ${
                            isDropZoneDragging
                                ? "border-primary bg-primary/10"
                                : "border-border bg-background hover:border-primary/60"
                        }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Drop image here
                      </span>{" "}
                          or click to select
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF, WEBP up to 10 MB
                        </p>
                      </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileInputChange}
                    className="sr-only"
                />
              </div>
              {/* ── Ende Profilbild ── */}
            </div>

            {/* ── Type-specific fields ── */}
            {userType === "NWKR" ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Education & Skills</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Educational Course
                    </label>
                    <select
                        name="bildungsgang"
                        value={nwkrForm.bildungsgang}
                        onChange={handleNwkrChange}
                        className={selectClass}
                    >
                      <option value="">— Please select —</option>
                      {BILDUNGSGANG_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>
            ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Professional Information</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                       Looking for NwKr with Educational Course:
                    </label>
                    <div className="space-y-2 p-3 bg-background border border-border rounded-lg">
                      {["INFORMATIK", "WIRTSCHFTSINFORMATIK"].map((option) => (
                          <label
                              key={option}
                              className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                          >
                            <input
                                type="checkbox"
                                name="bildungBetreuen"
                                value={option}
                                checked={beForm.bildungBetreuen.includes(option)}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Work Area
                    </label>
                    <textarea
                        name="teamDescription"
                        placeholder="Describe your team"
                        value={beForm.teamDescription}
                        onChange={handleBeChange}
                        rows={3}
                        className={`${selectClass} resize-none`}
                    />
                  </div>
                </div>
            )}

            {/* ── Common fields ── */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Office Location
                </label>
                <select
                    name="officelocation"
                    value={form.officelocation}
                    onChange={handleChange}
                    className={selectClass}
                >
                  <option value="">— Please select —</option>
                  {OFFICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                    name="description"
                    placeholder="Tell others about yourself"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className={`${selectClass} resize-none`}
                />
              </div>
            </div>

            <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
  );
}