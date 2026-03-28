import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@citiscope/store';
import { loginStart, loginSuccess, loginFailure, logout } from '@citiscope/store';
import type { LoginCredentials } from '@citiscope/types';

/** Access auth state and actions from anywhere in the app. */
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    dispatch(loginStart());
    try {
      // Replace with real API call
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      dispatch(loginSuccess({ user: data.user, token: data.token }));
    } catch (err) {
      dispatch(loginFailure(err instanceof Error ? err.message : 'Login failed'));
    }
  };

  const logoutUser = () => dispatch(logout());

  return { ...auth, login, logout: logoutUser };
}
