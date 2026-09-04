import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { getHousingById, getHousingTypes } from "../../services/housingService";
import { createHousing, updateHousing, uploadHousingImage } from "../../services/ownerService";
import { getApiError } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const emptyForm = {
  title: "",
  description: "",
  address: "",
  city: "",
  latitude: "30.0444",
  longitude: "31.2357",
  price: "",
  housingTypeId: "",
  genderType: "Mixed",
  isAvailable: true,
};

export default function OwnerHousingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [housingTypes, setHousingTypes] = useState([]);
  const [existingIsVerified, setExistingIsVerified] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const typesResult = await getHousingTypes();
        const types = Array.isArray(typesResult?.items) ? typesResult.items : [];
        if (!cancelled) setHousingTypes(types);

        if (isEdit) {
          const result = await getHousingById(id);
          const housing = result?.data ?? result;
          if (!cancelled && housing) {
            setForm({
              title: housing.title || "",
              description: housing.description || "",
              address: housing.address || "",
              city: housing.city || "",
              latitude: String(housing.latitude ?? "30.0444"),
              longitude: String(housing.longitude ?? "31.2357"),
              price: String(housing.price ?? ""),
              housingTypeId: String(housing.housingTypeId ?? ""),
              genderType: housing.genderType || "Mixed",
              isAvailable: housing.isAvailable !== false,
            });
            setExistingIsVerified(Boolean(housing.isVerified));
            setImages(housing.images || []);
          }
        } else if (!cancelled && types.length > 0) {
          const firstId = types[0].housingTypeId ?? types[0].housingTypeIdDto;
          setForm((prev) => ({ ...prev, housingTypeId: String(firstId) }));
        }
      } catch (e) {
        if (!cancelled) setError(getApiError(e, "Could not load this housing."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const handleImageUpload = async (event) => {
      const file = event.target.files?.[0];
      if (!file || !id) return;
      setUploading(true);
      setError("");
      try {
        const result = await uploadHousingImage(id, file, images.length === 0);
        const image = result?.data ?? result;
        if (image?.imageUrl) setImages((previous) => [...previous, image]);
      } catch (e) {
        setError(getApiError(e, "Could not upload this image."));
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      address: form.address.trim(),
      city: form.city.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      price: Number(form.price),
      housingTypeId: Number(form.housingTypeId),
      genderType: form.genderType,
      isAvailable: form.isAvailable,
    };

    try {
      if (isEdit) {
        // isVerified isn't editable here — carry the existing value through so
        // this update can't silently un-verify (or self-verify) the listing.
        await updateHousing(id, { ...payload, isVerified: existingIsVerified });
        navigate("/owner/housings");
      } else {
        const created = await createHousing(payload);
        navigate(`/owner/housings/${created?.id ?? ""}/edit`);
      }
    } catch (e) {
      setError(getApiError(e, "Could not save this housing."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading..." />;

  return (
    <div>
      <Link to="/owner/housings" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={15} />
        Back to my housings
      </Link>

      <h2 className="mb-5 text-xl font-bold text-slate-900">
        {isEdit ? "Edit Housing" : "New Housing"}
      </h2>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            required
            value={form.title}
            onChange={handleChange("title")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={handleChange("description")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
            <input
              required
              value={form.address}
              onChange={handleChange("address")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
            <input
              required
              value={form.city}
              onChange={handleChange("city")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Latitude</label>
            <input
              required
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange("latitude")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Longitude</label>
            <input
              required
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange("longitude")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Price (EGP/month)</label>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={handleChange("price")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Housing Type (property)</label>
            <select
              required
              value={form.housingTypeId}
              onChange={handleChange("housingTypeId")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="" disabled>Select a type</option>
              {housingTypes.map((t) => {
                const typeId = t.housingTypeId ?? t.housingTypeIdDto;
                const typeName = t.housingTypeName ?? t.housingTypeNameDto;
                return (
                  <option key={typeId} value={typeId}>
                    {typeName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Housing Type describes the property (for example, apartment or villa).
          Room Type is selected separately for each room (single, double, or shared).
        </p>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Gender Type</label>
          <select
            value={form.genderType}
            onChange={handleChange("genderType")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.isAvailable} onChange={handleChange("isAvailable")} />
            Available for booking
          </label>
        </div>

        {isEdit && (
          <p className="text-xs text-slate-400">
            Verification status is managed by an admin and isn't changed by this form.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isEdit ? "Save changes" : "Create housing"}
        </button>
      </form>

      {isEdit && (
        <div className="mt-4 max-w-2xl rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Photos</h3>
          <p className="mt-1 text-sm text-slate-500">Upload photos and the first photo will be used as the primary image.</p>
          <label className="mt-3 inline-flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {uploading ? "Uploading..." : "Choose image"}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
          </label>
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.map((image) => (
                <img key={image.imageId ?? image.id ?? image.imageUrl} src={image.imageUrl} alt="Housing" className="h-24 w-full rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
