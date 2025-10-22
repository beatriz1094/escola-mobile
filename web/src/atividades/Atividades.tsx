import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const uri = import.meta.env.VITE_API_URI || 'http://10.87.202.152:3000'
axios.defaults.baseURL = uri

function Atividades() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const id = state?.turmaId || ''
  const turma = state?.nome || ''
  const professor = JSON.parse(window.localStorage.getItem('professor') ?? '{}')

  const [atividades, setAtividades] = useState<Array<{ id: number; descricao: string }>>([])
  const [open, setOpen] = useState(false)
  const [descricao, setDescricao] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!professor.id) {
      window.localStorage.removeItem('professor')
      sair()
      return
    }
    loadAtividades()
  }, [])

  function loadAtividades() {
    axios.get('/atividade/' + id)
      .then(response => setAtividades(response.data))
      .catch(error => console.error('Erro ao buscar atividades:', error))
  }

  function sair() {
    navigate('/home')
  }

  return (
    <>
      {/* Cabeçalho */}
      <header className="w-full bg-gray-900 text-gray-100 flex flex-row items-center justify-between px-8 h-16 shadow-lg border-b border-gray-800">
        <h1 className="font-semibold text-lg text-blue-400">{professor.nome}</h1>
        <Button
          variant="destructive"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 rounded-lg transition-all shadow-sm"
          onClick={sair}
        >
          Voltar
        </Button>
      </header>

      {/* Conteúdo principal */}
      <main className="min-h-screen flex items-start justify-center p-6 bg-[#0f172a] text-gray-100">
        <div className="w-full max-w-4xl space-y-6">
          
          {/* Botão de cadastrar atividade */}
          <div className="w-full flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all">
                  + Nova Atividade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-900 text-gray-100 rounded-2xl shadow-lg border border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-blue-400 text-lg font-semibold">Nova atividade</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Digite a descrição da atividade para adicioná-la à turma.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const turmaId = Number(id)
                    if (!turmaId) {
                      console.error('turmaId inválido')
                      return
                    }
                    setSubmitting(true)
                    axios.post('/atividade', { descricao, turmaId })
                      .then(() => {
                        setDescricao("")
                        setOpen(false)
                        loadAtividades()
                      })
                      .catch(error => console.error('Erro ao cadastrar atividade:', error))
                      .finally(() => setSubmitting(false))
                  }}
                  className="space-y-4"
                >
                  <Input
                    type="text"
                    placeholder="Descrição da atividade"
                    value={descricao}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 rounded-lg"
                    required
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={submitting || !descricao.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      {submitting ? 'Enviando...' : 'Salvar'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Nome da turma */}
          <h2 className="text-blue-400 font-semibold text-xl">
            <b>Turma:</b> {turma}
          </h2>

          {/* Lista de atividades */}
          {atividades.length === 0 ? (
            <p className="text-gray-400 italic">Nenhuma atividade cadastrada ainda.</p>
          ) : (
            <ul className="space-y-3">
              {atividades.map(atividade => (
                <li
                  key={atividade.id}
                  className="w-full flex justify-between items-center px-5 py-3 bg-gray-900 border border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all"
                >
                  <span className="text-gray-100 font-medium">
                    {atividade.id} — {atividade.descricao}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}

export default Atividades
