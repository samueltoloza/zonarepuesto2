import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect index to locations page
  redirect('/protected/headquarter/locations')
}
