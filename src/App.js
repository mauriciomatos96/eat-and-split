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

function Button({ children, onClick }) {

  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  )
};

export default function App() {

  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friends, setFriends] = useState(initialFriends)
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(show => !show)
  }

  function handleSetFriends(friend) {
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    // setSelectedFriend(friend)
    setSelectedFriend((selected) => selected?.id === friend.id ? null : friend)
    setShowAddFriend(false)
  }

  function handleSplitValue(value) {
    setFriends(friends.map(friend => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))
    setSelectedFriend(null)
  }


  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend} />
        {showAddFriend && <FormAddFriend onSetFriends={handleSetFriends} />}
        <Button onClick={handleShowAddFriend} showAddFriend={showAddFriend} onSetShowAddFriend={setShowAddFriend} >
          {showAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitValue} />}
    </div>
  )
}

function FriendsList({ friends, onSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend friend={friend} onSelectedFriend={onSelectedFriend} selectedFriend={selectedFriend} key={friend.id} />
      ))}
    </ul>
  )
}

function Friend({ friend, onSelectedFriend, selectedFriend }) {

  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && (
        <p className="">
          You and {friend.name} are even
        </p>
      )}

      <Button onClick={() => onSelectedFriend(friend)} >{isSelected ? "Close" : "Select"}</Button>

    </li>
  )
};



function FormAddFriend({ onSetFriends }) {

  const [name, setName] = useState("")
  const [image, setImage] = useState("https://i.pravatar.cc/48")

  const id = crypto.randomUUID();

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return

    const newFriend = { name, image: `${image}?=${id}`, balance: 0, id: id }

    onSetFriends(newFriend);

    setName("")
    setImage("https://i.pravatar.cc/48");

  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🤼Friend name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />

      <label>📸 Image URL</label>
      <input type="text" value={image} onChange={e => setImage(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
};

function FormSplitBill({ selectedFriend, onSplitBill }) {

  const [bill, setBill] = useState('')
  const [myExpenses, setMyExpenses] = useState('')
  const friendExpenses = bill ? bill - myExpenses : "";
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !myExpenses) return;

    onSplitBill(whoIsPaying === 'user' ? friendExpenses : -myExpenses)

  }


  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name} </h2>

      <label>💵 Bill value</label>
      <input type="text" value={bill} onChange={e => setBill(Number(e.target.value))} />

      <label>🧑 Your Expense</label>
      <input type="text" value={myExpenses} onChange={e => setMyExpenses(
        Number(e.target.value) > bill ? myExpenses : Number(e.target.value))} />

      <label>🤼 {selectedFriend.name} Expense</label>
      <input type="text" disabled value={friendExpenses} />

      <label>Who is paying the bill?</label>
      <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
};