import React, { useState, useEffect } from "react";
import EditNote from "./EditNote";
import NoteTable from "./NoteTable";
import { useModal } from "./Modals";
import ModalConfirmation from "./ModalConfirmation";
import { useAlert } from "./AlertContext";
import { Search } from "./Search";
import { noteApi } from "../api/noteApi";

function TableActivo({ updateNotes, showNotes, setEditMode, editMode, setShowNewCategory }) {
  const [listNotes, setListNotes] = useState([]);
  const { showAlert } = useAlert();
  const [selectedNote, setSelectedNote] = useState(null);
  let idNoteSelected = 0;
  const { setModalOpen } = useModal();
  const messageArchive = "Archived note.";
  const messageActive = "Note activated.";
  const [searchByCategoryByNoteActive, setSearchByCategoryByNoteActive] =
    useState("");
  const [searchByCategoryByNoteArchived, setSearchByCategoryByNoteArchived] =
    useState("");
  const getNotes = async () => {
    try {
      const { data } = await noteApi.get("/Notes");
      setListNotes(data);
    } catch (error) {}
  };

  useEffect(() => {
    getNotes();
  }, [updateNotes]);

  const deleteNote = async () => {
    try {
      await noteApi.delete(`/deleteNote/${idNoteSelected}`);
      getNotes();
      onClose();
      showAlert("The note has been deleted.", "error");
    } catch (error) {
      showAlert("Oops, an error occurred.", "error");
    }
  };

  const handleEditClick = (note) => {
    setEditMode(true);
    setSelectedNote(note);
    showNotes(false);
    setShowNewCategory(false);
  };

  const closeEditNote = () => {
    setEditMode(false);
    setSelectedNote(null);
  };

  const filterNotesByState = (state) => {
    return listNotes.filter((note) => note.id_state === state);
  };
  const onClose = () => {
    setModalOpen(false, "");
  };

  const handleDelete = (id) => {
    idNoteSelected = id;
    setModalOpen(
      true,
      <ModalConfirmation
        onClose={onClose}
        handleAccept={deleteNote}
        title={"Delete"}
        message={"Are you sure you want to delete this note?"}
        typeOfOption={"Delete"}
      />,
      500
    );
  };
  return (
    <div>
      {editMode && (
        <EditNote
          note={selectedNote}
          onCloseUpdate={closeEditNote}
          updateChange={getNotes}
        />
      )}
      <div className="flex h-full  justify-between flex-col xl:flex-row">
        <div className="mx-auto w-full max-w-2xl rounded-sm border border-gray-200 bg-white shadow-lg">
          <header className="border-b border-gray-100 px-5 py-4">
            <div className="font-semibold text-gray-800">Active Notes</div>
            <Search
              searchByCategory={searchByCategoryByNoteActive}
              setSearchByCategory={setSearchByCategoryByNoteActive}
            />
          </header>

          <div className="overflow-x-auto p-3">
            <NoteTable
              notes={filterNotesByState(1)}
              onDelete={handleDelete}
              onEditClick={handleEditClick}
              onNumberChange={getNotes}
              messageNote={messageArchive}
              categoryFiltered={searchByCategoryByNoteActive}
              updateChange={getNotes}
            />
          </div>
        </div>
        <div className="mx-auto w-full max-w-2xl rounded-sm border border-gray-200 bg-white shadow-lg">
          <header className="border-b border-gray-100 px-5 py-4">
            <div className="font-semibold text-gray-800">Archived notes</div>
            <Search setSearchByCategory={setSearchByCategoryByNoteArchived} />
          </header>

          <div className="overflow-x-auto p-5">
            <NoteTable
              notes={filterNotesByState(2)}
              onDelete={handleDelete}
              onEditClick={handleEditClick}
              onNumberChange={getNotes}
              messageNote={messageActive}
              categoryFiltered={searchByCategoryByNoteArchived}
              updateChange={getNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableActivo;
