import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { nwkrApi, businessExpertApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [userType, setUserType] = useState(authUser?.profileType || "NWKR");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [nwkrForm, setNwkrForm] = useState({
    id: authUser?.nwkrId || null,
    name: "",
    birthday: "",
    email: authUser?.email || "",
    teamsLink: "",
    bildungsgang: [],
    officelokation: [],
    pictureLink: "",
    codinglanguages: [],
    description: "",
  });

  const [beForm, setBeForm] = useState({
    id: authUser?.businessExpertId || null,
    name: "",
    birthday: "",
    email: authUser?.email || "",
    studied: false,
    bereich: "",
    officelokation: [],
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
              birthday: data.birthday ? new Date(data.birthday).toISOString().slice(0, 10) : "",
            });
          }
        } else {
          const data = await businessExpertApi.getById(profileId);
          if (data) {
            setBeForm({
              ...data,
              birthday: data.birthday ? new Date(data.birthday).toISOString().slice(0, 10) : "",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNwkrChange = (e) => {
    const { name, value, type, options, checked } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setNwkrForm((prev) => ({ ...prev, [name]: values }));
    } else if (type === "checkbox" && name.endsWith("[]")) {
      // Handle checkbox arrays
      const fieldName = name.slice(0, -2);
      const currentValues = nwkrForm[fieldName] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
      setNwkrForm((prev) => ({ ...prev, [fieldName]: newValues }));
    } else {
      setNwkrForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBeChange = (e) => {
    const { name, value, type, options, checked } = e.target;

    if (type === "checkbox" && name.endsWith("[]")) {
      // Handle checkbox arrays
      const fieldName = name.slice(0, -2);
      const currentValues = beForm[fieldName] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
      setBeForm((prev) => ({ ...prev, [fieldName]: newValues }));
    } else if (type === "checkbox") {
      setBeForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "select-multiple") {
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setBeForm((prev) => ({ ...prev, [name]: values }));
    } else {
      setBeForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (userType === "NWKR") {
        const dataToSend = {
          ...nwkrForm,
          birthday: nwkrForm.birthday ? new Date(nwkrForm.birthday).toISOString() : null,
        };

        if (nwkrForm.id) {
          await nwkrApi.update(dataToSend);
          setMessage({ type: "success", text: "Profile updated successfully!" });
        } else {
          const createdUser = await nwkrApi.create(dataToSend);
          if (createdUser && createdUser.id) {
            // Update form with returned data
            setNwkrForm({
              ...createdUser,
              birthday: createdUser.birthday ? new Date(createdUser.birthday).toISOString().slice(0, 10) : "",
            });
            setMessage({ type: "success", text: `Profile created successfully! Redirecting to home...` });
            // Navigate to home after a short delay
            setTimeout(() => navigate('/'), 1500);
          } else {
            setMessage({ type: "error", text: "Failed to create profile. Please try again." });
          }
        }
      } else {
        const dataToSend = {
          ...beForm,
          birthday: beForm.birthday ? new Date(beForm.birthday).toISOString() : null,
        };

        if (beForm.id) {
          await businessExpertApi.update(beForm.id, dataToSend);
          setMessage({ type: "success", text: "Profile updated successfully!" });
        } else {
          const createdUser = await businessExpertApi.create(dataToSend);
          if (createdUser && createdUser.id) {
            // Update form with returned data
            setBeForm({
              ...createdUser,
              birthday: createdUser.birthday ? new Date(createdUser.birthday).toISOString().slice(0, 10) : "",
            });
            setMessage({ type: "success", text: `Profile created successfully! Redirecting to home...` });
            // Navigate to home after a short delay
            setTimeout(() => navigate('/'), 1500);
          } else {
            setMessage({ type: "error", text: "Failed to create profile. Please try again." });
          }
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ type: "error", text: "Failed to save profile. Please try again." });
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Profile Type: {userType === "NWKR" ? "Nachwuchskraft (NwKR)" : "Business Expert (BE)"}
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
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
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Birthday</label>
              <input
                name="birthday"
                type="date"
                value={form.birthday}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Picture URL</label>
              <input
                name="pictureLink"
                placeholder="https://example.com/picture.jpg"
                value={form.pictureLink}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Type-specific fields */}
          {userType === "NWKR" ? (
            <>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Education & Skills</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Bildungsgang</label>
                  <div className="space-y-2 p-3 bg-background border border-border rounded-lg">
                    {["INFORMATIK", "WIRTSCHFTSINFORMATIK"].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
                        <input
                          type="checkbox"
                          name="bildungsgang[]"
                          value={option}
                          checked={nwkrForm.bildungsgang.includes(option)}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Programming Languages</label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-background border border-border rounded-lg">
                    {[
                      { value: "PYTHON", label: "Python" },
                      { value: "C", label: "C" },
                      { value: "CPP", label: "C++" },
                      { value: "JAVA", label: "Java" },
                      { value: "JAVASCRIPT", label: "JavaScript" },
                      { value: "ASM", label: "Assembly" },
                      { value: "CSHARP", label: "C#" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
                        <input
                          type="checkbox"
                          name="codinglanguages[]"
                          value={option.value}
                          checked={nwkrForm.codinglanguages.includes(option.value)}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Teams Link</label>
                  <input
                    name="teamsLink"
                    placeholder="Teams meeting/chat link"
                    value={nwkrForm.teamsLink}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Professional Information</h2>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="studied"
                    checked={beForm.studied}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                  />
                  <label className="text-sm font-medium">Studied</label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bereich</label>
                  <input
                    name="bereich"
                    placeholder="Your area of expertise"
                    value={beForm.bereich}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bildung Betreuen</label>
                  <div className="space-y-2 p-3 bg-background border border-border rounded-lg">
                    {["INFORMATIK", "WIRTSCHFTSINFORMATIK"].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
                        <input
                          type="checkbox"
                          name="bildungBetreuen[]"
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
                  <label className="block text-sm font-medium mb-1">Team Description</label>
                  <textarea
                    name="teamDescription"
                    placeholder="Describe your team"
                    value={beForm.teamDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Common fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Office Location</label>
              <div className="space-y-2 p-3 bg-background border border-border rounded-lg">
                {["WINTERFELDSTRASSE"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
                    <input
                      type="checkbox"
                      name="officelokation[]"
                      value={option}
                      checked={form.officelokation.includes(option)}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Tell others about yourself"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
