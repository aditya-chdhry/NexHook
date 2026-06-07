const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '/api'
  : '/_/backend/api';

/* ─── Auth ─── */
export const isAdminLoggedIn = () => !!sessionStorage.getItem('nexhook_token');

export const getAuthHeaders = () => {
  const token = sessionStorage.getItem('nexhook_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export async function adminLogin(username, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      sessionStorage.setItem('nexhook_token', data.token);
      sessionStorage.setItem('nexhook_admin_username', data.username);
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const adminLogout = () => {
  sessionStorage.removeItem('nexhook_token');
  sessionStorage.removeItem('nexhook_admin_username');
};

export async function changePassword(oldPassword, newPassword, newUsername) {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ oldPassword, newPassword, newUsername })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to update credentials');
  }
  return true;
}

/* ─── Generic Fetch Helpers ─── */
async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, { headers: getAuthHeaders() });
    if (!res.ok) {
      console.warn(`API response not OK for ${endpoint}: status ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`fetchAPI failed for ${endpoint}:`, err);
    return [];
  }
}

async function saveAPI(endpoint, item) {
  try {
    const method = item._id ? 'PUT' : 'POST';
    const url = item._id ? `${API_URL}/${endpoint}/${item.id}` : `${API_URL}/${endpoint}`;
    
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) {
      console.warn(`saveAPI response not OK for ${endpoint}: status ${res.status}`);
      return { error: `Failed to save ${endpoint}` };
    }
    const data = await res.json();
    return data || {};
  } catch (err) {
    console.error(`saveAPI failed for ${endpoint}:`, err);
    return { error: err.message };
  }
}

async function deleteAPI(endpoint, id) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      console.warn(`deleteAPI response not OK for ${endpoint}: status ${res.status}`);
    }
  } catch (err) {
    console.error(`deleteAPI failed for ${endpoint}:`, err);
  }
}

/* ─── Getters ─── */
export const getLeads          = () => fetchAPI('leads');
export const getInvoices       = () => fetchAPI('invoices');
export const getClients        = () => fetchAPI('clients');
export const getPayments       = () => fetchAPI('payments');
export const getTasks          = () => fetchAPI('tasks');
export const getMeetings       = () => fetchAPI('meetings');
export const getOutreachLeads  = () => fetchAPI('outreach-leads');
export const getChatbotData     = () => fetchAPI('chatbot-data');

/* ─── Savers ─── */
export const saveLead    = l => saveAPI('leads', l);
export const saveInvoice = i => saveAPI('invoices', i);
export const saveClient  = c => saveAPI('clients', c);
export const savePayment = p => saveAPI('payments', p);
export const saveTask    = t => saveAPI('tasks', t);
export const saveMeeting = m => saveAPI('meetings', m);

/* ─── Deleters ─── */
export const deleteLead          = id => deleteAPI('leads', id);
export const deleteInvoice       = id => deleteAPI('invoices', id);
export const deleteClient        = id => deleteAPI('clients', id);
export const deletePayment       = id => deleteAPI('payments', id);
export const deleteTask          = id => deleteAPI('tasks', id);
export const deleteMeeting       = id => deleteAPI('meetings', id);
export const deleteOutreachLead  = id => deleteAPI('outreach-leads', id);
export const deleteChatbotConversation = (sessionId) => {
  return fetch(`${API_URL}/chatbot-data/${sessionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }).then(res => res.json());
};

/* ─── Chatbot Status ─── */
export const updateChatbotStatus = (sessionId, status) => {
  return fetch(`${API_URL}/chatbot-data/${sessionId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  }).then(res => res.json());
};

/* ─── Campaigns ─── */
export async function triggerOutreachCampaign(campaignConfig) {
  const res = await fetch(`${API_URL}/outreach-campaign/trigger`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(campaignConfig)
  });
  return res.json();
}

/* ─── Public Forms ─── */
export async function addLeadFromForm(formData) {
  const res = await fetch(`${API_URL}/public/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) {
    throw new Error('Failed to save lead to MERN backend');
  }
  return res.json();
}

/* ─── Social Media Manager & Sales Team ─── */
export const getSocialMetrics = () => fetchAPI('social-metrics');
export const saveSocialMetrics = (platform, data) => {
  return fetch(`${API_URL}/social-metrics/${platform}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const syncRealSocialMetrics = (platform) => {
  return fetch(`${API_URL}/social-metrics/sync-real/${platform}`, {
    method: 'POST',
    headers: getAuthHeaders()
  }).then(res => res.json());
};

export const syncAllSocialMetrics = () => {
  return fetch(`${API_URL}/social-metrics/sync-all`, {
    method: 'POST',
    headers: getAuthHeaders()
  }).then(res => res.json());
};

export const getSalesAttributions = () => fetchAPI('sales-attributions');
export const incrementSalesAttribution = (platform) => {
  return fetch(`${API_URL}/sales-attributions/increment`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ platform })
  }).then(res => res.json());
};

export async function verifyAdminSession() {
  const token = sessionStorage.getItem('nexhook_token');
  if (!token) return false;
  try {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.ok;
  } catch (err) {
    console.error('Session verification failed:', err);
    return false;
  }
}
