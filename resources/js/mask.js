const mask = {
  cpf(value = '') {
    return String(value)
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  },

  cnpj(value = '') {
    return String(value)
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  },

  cep(value = '') {
    return String(value)
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2');
  },

  telefone(value = '') {
    return String(value)
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
  },

  data(value = '') {
    return String(value)
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2');
  },

  
  hora(value = '') {
    return String(value)
    .replace(/\D/g, '')               
    .replace(/^(\d{2})(\d)/, '$1:$2') 
    .replace(/^(\d{2}:\d{2})(\d)/, '$1:$2') 
    .slice(0, 8);                     
  },
  
  
  unmask(value) {
    return String(value)
      .replace(/\D/g, '')
  }
}

export default mask;
