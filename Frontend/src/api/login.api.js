const loginUser = async (email, password) => {
    try {
      const response = await fetch('/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      return data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };
  export {loginUser}