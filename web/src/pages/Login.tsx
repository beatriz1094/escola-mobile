import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const uri = import.meta.env.VITE_API_URI || 'http://10.87.202.152:3000'
axios.defaults.baseURL = uri

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [alertData, setAlertData] = useState<{ title: string; message: string } | null>(null)

  function handleLogin() {
    axios.post('/login', { email, senha })
      .then(response => { return { status: response.status, response: response.data } })
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
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0f172a] text-gray-100">
      <form
        onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
        className="w-full max-w-md"
      >
        <Card className="w-full bg-gray-900 border border-gray-700 shadow-xl rounded-2xl">
          <CardHeader className="text-center border-b border-gray-800 pb-4">
            <CardTitle className="text-2xl font-semibold text-blue-400">Bem-vindo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {alertData && (
              <Alert className={`rounded-lg ${
                alertData.title === 'Sucesso'
                  ? 'bg-green-900/30 border-green-600 text-green-400'
                  : 'bg-red-900/30 border-red-600 text-red-400'
              }`}>
                <AlertTitle>{alertData.title}</AlertTitle>
                <AlertDescription>{alertData.message}</AlertDescription>
              </Alert>
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 rounded-lg"
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 rounded-lg"
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md"
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
