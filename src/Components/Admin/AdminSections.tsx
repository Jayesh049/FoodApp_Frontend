import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthProvider';
import { isAdmin } from '../../utils/isAdmin';
import { getAuthHeaders } from '../../utils/apiAuth';
import { API_V1 } from '../../utils/apiBase';
import '../Styles/admin.css';

type SectionForm = {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  type: string;
  order: number;
  ctaLabel: string;
  ctaUrl: string;
  planIds: string[];
  imagePaths: string;
  isActive: boolean;
};

const EMPTY_FORM: SectionForm = {
  key: '',
  title: '',
  subtitle: '',
  description: '',
  type: 'carousel',
  order: 0,
  ctaLabel: 'View Plans',
  ctaUrl: '/allPlans',
  planIds: [],
  imagePaths: '',
  isActive: true,
};

function AdminSections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [form, setForm] = useState<SectionForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [secRes, planRes] = await Promise.all([
        axios.get(`${API_V1}/sections/all`, { headers: getAuthHeaders() }),
        axios.get(`${API_V1}/plan/`),
      ]);
      setSections(secRes.data.sections || []);
      setPlans(planRes.data.Allplans || []);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login?next=/admin/sections');
      return;
    }
    if (!isAdmin(user)) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, history, fetchData]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (section) => {
    setEditingId(section._id);
    setForm({
      key: section.key || '',
      title: section.title || '',
      subtitle: section.subtitle || '',
      description: section.description || '',
      type: section.type || 'carousel',
      order: section.order || 0,
      ctaLabel: section.ctaLabel || 'View Plans',
      ctaUrl: section.ctaUrl || '/allPlans',
      planIds: (section.planIds || []).map((id: any) => String(id._id || id)),
      imagePaths: (section.imagePaths || []).join(', '),
      isActive: section.isActive !== false,
    });
    setMessage('');
  };

  const handlePlanToggle = (planId) => {
    const id = String(planId);
    setForm((prev: any) => ({
      ...prev,
      planIds: prev.planIds.includes(id)
        ? prev.planIds.filter((p: any) => p !== id)
        : [...prev.planIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const payload = {
      key: form.key.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      type: form.type,
      order: Number(form.order) || 0,
      ctaLabel: form.ctaLabel.trim(),
      ctaUrl: form.ctaUrl.trim(),
      planIds: form.planIds,
      imagePaths: form.imagePaths
        .split(',')
        .map((s: any) => s.trim())
        .filter(Boolean),
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await axios.patch(
          `${API_V1}/sections/${editingId}`,
          payload,
          { headers: getAuthHeaders() }
        );
        setMessage('Section updated successfully.');
      } else {
        await axios.post(
          `${API_V1}/sections/`,
          payload,
          { headers: getAuthHeaders() }
        );
        setMessage('Section created successfully.');
      }
      resetForm();
      fetchData();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Save failed');
    }
  };

  const archiveSection = async (id) => {
    if (!window.confirm('Archive this section? It will be hidden from the home page.')) return;
    try {
      await axios.delete(`${API_V1}/sections/${id}`, {
        headers: getAuthHeaders(),
      });
      setMessage('Section archived.');
      if (editingId === id) resetForm();
      fetchData();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Archive failed');
    }
  };

  if (!user || !isAdmin(user)) return null;

  return (
    <div className="container-grey auth-page admin-page admin-sections-page">
      <div className="form-container admin-panel admin-panel--wide">
        <div className="h1Box">
          <h1 className="h1">Home Sections</h1>
          <div className="line" />
        </div>
        <p className="p__opensans admin-intro">
          Add carousel, grid, banner, or hero blocks to the home page. Changes appear after refresh.
        </p>

        {loading ? (
          <p className="p__opensans admin-loading">Loading...</p>
        ) : (
          <>
            <div className="admin-section-list">
              {sections.length === 0 && (
                <p className="p__opensans admin-loading">No sections yet. Create one below.</p>
              )}
              {sections.map((section: any) => (
                <div key={section._id} className="admin-section-item">
                  <div>
                    <strong>{section.title}</strong>
                    <span className="admin-section-item__meta">
                      {section.key} · {section.type} · order {section.order}
                      {!section.isActive && ' · archived'}
                    </span>
                  </div>
                  <div className="admin-section-item__actions">
                    <button type="button" className="custom__button" onClick={() => startEdit(section)}>
                      Edit
                    </button>
                    {section.isActive && (
                      <button type="button" className="admin-archive-btn" onClick={() => archiveSection(section._id)}>
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form className="admin-section-form" onSubmit={handleSubmit}>
              <h2 className="p__cormorant admin-form-title">
                {editingId ? 'Edit section' : 'New section'}
              </h2>
              <div className="admin-form-grid">
                <label>
                  Key (unique)
                  <input
                    value={form.key}
                    onChange={(e) => setForm({ ...form, key: e.target.value })}
                    required
                    disabled={!!editingId}
                    placeholder="featured-plans"
                  />
                </label>
                <label>
                  Type
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="carousel">Carousel</option>
                    <option value="grid">Grid</option>
                    <option value="banner">Banner</option>
                    <option value="hero">Hero</option>
                  </select>
                </label>
                <label>
                  Title
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </label>
                <label>
                  Subtitle
                  <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                </label>
                <label className="admin-form-full">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                  />
                </label>
                <label>
                  Order
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  CTA label
                  <input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} />
                </label>
                <label>
                  CTA URL
                  <input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} />
                </label>
                <label className="admin-form-full">
                  Image paths (comma-separated)
                  <input
                    value={form.imagePaths}
                    onChange={(e) => setForm({ ...form, imagePaths: e.target.value })}
                    placeholder="uploads/img1.jpg, uploads/img2.jpg"
                  />
                </label>
              </div>

              <div className="admin-plan-picker">
                <p className="admin-plan-picker__label">Link plans (optional)</p>
                <div className="admin-plan-picker__list">
                  {plans.map((plan: any) => (
                    <label key={plan._id} className="admin-plan-picker__item">
                      <input
                        type="checkbox"
                        checked={form.planIds.includes(String(plan._id))}
                        onChange={() => handlePlanToggle(plan._id)}
                      />
                      <span>{plan.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Active on home page
              </label>

              <div className="admin-actions">
                <button type="submit" className="loginBtn form-button">
                  {editingId ? 'Update section' : 'Create section'}
                </button>
                {editingId && (
                  <button type="button" className="custom__button" onClick={resetForm}>
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </>
        )}

        {message && (
          <p className={`admin-message ${message.includes('success') ? 'admin-message--ok' : ''}`}>
            {message}
          </p>
        )}

        <div className="otherOption">
          <Link to="/admin/plans" className="otherbtns">Manage Plans</Link>
          <Link to="/admin/rag" className="otherbtns">Admin AI</Link>
          <Link to="/" className="otherbtns">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminSections;
