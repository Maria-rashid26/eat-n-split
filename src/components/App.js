
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


export default function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddForm, setShowAddForm] = useState()
  const [selectedFriend, setSelectedFriend] = useState(null)



  function handleShowAddFriend() {
    return setShowAddForm((show) => !show)
  }

  function handleAddNewFriend(newFriend) {
    setFriends([...friends, newFriend])
    setShowAddForm(false)
  }
  function handleSplitBilllForm(friends) {
    // setSelectedFriend(friends)
    setSelectedFriend(currentFriend => currentFriend?.id === friends?.id ? null : friends)
    setShowAddForm(false)

  }

  function handleSplitBill(value) {
    setFriends(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null)
  }

  return <div className="app">
    <div className="sidebar">
      <FriendList friends={friends} handleSplitBilllForm={handleSplitBilllForm} selectedFriend={selectedFriend} />
      {showAddForm && <FormAddFriend onAddFriend={handleAddNewFriend} />}
      <Button onClick={handleShowAddFriend}>{showAddForm ? "Close" : "Add Friend"}</Button>

    </div>
    {selectedFriend && <FromSplitBill selectedFriend={selectedFriend} handleSplitBill={handleSplitBill} />}
  </div>
}

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

function FriendList({ friends, handleSplitBilllForm, selectedFriend }) {
  return <ul>
    {friends.map(friend => <Friends friend={friend} key={friend.id} handleSplitBilllForm={handleSplitBilllForm}
      selectedFriend={selectedFriend} />)}

  </ul>

}

function Friends({ friend, handleSplitBilllForm, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return <div className={isSelected ? "selected" : ""}>
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p>}
      {friend.balance > 0 && <p className="green">{friend.name} owe you {friend.balance}$</p>}
      {friend.balance === 0 && <p>You both are even</p>}
      <Button onClick={() => handleSplitBilllForm(friend)}>{isSelected ? "Close" : "Select"}</Button>
    </li>

  </div>

}



function FormAddFriend({ onAddFriend }) {

  const [name, setName] = useState()
  const [image, setImage] = useState("https://i.pravatar.cc/48")

  function handleSubmitAddFriend(e) {
    e.preventDefault()
    if (!name || !image) return;

    const id = crypto.randomUUID()
    const newfriend = {
      name, image: `${image}?=${id}`, id, balance: 0,
    }
    onAddFriend(newfriend)


    setName("")
    setImage("https://i.pravatar.cc/48")
  }

  return <form className="form-add-friend" onSubmit={handleSubmitAddFriend}>
    <label>🚶Friend Name </label>
    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

    <label>🖼 Image URL</label>
    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

    <Button onClick={handleSubmitAddFriend}>Add</Button>
  </form>
}

function FromSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("")
  const [userExpense, setUserExpense] = useState("")
  const [whoIsPayingBill, setWhoIsPayingBill] = useState("user")
  // const friendExpenses = bill ? bill - userExpense : ""

  const friendExpenses = parseFloat(bill - userExpense);

  function handleSubmit(e) {
    e.preventDefault()

    if (!bill || !userExpense) return;
    handleSplitBill(whoIsPayingBill === "user" ? friendExpenses : -friendExpenses)

  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill With {selectedFriend.name} </h2>
      <label>💰 Bill value</label>
      <input type="text"
        value={bill}
        //  onChange={(e)=> setBill(Number(e.target.value))}
        onChange={(e) => (parseFloat(e.target.value)) ? setBill(parseFloat(e.target.value)) : bill}
      />

      <label>🚶‍♂️ Your expense</label>
      <input type="text"
        value={userExpense}
        onChange={(e) => (parseFloat(e.target.value)) < bill ? setUserExpense(parseFloat(e.target.value)) : userExpense}
      // onChange={(e)=> setUserExpense((e.target.value))}
      />

      <label>🚶‍♂️{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendExpenses} />

      <label>🤑 Who is paying the bill?</label>
      <select value={whoIsPayingBill} onChange={(e) => setWhoIsPayingBill(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}


