import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { isAdmin } from '../../utils/isAdmin';
import {
  createPlanWithImages,
  deletePlan,
  fetchAllPlans,
  planImageUrl,
  reindexRag,
  updatePlan,
  updatePlanMedia,
} from '../../utils/planApi';
import '../Styles/admin.css';

const EMPTY_FORM = {
  name: '',
  price: '',
  duration: '',
  discount: '',
};

function AdminPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchAllPlans();
      setPlans(list);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login?next=/admin/plans');
      return;
    }
    if (!isAdmin(user)) {
      navigate('/');
      return;
    }
    loadPlans();
  }, [user, history, loadPlans]);

  useEffect(() => {
    const urls = imageFiles.map((file: any) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach((url: any) => URL.revokeObjectURL(url));
  }, [imageFiles]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setEditingId(null);
  };

  const startEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      name: plan.name || '',
      price: String(plan.price ?? ''),
      duration: String(plan.duration ?? ''),
      discount: plan.discount != null ? String(plan.discount) : '',
    });
    setImageFiles([]);
    setMessage('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (editingId) {
        await updatePlan(editingId, {
          name: form.name.trim(),
          price: Number(form.price),
          duration: Number(form.duration),
          discount: form.discount === '' ? undefined : Number(form.discount),
        });
        if (imageFiles.length > 0) {
          await updatePlanMedia(editingId, imageFiles);
        }
        setMessage('Plan updated successfully.');
      } else {
        if (imageFiles.length === 0) {
          setMessage('Please select at least one image.');
          setSaving(false);
          return;
        }
        const res = await createPlanWithImages(
          {
            name: form.name.trim(),
            price: form.price,
            duration: form.duration,
            discount: form.discount === '' ? undefined : form.discount,
          },
          imageFiles
        );
        const ragNote = res.data.ragEmbedded
          ? ' Added to AI search.'
          : ' Run Reindex on Admin AI if suggestions do not show this plan yet.';
        setMessage(`Plan created successfully.${ragNote}`);
      }
      resetForm();
      loadPlans();
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.err ||
          'Save failed. Check you are logged in as admin.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete plan "${name}"? This cannot be undone.`)) return;
    try {
      await deletePlan(id);
      setMessage('Plan deleted.');
      if (editingId === id) resetForm();
      loadPlans();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleReindex = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await reindexRag();
      setMessage(
        `AI reindex done: ${res.data.upserts} documents (${res.data.plansIndexed} plans).`
      );
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Reindex failed. Check Ollama and vector index.');
    } finally {
      setSaving(false);
    }
  };

  if (!user || !isAdmin(user)) return null;

  return (
    <div className="container-grey auth-page admin-page admin-plans-page">
      <div className="form-container admin-panel admin-panel--wide">
        <div className="h1Box">
          <h1 className="h1">Manage Plans</h1>
          <div className="line" />
        </div>
        <p className="p__opensans admin-intro">
          Create food plans with image upload. Plans appear on All Plans and can be linked in Home Sections.
        </p>

        {loading ? (
          <p className="p__opensans admin-loading">Loading plans...</p>
        ) : (
          <>
            <div className="admin-plan-list">
              {plans.length === 0 && (
                <p className="p__opensans admin-loading">No plans yet. Create one below.</p>
              )}
              {plans.map((plan: any) => (
                <div key={plan._id} className="admin-plan-item">
                  <img
                    src={planImageUrl(plan.image)}
                    alt={plan.name}
                    className="admin-plan-item__thumb"
                  />
                  <div className="admin-plan-item__info">
                    <strong>{plan.name}</strong>
                    <span className="admin-plan-item__meta">
                      ₹{plan.price} · {plan.duration} days
                      {plan.discount != null ? ` · ${plan.discount}% off` : ''}
                    </span>
                  </div>
                  <div className="admin-plan-item__actions">
                    <button type="button" className="custom__button" onClick={() => startEdit(plan)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-archive-btn"
                      onClick={() => handleDelete(plan._id, plan.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form className="admin-section-form" onSubmit={handleSubmit}>
              <h2 className="p__cormorant admin-form-title">
                {editingId ? 'Edit plan' : 'New plan'}
              </h2>
              <div className="admin-form-grid">
                <label>
                  Name
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    maxLength={40}
                    placeholder="Paneer Tikka"
                  />
                </label>
                <label>
                  Price (₹)
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Duration (days)
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Discount (₹, optional)
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    placeholder="Less than price"
                  />
                </label>
                <label className="admin-form-full">
                  Images (up to 5){editingId ? ' — leave empty to keep current' : ' — required'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="admin-image-previews">
                  {imagePreviews.map((src: any, i: any) => (
                    <img key={src} src={src} alt={`Preview ${i + 1}`} />
                  ))}
                </div>
              )}

              <div className="admin-actions">
                <button type="submit" className="loginBtn form-button" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update plan' : 'Create plan'}
                </button>
                {editingId && (
                  <button type="button" className="custom__button" onClick={resetForm}>
                    Cancel edit
                  </button>
                )}
                <button
                  type="button"
                  className="custom__button"
                  onClick={handleReindex}
                  disabled={saving}
                >
                  Reindex AI
                </button>
              </div>
            </form>
          </>
        )}

        {message && (
          <p className={`admin-message ${message.includes('success') || message.includes('done') || message.includes('created') ? 'admin-message--ok' : ''}`}>
            {message}
          </p>
        )}

        <div className="otherOption">
          <Link to="/admin/sections" className="otherbtns">Home Sections</Link>
          <Link to="/admin/rag" className="otherbtns">Admin AI</Link>
          <Link to="/allPlans" className="otherbtns">View All Plans</Link>
          <Link to="/" className="otherbtns">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPlans;
