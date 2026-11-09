const API = 'http://localhost:5001/api';
const userStr = localStorage.getItem('finbit_user');
const user = userStr ? JSON.parse(userStr) : null;
const headers = { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'application/json' };

if (!user || user.role !== 'admin') {
  document.getElementById('admin-info').innerHTML = `Not an admin. <a href="/" style="color: #DBA030">Go to Login</a>`;
  document.getElementById('content').innerHTML = `<div class="empty">Access Denied. Only Admin can access this page.</div>`;
} else {
  document.getElementById('admin-info').innerHTML = `Welcome, <strong>${user.name}</strong>`;
  document.getElementById('tabs').style.display = 'flex';
  loadTab('users');
}


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

  if (data.length === 0) {
    content.innerHTML = '<div class="empty">No users found.</div>';
    return;
  }

  content.innerHTML = `
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>A/C No.</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${data.map(u => {
        const acc = u.account || {};
        return `<tr>
          <td><strong>${u.name}</strong></td>
          <td>${u.email}</td>
          <td>${acc.accountNumber || '-'}</td>
          <td>₹${acc.balance?.toLocaleString() || 0}</td>
          <td><span class="status-badge ${acc.isFrozen ? 'status-frozen' : 'status-active'}">${acc.isFrozen ? 'Frozen' : 'Active'}</span></td>
          <td>${acc._id ? `<button class="btn ${acc.isFrozen ? 'btn-green' : 'btn-red'}" onclick="toggleFreeze('${acc._id}')">${acc.isFrozen ? 'Unfreeze' : 'Freeze'}</button>` : '-'}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
}

async function fetchTickets() {
  const res = await fetch(`${API}/admin/tickets`, { headers });
  const data = await res.json();
  const content = document.getElementById('content');

  if (data.length === 0) {
    content.innerHTML = '<div class="empty">No support tickets yet.</div>';
    return;
  }

  content.innerHTML = data.map(t => `
    <div class="ticket-card">
      <h3>${t.subject}</h3>
      <p class="meta">By ${t.user?.name} • ${new Date(t.createdAt).toLocaleString()}</p>
      <p>${t.description}</p>
      <p class="meta">Status: <span class="status-badge ${t.status === 'open' ? 'status-frozen' : 'status-active'}">${t.status.toUpperCase()}</span></p>
      ${t.adminReply ? `<div style="background: #FFF; padding: 1rem; border-radius: 10px; margin-top: 1rem;"><strong style="color: #DBA030;">Admin Reply:</strong> ${t.adminReply}</div>` : ''}
      ${t.status === 'open' ? `
        <textarea id="reply-${t._id}" placeholder="Type your reply..." rows="2"></textarea>
        <button class="btn btn-gold" onclick="replyTicket('${t._id}')">Send Reply & Resolve</button>
      ` : ''}
    </div>
  `).join('');
}

async function fetchLoans() {
  const res = await fetch(`${API}/admin/loans`, { headers });
  const data = await res.json();
  const content = document.getElementById('content');

  if (data.length === 0) {
    content.innerHTML = '<div class="empty">No loans found.</div>';
    return;
  }

  content.innerHTML = `
    <table>
      <thead><tr><th>User</th><th>Type</th><th>Amount</th><th>EMI</th><th>Tenure</th><th>Status</th></tr></thead>
      <tbody>${data.map(l => `<tr>
        <td><strong>${l.user?.name}</strong></td>
        <td style="text-transform:capitalize;">${l.loanType}</td>
        <td>₹${l.amount?.toLocaleString()}</td>
        <td>₹${l.emi?.toLocaleString()}</td>
        <td>${l.tenureMonths} months</td>
        <td><span class="status-badge status-active">${l.status.toUpperCase()}</span></td>
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
