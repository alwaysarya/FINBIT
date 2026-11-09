const API = 'http://localhost:5001/api';
const userStr = localStorage.getItem('finbit_user');
const user = userStr ? JSON.parse(userStr) : null;

if (!user || user.role !== 'admin') {
  document.getElementById('admin-info').innerHTML = `Not an admin. <a href="/" style="color:#4F46E5">Go to Login</a>`;
  document.getElementById('content').innerHTML = `<p style="padding:2rem; background:#141414; border-radius:12px; border:1px solid #2A2A2A;">Access Denied. Only Admin can access this page.</p>`;
} else {
  document.getElementById('admin-info').innerHTML = `Welcome, ${user.name}`;
  document.getElementById('tabs').style.display = 'flex';
  loadTab('users');
}

const headers = { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'application/json' };

window.switchTab = (tab, event) => {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
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
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>A/C No.</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${data.map(u => {
        const acc = u.account || {};
        return `<tr>
          <td>${u.name}</td><td>${u.email}</td><td>${acc.accountNumber || '-'}</td><td>₹${acc.balance || 0}</td>
          <td>${acc.isFrozen ? 'Frozen' : 'Active'}</td>
          <td>${acc._id ? `<button class="btn ${acc.isFrozen ? 'btn-green' : 'btn-red'}" onclick="toggleFreeze('${acc._id}')">${acc.isFrozen ? 'Unfreeze' : 'Freeze'}</button>` : '-'}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
}

async function fetchTickets() {
  const res = await fetch(`${API}/admin/tickets`, { headers });
  const data = await res.json();
  const content = document.getElementById('content');

  content.innerHTML = data.length === 0 ? '<p>No tickets.</p>' : data.map(t => `
    <div class="ticket-card">
      <h3>${t.subject} <span style="font-size:0.8rem; color:#A1A1AA;">by ${t.user?.name}</span></h3>
      <p style="color:#A1A1AA; margin-bottom:1rem;">${t.description}</p>
      <p style="font-size:0.8rem; color:#A1A1AA; margin-bottom:1rem;">Status: ${t.status.toUpperCase()} | ${new Date(t.createdAt).toLocaleString()}</p>
      ${t.adminReply ? `<div style="background:#0A0A0A; padding:1rem; border-radius:8px; margin-bottom:1rem;"><strong>Admin Reply:</strong> ${t.adminReply}</div>` : ''}
      ${t.status === 'open' ? `
        <textarea id="reply-${t._id}" placeholder="Reply..." rows="2"></textarea>
        <button class="btn btn-blue" onclick="replyTicket('${t._id}')">Send Reply</button>
      ` : ''}
    </div>
  `).join('');
}

async function fetchLoans() {
  const res = await fetch(`${API}/admin/loans`, { headers });
  const data = await res.json();
  const content = document.getElementById('content');

  content.innerHTML = `
    <table>
      <thead><tr><th>User</th><th>Type</th><th>Amount</th><th>EMI</th><th>Tenure</th><th>Status</th></tr></thead>
      <tbody>${data.map(l => `<tr>
        <td>${l.user?.name}</td><td style="text-transform:capitalize;">${l.loanType}</td><td>₹${l.amount}</td><td>₹${l.emi}</td><td>${l.tenureMonths} mo</td><td>${l.status.toUpperCase()}</td>
      </tr>`).join('')}</tbody>
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
