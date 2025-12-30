import fetch from 'node-fetch'
import FormData from 'form-data'

const uploadImage = async (buffer) => {
  if (!buffer) throw new Error('Buffer kosong')

  const form = new FormData()
  form.append('images', buffer, {
    filename: 'image.jpg',
    contentType: 'image/jpeg'
  })

  const res = await fetch('https://telegraph.zorner.men/upload', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  })

  if (!res.ok) {
    throw new Error('Gagal upload ke Telegraph')
  }

  const json = await res.json()

  if (!json || !json.links || !json.links[0]) {
    throw new Error('Response Telegraph tidak valid')
  }

  return json.links[0]
}

export default uploadImage