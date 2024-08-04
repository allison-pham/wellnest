"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore, storage } from "@/firebase";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import SearchIcon from "@mui/icons-material/Search";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async () => {
    if (!itemName) return;
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    setItemName("");
    setFile(null);
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    // Update inventory item with the image URL
    console.log(url);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem();
                handleUpload();
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
          <input type="file" onChange={handleFileChange} />
        </Box>
      </Modal>
      <Stack direction="row" spacing={2}>
        <TextField
          variant="outlined"
          placeholder="Search Items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton onClick={handleOpen}>
          <AddPhotoAlternateIcon />
        </IconButton>
      </Stack>
      <Box>
        {inventory
          .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              width={300}
              m={1}
              p={1}
              border="1px solid gray"
              borderRadius={1}
            >
              <Typography>{item.name}</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(item.name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
      </Box>
    </Box>
  );
}
