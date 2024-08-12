"use client";

import { useEffect, useState } from "react";
import { firestore } from "../firebaseConfig";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import styles from "./Inventory.module.css";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "pantryItems"),
      (snapshot) => {
        const itemsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsArray);
      }
    );

    return () => unsubscribe();
  }, []);

  const addItem = async () => {
    if (newItem) {
      await addDoc(collection(firestore, "pantryItems"), {
        name: newItem,
        quantity: 1,
        createdAt: serverTimestamp(),
      });
      setNewItem("");
    }
  };

  const updateQuantity = async (id, increment) => {
    const itemRef = doc(firestore, "pantryItems", id);
    const item = items.find((item) => item.id === id);
    if (item) {
      await updateDoc(itemRef, {
        quantity: item.quantity + increment,
      });
    }
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(firestore, "pantryItems", id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Inventory</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button className={styles.addButton} onClick={addItem}>
          Add item
        </button>
      </div>
      <div className={styles.itemsContainer}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <h3>{item.name}</h3>
            <p>Quantity</p>
            <div className={styles.quantityContainer}>
              <button
                className={styles.quantityButton}
                onClick={() => updateQuantity(item.id, -1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className={styles.quantityButton}
                onClick={() => updateQuantity(item.id, 1)}
              >
                +
              </button>
            </div>
            <button
              className={styles.deleteButton}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
