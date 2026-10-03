import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthProvider';
import { isAdmin } from '../../utils/isAdmin';
import { getAuthHeaders } from '../../utils/apiAuth';
import { API_V1 } from '../../utils/apiBase';
import '../Styles/admin.css';

function StatusRow({ label, ok, detail }: any) {
  return (
    <div className={`admin-status-row ${ok ? 'admin-status-row--ok' : 'admin-status-row--bad'}`}>
      <span className="admin-status-label">{label}</span>
      <span className="admin-status-value">{ok ? 'Ready' : 'Not ready'}</span>
      {detail && <span className="admin-status-detail">{detail}</span>}
    </div>
  );
}

function AdminRag() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reindexing, setReindexing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_V1}/suggest/health`);
      setHealth(res.data);
    } catch (err: any) {
      setHealth(null);
      setMessage('Could not reach RAG health endpoint. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin(user)) {
      navigate('/');
      return;
    }
    fetchHealth();
  }, [user, history, fetchHealth]);

  const runReindex = async () => {
    setMessage('');
    setReindexing(true);
    try {
      const res = await axios.post(
        `${API_V1}/suggest/reindex`,
        {},
        { headers: getAuthHeaders() }
      );
      setMessage(
        `Reindex done: ${res.data.upserts} documents (${res.data.plansIndexed} plans, ${res.data.reviewsIndexed} reviews).`
      );
      fetchHealth();
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.result ||
          'Reindex failed. Check Ollama is running and you are logged in as admin.'
      );
    } finally {
      setReindexing(false);
    }
  };

  if (!user || !isAdmin(user)) {
    return null;
  }

  return (
    <div className="container-grey auth-page admin-page">
      <div className="form-container admin-panel">
        <div className="h1Box">
          <h1 className="h1">AI Admin</h1>
          <div className="line" />
        </div>
        <p className="p__opensans admin-intro">
          Manage RAG embeddings for Plan Suggestions and Smart Search.
        </p>

        {loading ? (
          <p className="p__opensans admin-loading">Checking services...</p>
        ) : health ? (
          <div className="admin-status-grid">
            <StatusRow
              label="Ollama"
              ok={health.ollama?.reachable}
              detail={health.ollama?.reachable ? '' : 'Run: ollama serve'}
            />
            <StatusRow
              label="Embed model"
              ok={health.ollama?.embedModelAvailable}
              detail={health.embedModel}
            />
            <StatusRow
              label="Chat model"
              ok={health.ollama?.chatModelAvailable}
              detail={health.chatModel}
            />
            <StatusRow
              label="Vector index"
              ok={health.vectorIndexReady}
              detail={health.vectorIndexReason || health.indexName}
            />
            <StatusRow
              label="Indexed documents"
              ok={health.docCount > 0}
              detail={`${health.docCount || 0} in rag_documents`}
            />
            <StatusRow
              label="RAG overall"
              ok={health.ragReady}
              detail={health.ragReady ? 'Suggestions & smart search ready' : 'Setup incomplete'}
            />
          </div>
        ) : (
          <p className="auth-error-msg">{message || 'Health check failed'}</p>
        )}

        <div className="admin-actions">
          <button
            type="button"
            className="custom__button"
            onClick={fetchHealth}
            disabled={loading}
          >
            Refresh status
          </button>
          <button
            type="button"
            className="loginBtn form-button"
            onClick={runReindex}
            disabled={reindexing}
          >
            {reindexing ? 'Reindexing...' : 'Reindex plans & reviews'}
          </button>
        </div>

        {message && !loading && (
          <p className={`admin-message ${message.includes('done') ? 'admin-message--ok' : ''}`}>
            {message}
          </p>
        )}

        <div className="admin-setup-hint p__opensans">
          <p><strong>First-time setup:</strong></p>
          <ol>
            <li>Install Ollama and run <code>ollama pull nomic-embed-text</code> and <code>ollama pull llama3.1</code></li>
            <li>Create MongoDB Atlas vector index on <code>rag_documents.embedding</code> (768 dims, cosine)</li>
            <li>Admin login uses <code>ADMIN_EMAIL</code> / <code>ADMIN_PASSWORD</code> from Backend <code>.env</code> (seeded on backend start)</li>
            <li>Click <strong>Reindex</strong> above</li>
          </ol>
          <p>Full guide: <code>Backend/docs/RAG_SETUP.md</code></p>
        </div>

        <div className="otherOption">
          <Link to="/admin/plans" className="otherbtns">Manage Plans</Link>
          <Link to="/admin/sections" className="otherbtns">Manage Sections</Link>
          <Link to="/" className="otherbtns">Back to Home</Link>
          <Link to="/allPlans" className="otherbtns">All Plans</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminRag;
