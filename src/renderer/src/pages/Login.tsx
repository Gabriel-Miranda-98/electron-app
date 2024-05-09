import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
const schema = z.object({
  user: z.string(),
  password: z.string(),
})

export type Schema = z.infer<typeof schema>
export function Login() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  async function handleConnectDatabase(data: Schema) {
    const response = await window.api.connect({
      password: data.password,
      user: data.user,
    })
    console.log(response)
    navigate('/monitor')
  }
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(handleConnectDatabase)}
    >
      <input {...register('user')} type="text" placeholder="Usuário" />
      <input {...register('password')} type="password" placeholder="senha" />
      <button type="submit">Logar</button>
    </form>
  )
}
