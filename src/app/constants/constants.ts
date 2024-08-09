const apiUrl = 'http://localhost:4200/api';

export const ApiEndpoints = {
  Auth: {
    Login: `${apiUrl}/auth/login`,
    Logout: `${apiUrl}/auth/logout`,
    RefreshToken: `${apiUrl}/auth/refresh-token`,
    CheckAuth: `${apiUrl}/auth/check-auth`
  },
  Users: {
    GetUserDetails: '/api/users',
    GetAllUsers: '/api/users/all',
    CreateUser: '/api/users',
    UpdateUser: '/api/users',
    DeleteUser: '/api/users'
  },
  Stores: {
    GetAll: '/api/stores',
    GetById: '/api/stores',
    Create: '/api/stores',
    Update: '/api/stores',
    Delete: '/api/stores',
  }
};


export const LocalStorage = {
  token: 'access-token',
  isLoggedIn: "isLoggedIn"
}
