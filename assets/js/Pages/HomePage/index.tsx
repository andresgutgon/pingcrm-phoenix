export default function HomePage({ firstName }: { firstName: string }) {
  return (
    <div>
      <div>Hello {firstName}</div>
      <input type='text' name='lol' />
    </div>
  )
}
