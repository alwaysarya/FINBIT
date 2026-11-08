const API = 'http://localhost:5001/api';
const userStr = localStorage.getItem('finbit_user');
const user = userStr ? JSON.parse(userStr) : null;

if (!user || user.role !== 'admin') {
  document.getElementById('admin-info').innerHTML = `Not an admin. <a href="/" style="color:#6366f1">Go to Login</a>`;
  document.getElementById('content').innerHTML = `<p style="padding:2rem; background:#1e293b; border-radius:12px;">Access Denied. Only Admin can access this page.</p>`;
} else {
  document.getElementById('admin-info').innerHTML = `Welcome Admin: ${user.name}`;
  document.getElementById('tabs').style.display = 'flex';
  loadTab('users');
}

const headers = { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'application/json' };

window.switchTab = (tab, event) => {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  loadTab(tab);
};

async function loadTab(tab) {
  if (tab === 'users') fetchUsers();
  if (tab === 'tickets') fetchTickets();
  if (tab === 'loans') fetchLoans();
}

async function fetchUsers() {
  const res = await fetch(`${API}/admin/users`, { headers });
  const data = await res.json();
  const content = document.getElementById('content');

  content.innerHTML = `
    <table class="admin-table">
      <thead><tr><th>Name</th><th>Email</th><th>A/C No.</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${data.map(u => {
        const acc = u.account || {};
        return `<tr>
          <td>${u.name}</td><td>${u.email}</td><td>${acc.accountNumber || '-'}</td><td>₹${acc.balance || 0}</td>
          <td>${acc.isFrozen ? '❄️ Frozen' : '✅ Active'}</td>
          <td>${acc._id ? `<button class="btn ${acc.isFrozen ? 'btn-unfreeze' : 'btn-freeze'}" onclick="toggleFreeze('${acc._id}')">${acc.isFrozen ? 'Unfreeze' : 'Freeze'}</button>` : '-'}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
}

async function fetchTickets() {
  const res = await fetch(`${API}/admin/tickets`, { headers });
  const data = await res.json();
  const content = document.getElementById('content');

  content.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:1rem;">
      ${data.length === 0 ? '<p>No tickets yet.</p>' : data.map(t => `
        <div style="background:#1e293b; padding:1.5rem; border-radius:12px; border-left: 4px solid ${t.status === 'open' ? '#f59e0b' : '#10b981'}">
          <h3 style="margin:0 0 0.5rem 0;">${t.subject} <span style="font-size:0.8rem; color:#94a3b8;">by ${t.user?.name}</span></h3>
          <p style="color:#cbd5e1; margin-bottom:1rem;">${t.description}</p>
          <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:1rem;">Status: ${t.status.toUpperCase()} | ${new Date(t.createdAt).toLocaleString()}</p>
          
          ${t.adminReply ? `<div style="background:#0f172a; padding:1rem; border-radius:8px; margin-bottom:1rem;"><strong style="color:#6366f1;">Admin Reply:</strong> ${t.adminReply}</div>` : ''}
          
          ${t.status === 'open' ? `
            <textarea id="reply-${t._id}" placeholder="Write your reply..." rows="2"></textarea>
            <button class="btn btn-reply" onclick="replyTicket('${t._id}')">Send Reply & Resolve</button>
          ` : ''}
        </div>
      `).join('')}
    </div>`;
}

async function fetchLoans() {
  const res = await fetch(`${API}/admin/loans`, { headers });
  const data = await res.json();
  const content = document.getElementById('content');

  content.innerHTML = `
    <table class="admin-table">
      <thead><tr><th>User</th><th>Type</th><th>Amount</th><th>EMI</th><th>Tenure</th><th>Status</th></tr></thead>
      <tbody>${data.map(l => `
        <tr>
          <td>${l.user?.name}</td>
          <td style="text-transform:capitalize;">${l.loanType}</td>
          <td>₹${l.amount}</td>
          <td>₹${l.emi}</td>
          <td>${l.tenureMonths} mo</td>
          <td>${l.status.toUpperCase()}</td>
        </tr>
      `).join('')}</tbody>
    </table>`;
}

window.toggleFreeze = async (id) => {
  await fetch(`${API}/admin/accounts/${id}/freeze`, { method: 'PUT', headers });
  fetchUsers();
};

window.replyTicket = async (id) => {
  const reply = document.getElementById(`reply-${id}`).value;
  if (!reply) return alert('Please write a reply');
  await fetch(`${API}/admin/tickets/${id}/reply`, {
    method: 'PUT', headers, body: JSON.stringify({ adminReply: reply, status: 'resolved' })
  });
  fetchTickets();
};
