export const formatarData = (data) => {
  if (!data) return "N/A"

  try {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return data
  }
}

export const formatarDataCurta = (data) => {
  if (!data) return "N/A"

  try {
    return new Date(data).toLocaleDateString("pt-BR")
  } catch {
    return data
  }
}

export const formatarValor = (valor) => {
  if (!valor) return "N/A"

  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  } catch {
    return `R$ ${valor}`
  }
}

export const formatarNumero = (numero) => {
  if (numero === undefined || numero === null) return "0"

  return new Intl.NumberFormat("pt-BR").format(numero)
}

export const truncarTexto = (texto, limite = 100) => {
  if (!texto) return ""
  if (texto.length <= limite) return texto
  return texto.substring(0, limite) + "..."
}

export const decodeHtmlEntities = (html) => {
  if (!html) return ""
  const textarea = document.createElement("textarea")
  textarea.innerHTML = html
  return textarea.value
}

export const trimAndCleanText = (text) => {
  if (!text) return "";
  const decodedText = decodeHtmlEntities(text);

  return decodedText.replace(/\s+/g, ' ').trim();
};

export const parseDateDDMMYYYY = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}
