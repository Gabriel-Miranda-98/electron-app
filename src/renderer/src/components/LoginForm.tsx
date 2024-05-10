import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Usuário e obrigatório e deve ter no mínimo 2 caracteres.',
  }),
  password: z.string({
    message: 'Senha e obrigatório.',
  }),
})

type loginFormaSchema = z.infer<typeof FormSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const form = useForm<loginFormaSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: loginFormaSchema) {
    setLoading(true)
    const { message, success } = await window.api.connect({
      password: data.password,
      user: data.username,
    })
    if (!success) {
      toast({
        variant: 'destructive',
        title: message,
        description: 'Verifique se o usuário e a senha estão corretos.',
      })
      setLoading(false)
      return null
    }
    toast({
      title: message,
      className: 'bg-green-500',
      duration: 500,
    })

    setLoading(false)
    navigate('/monitor')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário:</FormLabel>
              <FormControl>
                <Input placeholder="usuário" {...field} />
              </FormControl>
              <FormDescription>
                Usuário que você utiliza para se conectar ao banco de dados
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha:</FormLabel>
              <FormControl>
                <Input type="password" placeholder="senha" {...field} />
              </FormControl>
              <FormDescription>
                Senha que você utiliza para se conectar ao banco de dados
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Entrar'}
        </Button>
      </form>
    </Form>
  )
}
