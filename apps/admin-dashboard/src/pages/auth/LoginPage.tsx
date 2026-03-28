import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../features/auth/authSlice';
import type { RootState } from '../../store/store';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  console.log('[LoginPage] auth state:', authState);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[LoginPage] form submitted, email:', email, 'password:', password);

    dispatch(loginStart());
    console.log('[LoginPage] dispatched loginStart');

    setTimeout(() => {
      console.log('[LoginPage] timeout fired, dispatching loginSuccess');
      dispatch(loginSuccess({
        user: {
          user_id: '1',
          email,
          full_name: 'Admin User',
          role: 'federal_admin',
          admin_unit_id: 'FED-001',
          permissions: [],
          created_at: new Date().toISOString(),
        },
        token: 'mock-token',
      }));
      console.log('[LoginPage] dispatched loginSuccess');
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,.12)', width: 360 }}>
        <h2 style={{ margin: '0 0 8px', textAlign: 'center' }}>🏙️ CitiScope</h2>
        <p style={{ margin: '0 0 24px', textAlign: 'center', color: '#666' }}>Admin Dashboard</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Email</label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, boxSizing: 'border-box' }}
              placeholder="admin@citiscope.com"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, boxSizing: 'border-box' }}
              placeholder="any password"
            />
          </div>

          {authState.error && (
            <p style={{ color: '#d32f2f', marginBottom: 16, textAlign: 'center' }}>{authState.error}</p>
          )}

          <button
            type="submit"
            style={{
              width: '100%', padding: '12px', background: '#1976d2', color: '#fff',
              border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </form>

        <p style={{ marginTop: 16, textAlign: 'center', color: '#888', fontSize: 13 }}>
          Enter any email + any password
        </p>
      </div>
    </div>
  );
};
