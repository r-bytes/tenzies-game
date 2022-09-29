// start simple, create a component to render 1 dice, run 10x manual < Dic> *10, use state etc.
// map over state to generate 10 elements, set state function + button to update
import React from "react";
import {Die} from "./components/Die";
import {nanoid} from "nanoid";
import Confetti from 'react-confetti';

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false);

  // if all die are held and have the same value setTenzies
  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const sameValue = dice.every(die => die.value === firstValue)

    if (allHeld && sameValue) {
      setTenzies(true)
    }
  }, [dice]);

  function generateNewDie(){
    return {
      value: Math.ceil(Math.random() *6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
  const newDice = []
    for(let i=0; i < 10; i++) {
      newDice.push(
        generateNewDie()
      )
    }
    return newDice
  }


  function rolDice() {
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        // return die if held
        return die.isHeld ?
        die :
        // else generate new one
        generateNewDie()
      }))
    } else {
      setTenzies(false)
      setDice(allNewDice())
    }
  }

  function holdDice(id) {
    // return new array to state
    setDice(oldDice => oldDice.map(die => {
      // if id matches => spread obj & flip value
      return die.id === id ?
        {...die, isHeld: !die.isHeld } : die
    }))
  }
  
  // 10 elements from state
  const diceElements = dice.map(die => {
    return <Die key={die.id} value={die.value} isHeld={die.isHeld} handleClick={(event) => holdDice(die.id)} />
  })

  return (
    <main className="App">

      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      
      <div className="board dice-container">
        {diceElements}
      </div>
      {tenzies && <Confetti/> }
      
      <button
        className="roll-dice"
        onClick={rolDice}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>

  );
}