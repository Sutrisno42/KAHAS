export interface AuthModel {
  token: string
}

export interface UserModel {
  data: { token: any; user: any }
  user: {
    id: number,
    name: string,
    email: string,
    email_verified_at: string,
    username: string,
    phone: string,
    role: string,
    created_at: string,
    updated_at: string,
    deleted_at: string | null
  },
    token:AuthModel,
}
