import React, { useRef, useState, useEffect } from 'react'
import './App.css'
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, onValue } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBY83AUss0hPuuNAam6WFljEPJYCB7GZSM",
  authDomain: "labcomp-finder.firebaseapp.com",
  projectId: "labcomp-finder",
  storageBucket: "labcomp-finder.appspot.com",
  messagingSenderId: "1065990617790",
  appId: "1:1065990617790:web:73f4d3a6192b0e93c6bcef",
  measurementId: "G-LF3SZXCX8P"
};

const app = initializeApp(firebaseConfig);

const Computer = ({id, onClick, state}) =>
  <li
    className="computer"
    state={state===1? 'on' : 'off'}
    onClick={onClick}
    id={id}>
    💻
  </li>

const stdtState = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

function App() {

  const inputEl = useRef(null)

  const [computersState, setComputersState] = useState(stdtState)

  async function writeStateData(state) {
    const db = getDatabase()
    return set(ref(db, 'computerState/'), state)
  }

  useEffect(()=>{
    const run = async () => {
      const db = getDatabase()
      const stateRef = ref(db, 'computerState/')
      onValue( stateRef, (snapshot) => {
        const data = snapshot.val()
        if(!data) setComputersState(stdtState)
        else setComputersState(data)
      })
    }
    run()
  },[])


  const turn = async (computer) => {
    console.log(computer)
    const s = [...computersState]
    s[computer] = s[computer]===1? 0 : 1
    setComputersState( s )
    console.log(s)
    await writeStateData(s);
  }
  
  return (
    <main>
      <ul>
        {
          computersState
          .map((computer, i) => 
            <Computer
              key={i}
              onClick={ ()=>turn(i) }
              id={i}
              state={computersState[i]}
            />
          )
        }
      </ul>
      <a href="https://github.com/FranciscoOssian/labcomp-finder"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png"/></a>
    </main>
  );
}

export default App;