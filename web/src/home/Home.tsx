import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from 'axios'

const uri = import.meta.env.VITE_API_URI || 'http://localhost:3000'
axios.defaults.baseURL = uri

function Home() {
    const navigate = useNavigate()
    const professor = JSON.parse(window.localStorage.getItem('professor') ?? '{}')
    const [turmas, setTurmas] = useState<Array<{ id: number; nome: string }>>([])
    const [open, setOpen] = useState(false)
    const [nome, setNome] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!professor.id) {
            sair()
            return
        }
        axios.get('/turma/' + professor.id)
            .then(response => { setTurmas(response.data) })
            .catch(error => {
                console.error('Erro ao buscar turmas:', error)
            })
    }, [])

    function sair() {
        window.localStorage.removeItem('professor')
        navigate('/login')
    }

    function excluir(turmaId: number) {
        axios.delete('/turma/' + turmaId)
            .then(response => { return { status: response.status, response: response.data } })
            .then(({ status }) => {
                if (status === 204) {
                    setTurmas(turmas.filter(turma => turma.id !== turmaId))
                    return
                }
            })
            .catch((error) => {
                const status = error?.response?.status
                if (status === 409) {
                    alert(error?.response.data?.message || 'Falha ao excluir turma.')
                    return
                }
            })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!nome.trim()) return
        setSubmitting(true)
        try {
            const response = await axios.post('/turma', { nome, professorId: professor.id })
            if (response.status === 201) {
                setTurmas([...turmas, response.data])
                setNome('')
                setOpen(false)
            }
        } catch (error) {
            alert('Erro ao cadastrar turma. Tente novamente.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <header className="w-full bg-blue-100 text-blue-900 flex items-center justify-between p-4 shadow-sm">
                <h1 className="font-semibold text-xl">{professor.nome}</h1>
                <Button
                    variant="destructive"
                    className="bg-red-300 hover:bg-red-400 text-red-900 py-2 px-4 rounded-lg"
                    onClick={() => sair()}
                >
                    Sair
                </Button>
            </header>

            <main className="min-h-screen flex items-center justify-center p-6 bg-blue-50">
                <div className="w-full max-w-4xl space-y-8 flex flex-col">
                    <div className="flex justify-end">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-400 hover:bg-blue-300 text-white py-2 px-5 rounded-lg shadow-sm">
                                    Cadastrar turma
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg p-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold text-gray-900">
                                        Nova turma
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-600 text-sm">
                                        Informe o nome da turma e confirme para cadastrar.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                                    <Input
                                        type="text"
                                        placeholder="Nome da turma"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={submitting || !nome.trim()}
                                            className="bg-blue-400 hover:bg-blue-300 text-white py-2 px-5 rounded-lg transition-shadow shadow-sm disabled:opacity-60"
                                        >
                                            {submitting ? 'Enviando...' : 'Salvar'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800">Turmas</h2>

                    <ul className="space-y-4">
                        {turmas.map(turma => (
                            <li
                                key={turma.id}
                                className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-200"
                            >
                                <span className="text-lg text-gray-900">{turma.id} - {turma.nome}</span>
                                <div className="flex gap-3">
                                    <Button
                                        className="bg-red-300 hover:bg-red-400 text-red-900 py-1.5 px-4 rounded-md shadow-sm"
                                        onClick={() => excluir(turma.id)}
                                    >
                                        Excluir
                                    </Button>
                                    <Button
                                        className="bg-teal-400 hover:bg-teal-300 text-white py-1.5 px-4 rounded-md shadow-sm"
                                        onClick={() => {
                                            navigate('/atividades', { state: { turmaId: turma.id, nome: turma.nome } })
                                        }}
                                    >
                                        Visualizar
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </>
    )
}

export default Home
