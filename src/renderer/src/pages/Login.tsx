import { LoginForm } from '../components/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'

export function Login() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Entre com seu usuário e senha do banco de dados.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <LoginForm />
      </CardContent>
    </Card>
  )
}
