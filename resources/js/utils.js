import axios from 'axios'

export async function consultarCep(cep, ufs = []) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    const info = response.data

    if (info.erro) {
      throw new Error('CEP não encontrado.')
    }

    const ufEncontrada = ufs.find(uf => uf.label === info.uf)

    return {
      endereco: info.logradouro || '',
      bairro: info.bairro || '',
      cidade: info.localidade || '',
      uf: ufEncontrada?.value || '',
    }
  } catch (err) {
    console.error('Erro ao consultar CEP:', err.message)
    return null
  }
}
