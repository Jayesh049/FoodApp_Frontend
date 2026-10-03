import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SubHeading from '../Genrich/SubHeading';
import { API_V1, mediaUrl } from '../../utils/apiBase';
import { displayPlanName } from '../../utils/planDisplay';
import '../Styles/suggestions.css';

const PROMPT_CHIPS = [
  'High protein under ₹300',
  'Best rated vegetarian',
  'South Indian weekly plan',
  'Light desserts for guests',
  'North Indian comfort meals',
];

function SuggestionsSection() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>('');
  const [citations, setCitations] = useState<any[]>([]);
  const [matchedItems, setMatchedItems] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [health, setHealth] = useState<any>(null);
  const [offline, setOffline] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_V1}/suggest/health`)
      .then((res) => {
        if (!cancelled) {
          setHealth(res.data);
          setOffline(!(res.data?.ragReady || res.data?.ok));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHealth({ ok: false });
          setOffline(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const runSuggest = async (overrideQuery?: string) => {
    const q = (overrideQuery != null ? overrideQuery : query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setAnswer('');
    setCitations([]);
    setMatchedItems([]);
    setError('');
    setOffline(false);
    try {
      const res = await axios.post(`${API_V1}/suggest/query`, { query: q });
      setAnswer(res.data.answer || '');
      setCitations(res.data.citations || []);
      setMatchedItems(res.data.matchedItems || res.data.matches || []);
      if (!res.data.answer && !(res.data.citations || []).length) {
        setError('No matches yet. Try a broader dish or budget.');
      }
    } catch (e: any) {
      const msg = e.response?.data?.message || '';
      const isInfra = /ollama|llama|unavailable|vector|AI/i.test(msg);
      if (isInfra || e.response?.status >= 500 || e.response?.status === 503) {
        setOffline(true);
        setError('');
      } else {
        setError(msg || 'Suggestions are temporarily unavailable.');
      }
    } finally {
      setLoading(false);
    }
  };

  const planCitations = citations.filter((c: any) => c.sourceType === 'plan' || c.planId || c.sourceId);
  const assistantReady = health?.ragReady || health?.ok;

  return (
    <section className="app__suggestions suggest-theatre section__padding" id="suggestions" data-testid="suggestions-section">
      <div className="app__suggestions-header">
        <SubHeading title="Ask our AI assistant" />
        <h1 className="headtext__cormorant">Plan Suggestions</h1>
        <p className="p__opensans app__suggestions-sub">
          Describe a craving, budget, or cuisine — we match live meal plans.
        </p>
        <div
          className={`app__suggestions-health ${assistantReady ? 'is-ready' : 'is-warn'}`}
          data-testid="suggest-health"
        >
          {health == null
            ? 'Checking assistant…'
            : assistantReady
              ? 'Assistant ready'
              : 'Browse mode — tasting menu always open'}
        </div>
      </div>

      <div className="app__suggestions-chips" role="group" aria-label="Suggested prompts">
        {PROMPT_CHIPS.map((chip: any) => (
          <button
            key={chip}
            type="button"
            className="app__suggestions-chip"
            onClick={() => runSuggest(chip)}
            disabled={loading}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="app__suggestions-form">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask for recommendations..."
          className="app__suggestions-input"
          data-testid="suggest-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') runSuggest();
          }}
        />
        <button
          type="button"
          className="custom__button"
          onClick={() => runSuggest()}
          disabled={loading || !query.trim()}
          data-testid="suggest-submit"
        >
          {loading ? 'Thinking…' : 'Suggest'}
        </button>
      </div>

      {loading && (
        <div className="app__suggestions-skeleton" aria-busy="true">
          <div className="skel-line" />
          <div className="skel-line short" />
          <div className="skel-cards">
            <div className="skel-card" />
            <div className="skel-card" />
            <div className="skel-card" />
          </div>
        </div>
      )}

      {offline && !loading && (
        <div className="suggest-offline">
          <h3 className="p__cormorant">Kitchen assistant is offline</h3>
          <p className="p__opensans">
            You can still play through every plated dish in our tasting menu.
          </p>
          <Link to="/allPlans#cinema" className="suggest-offline__cta">
            Play the tasting menu
          </Link>
        </div>
      )}

      {error && !loading && !offline && (
        <div className="app__suggestions-error p__opensans" role="alert">
          {error}
        </div>
      )}

      {answer && !loading && (
        <div className="app__suggestions-answer">
          <h3 className="p__cormorant">Recommendation</h3>
          <p className="p__opensans">{answer}</p>
        </div>
      )}

      {(planCitations.length > 0 || matchedItems.length > 0) && !loading && (
        <div className="app__suggestions-citations">
          <h3 className="p__cormorant">Matched plans</h3>
          <div className="app__suggestions-cards">
            {planCitations.map((c: any) => {
              const id = c.planId || c.sourceId;
              const img = c.image || c.thumbnail;
              return (
                <Link
                  key={`${c.sourceType}:${id}`}
                  to={id ? `/planDetails/${id}` : '/allPlans'}
                  className="app__suggestions-card"
                >
                  <div className="app__suggestions-card-media">
                    {img ? (
                      <img src={mediaUrl(img)} alt="" />
                    ) : (
                      <div className="app__suggestions-card-fallback" />
                    )}
                  </div>
                  <div className="app__suggestions-card-body">
                    <span className="app__suggestions-card-title">{displayPlanName(c.title)}</span>
                    {typeof c.score === 'number' && (
                      <span className="app__suggestions-card-meta">
                        Match {(c.score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default SuggestionsSection;
