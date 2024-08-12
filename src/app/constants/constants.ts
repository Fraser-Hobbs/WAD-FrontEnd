export const ApiEndpoints = {
  Auth: {
    Login: `/api/auth/login`,
    Logout: `/api/auth/logout`,
    RefreshToken: `/api/auth/refresh-token`,
    CheckAuth: `/api/auth/check-auth`
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
