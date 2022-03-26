import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [state, setState] = useState({ message: "", name: "" });
  const [roomname, setroomname] = useState(3);
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("/");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    socketRef.current.on("user_join", function (data) {
      setChat([
        ...chat,
        { name: "ChatBot", message: `${data} has joined the chat` },
      ]);
    });
  }, [chat]);

  const userjoin = (name) => {
    socketRef.current.emit("user_join", name, roomname);
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById("message");
    //let roomname = document.getElementById("roomname");
    console.log(roomname, msgEle);
    console.log([msgEle.name], msgEle.value);
    console.log(roomname);

    setState({ ...state, [msgEle.name]: msgEle.value });
    socketRef.current.emit("message", {
      name: state.name,
      message: msgEle.value,
      room: roomname,
    });
    e.preventDefault();
    setState({ message: "", name: state.name });
    msgEle.value = "";
    msgEle.focus();
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div>
      {state.name && (
        <div className="card">
          <div className="render-chat">
            <h1>Chat Log</h1>
            {renderChat()}
          </div>
          <form onSubmit={onMessageSubmit}>
            <h1>Messenger</h1>
            <div>
              <input
                name="message"
                id="message"
                variant="outlined"
                label="Message"
              />
            </div>
            <button>Send Message</button>
          </form>
        </div>
      )}

      {!state.name && (
        <form
          className="form"
          onSubmit={(e) => {
            console.log(document.getElementById("username_input").value);
            console.log(document.getElementById("roomname").value);

            e.preventDefault();
            setState({ name: document.getElementById("username_input").value });
            userjoin(
              document.getElementById("username_input").value,
              document.getElementById("roomname").value
            );
            //setState({ roomname });
            // userName.value = '';
          }}
        >
          <div className="form-group">
            <label>
              User Name:
              <br />
              <input id="username_input" />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Select Room:
              <br />
              {/* <select
                name="room"
                value={selectedValue}
                id="room"
                options={data}
                onChange={handleChange}
              ></select>
              {selectedValue && (
                <div>
                  <div>
                    <b>Selected Value: </b> {selectedValue}
                  </div>
                </div>
              )} */}
              <input
                placeholder="Input the room name"
                value={roomname}
                id="roomname"
                onChange={(e) => setroomname(e.target.value)}
              ></input>
            </label>
          </div>
          <br />
          <br />
          <button type="submit"> Click to join</button>
        </form>
      )}
    </div>
  );
}

export default App;
