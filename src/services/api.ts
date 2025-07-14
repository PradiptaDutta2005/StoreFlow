//const API_BASE = 'http://localhost:5000/api';
const API_BASE = import.meta.env.VITE_API_BASE;
// Helper function to handle HTTP errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Define types for API responses
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export const api = {
  // Customer endpoints
  async getCustomers() {
    const response = await fetch(`${API_BASE}/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  },

  async getCustomer(phoneNumber: string) {
    const response = await fetch(`${API_BASE}/customers/${phoneNumber}`);
    if (!response.ok) throw new Error('Customer not found');
    return response.json();
  },

  async createCustomer(customer: any) {
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create customer');
    }
    return response.json();
  },

  async updateCustomer(phoneNumber: string, updates: any) {
    const response = await fetch(`${API_BASE}/customers/${phoneNumber}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update customer');
    return response.json();
  },

  // Product endpoints
  async getProducts(params?: { name?: string; category?: string }) {
    let url = `${API_BASE}/products`;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.name) searchParams.append('name', params.name);
      if (params.category) searchParams.append('category', params.category);
      if (searchParams.toString()) url += `?${searchParams.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProduct(productId: string) {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  },

  async createProduct(product: any) {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  async updateProduct(productId: string, updates: any) {
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  async deleteProduct(productId: string) {
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  // Order endpoints
  async getOrders(params?: { customerId?: string; status?: string; startDate?: string; endDate?: string }) {
    let url = `${API_BASE}/orders`;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.customerId) searchParams.append('customerId', params.customerId);
      if (params.status) searchParams.append('status', params.status);
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      if (searchParams.toString()) url += `?${searchParams.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async createOrder(order: any) {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  // Employee endpoints
  async getEmployees() {
    const response = await fetch(`${API_BASE}/employees`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  async getEmployee(employeeId: string) {
    const response = await fetch(`${API_BASE}/employees/${employeeId}`);
    if (!response.ok) throw new Error('Employee not found');
    return response.json();
  },

  async updateEmployee(employeeId: string, updates: any) {
    const response = await fetch(`${API_BASE}/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  },
  async employeeLogin(employeeId: string, password: string) {
  const response = await fetch(`${API_BASE}/employees/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return response.json(); // returns employee object
},

  // Alert endpoints
  async getAlerts(params?: { employeeId?: string }) {
    let url = `${API_BASE}/alerts`;
    if (params?.employeeId) {
      url += `?employeeId=${params.employeeId}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async createAlert(alert: any) {
    const response = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    });
    if (!response.ok) throw new Error('Failed to create alert');
    return response.json();
  },

  async updateAlert(alertId: string, updates: any) {
    const response = await fetch(`${API_BASE}/alerts/${alertId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update alert');
    return response.json();
  },

  async createEmployee(employee: any) {
    const response = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  },

  async deleteEmployee(employeeId: string) {
    const response = await fetch(`${API_BASE}/employees/${employeeId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
    return response.json();
  }
};
