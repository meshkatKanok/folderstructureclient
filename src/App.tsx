import axios from 'axios';
import { link } from 'fs';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';


type Inputs = {

  folder: string,
  filter: string

};
interface Folder {
  _id: string;
  name: string;
  folder: string,

}


function App() {
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [folderModal, setfolderModal] = useState(false);
  const [folderdata, setFolder] = useState<Folder[]>([])
  const closedeleteModal = () => {
    setdeleteModal(false);
  };
  const opendeleteModal = () => {
    setdeleteModal(true);
  };
  const openfolderModal = () => {
    setfolderModal(true);
  };
  const closefolderModal = () => {
    setfolderModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetch("https://backend-pink-seven.vercel.app/folder")
      .then(res => res.json())
      .then(data => setFolder(data))
  }, [folderdata])

  // Input post Data------------------------
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<Inputs>();
  const onSubmit = handleSubmit(data => {

    if (data) {
      const { folder } = data
      fetch('https://backend-pink-seven.vercel.app/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folder })
      });
reset()
      closeModal()
      closefolderModal()
    }



  });

  const handleDeleteFolder = (id: string) => {
    // Send DELETE request to backend API
    axios.delete(`https://backend-pink-seven.vercel.app/folder/${id}`)
      .then(res => {
        // Update state to remove deleted folder
         
        setFolder(folderdata.filter(allData => allData._id !== id));
         closedeleteModal()
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="App">
      <div style={{ padding: "2% 5%", width: "85%", height: "400px", margin: "0 auto", marginTop: "40px", background: "#191825", borderRadius: "10px" }}>
        <h1 style={{ color: "white", textAlign: "center" }}>Folder Structure</h1>
        {/* Root Folder-----------and other folder----------start */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "50%", margin: "0 auto" }}>

          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img style={{ width: "40px", height: "40px" }} src='https://i.ibb.co/9HdC8Kt/fileimge.png' alt="" />
              <h3 style={{ color: 'white' }}>Root</h3>

            </div>
            {Array.isArray(folderdata) && folderdata.map(folder => (

              <div style={{ display: "flex", alignItems: "center" }}>

                <img style={{ width: "40px", height: "40px" }} src='https://i.ibb.co/9HdC8Kt/fileimge.png' alt="" />
                <h3 style={{ color: 'white', marginRight: "10px" }}>{folder?.folder}</h3>
                <button style={{ color: "red", background: "none", fontSize: "20px",cursor:"pointer" }} onClick={opendeleteModal}>&times;</button>
                {deleteModal && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close" onClick={closedeleteModal}>&times;</span>
                      <h2>Delete {folder?.folder}</h2>
                      <button style={{ padding: "8px", cursor: "pointer", marginRight: "10px" }} type="button" onClick={closedeleteModal}>Cancel</button>
                      <button style={{ padding: "8px", cursor: "pointer" }} onClick={() => handleDeleteFolder(folder._id)}>Delete</button>
                    </div>
                  </div>
                )}

              </div>
            ))}

          </div>


          <div>
            <button style={{ padding: "8px", cursor: "pointer", marginTop: "20px" }} onClick={openModal}>+ New</button>


            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeModal}>&times;</span>
                  <h2>Add A New Folder</h2>
                  <form onSubmit={onSubmit}>

                    <input style={{ padding: "10px" }} {...register("folder")} placeholder="Folder Name" name='folder' type="text" id="input-field" />
                    <div className="button-group">
                      <button style={{ padding: "8px", cursor: "pointer" }} type="button" onClick={closeModal}>Cancel</button>
                      <input style={{ padding: "8px", cursor: "pointer" }} type="submit" value='Create' />
                    </div>
                  </form>
                </div>
              </div>
            )}
            {Array.isArray(folderdata) && folderdata.map(folder => (

              <div>
                <button style={{ padding: "8px", cursor: "pointer", marginTop: "20px" }} onClick={openfolderModal}>+ New</button>
                {folderModal && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close" onClick={closefolderModal}>&times;</span>
                      <h2>Add folder in {folder.folder ? folder.folder : "Folder"}</h2>
                      <form onSubmit={onSubmit}>

                        <input style={{ padding: "10px" }} {...register("folder")} placeholder="Folder Name" name='folder' type="text" id="input-field" />
                        <div className="button-group">
                          <button style={{ padding: "8px", cursor: "pointer" }} type="button" onClick={closefolderModal}>Cancel</button>
                          <input style={{ padding: "8px", cursor: "pointer" }} type="submit" value='Create' />
                        </div>
                      </form>
                    </div>
                  </div>

                )}



              </div>

            ))}




          </div>
        </div>
        {/* Root Folder-----------and other folder----------End*/}
      </div>

    </div>
  );
}

export default App;
