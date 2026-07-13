export function useStateScope() {
  // Read user from localStorage (set during login)
  const storedUserStr = localStorage.getItem('user');
  const user = storedUserStr ? JSON.parse(storedUserStr) : null;
  const isSuperAdmin = user?.roles?.includes('Super Admin');
  
  // State users are scoped strictly to their state
  const scopedState = user?.state ? user.state : null;
  const isScoped = Boolean(scopedState) && !isSuperAdmin;

  return { isScoped, scopedState };
}
