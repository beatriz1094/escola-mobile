import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const uri = import.meta.env.VITE_API_URI || 'http://localhost:3000'
axios.defaults.baseURL = uri

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [alertData, setAlertData] = useState<{ title: string; message: string } | null>(null)

  function handleLogin() {
    axios.post('/login', { email, senha })
      .then(response => ({ status: response.status, response: response.data }))
      .then(({ status, response }) => {
        if (status === 200) {
          setAlertData({ title: 'Sucesso', message: 'Login realizado com sucesso!' })
          window.localStorage.setItem('professor', JSON.stringify(response))
          setTimeout(() => {
            navigate('/home')
          }, 1000)
        }
      })
      .catch((error) => {
        const status = error?.response?.status
        if (status === 401) {
          setAlertData({ title: 'Erro', message: 'Falha no login. Verifique suas credenciais.' })
          return
        }
        setAlertData({ title: 'Erro', message: 'Erro ao conectar com o servidor. Tente novamente mais tarde.' })
      })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="w-full max-w-md">
        <Card className="w-full bg-white rounded-lg shadow-md border border-gray-200">
          <CardHeader className='text-center border-b border-gray-300 py-6'>
            <CardTitle className="text-3xl font-semibold text-gray-900">Faça seu Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-8 py-6">
            {alertData && (
              <Alert className={`
                rounded-md px-4 py-3 mb-4
                ${alertData.title === 'Sucesso' 
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'}
              `}>
                <AlertTitle className="font-bold">{alertData.title}</AlertTitle>
                <AlertDescription>{alertData.message}</AlertDescription>
              </Alert>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition-colors shadow-md"
            >
              Entrar
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  )
}

export default Login
