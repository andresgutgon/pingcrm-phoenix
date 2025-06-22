export interface Organization {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  country: string
  postal_code: string
  deleted_at: string
  contacts: Contact[]
}

export interface Contact {
  id: number
  name: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  country: string
  postal_code: string
  deleted_at: string
  organization_id: number
  organization: Organization
}

export interface Account {
  id: number
  name: string
}

export interface User {
  id: number
  name: string
  first_name: string
  last_name: string
  email: string
  confirmed_at: string
  authenticated_at: string
  deleted_at: string
}

export type ConcretePageProps = Record<string, unknown>
export type PageProps<T extends ConcretePageProps = ConcretePageProps> = T & {
  ssr?: boolean
  currentPath: string
  auth: {
    user: User
    account: Account
    role: 'admin' | 'member'
  }
  flash: {
    success: string | null
    error: string | null
    info: string | null
    warning: string | null
  }
}
