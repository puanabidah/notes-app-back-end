const { nanoid } = require('nanoid');
const notes = require('./notes');

// buat fungsi handler untuk route
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  // cek apakah newNote sudah masuk ke dalam array notes?
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // gunakan isSuccess untuk menentukan respons yang diberikan server
  // jika sukses maka masuk ke kondisi if
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  // jika gagal maka tdk masuk ke kondisi if, dan berlanjut kebawah ini
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  // perlu mengambil nilai id
  const { id } = request.params;

  // mendapatkan data notes yg dikirimkan oleh client melalui body request
  const { title, tags, body } = request.payload;
  // dapatkan nilai terbaru dari properti updatedAt
  const updatedAt = new Date().toISOString();

  // ubah catatan lama dengan data terbaru
  // buat dengan indexing array
  const index = notes.findIndex((note) => note.id === id);

  // menentukan gagal atau tidaknya permintaan dari nilai index menggunakan if else.
  // Bila note dengan id yang dicari ditemukan,
  // index akan bernilai array index dari objek catatan yang dicari.
  // Namun, bila tidak ditemukan, index akan bernilai -1.
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbaharui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  // lakukan pengecekan thdp nilai index, pastikan nilainya tidak -1 bila hendak menghapus catatan
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // bila tdk ditemukan
  const response = h.response({
    status: 'fail',
    messsage: ' Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
