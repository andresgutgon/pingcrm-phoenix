export type PageProps = {
  ssr?: boolean
}

export type Nomination = {
  id: number
  name: string
  gender: string
  year: number
  movie: string
  won: boolean
  age: number
}
