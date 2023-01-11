import React from 'react';
import './App.css';
import Header from './components/header/Header';
import Home from './components/header/home/Home';
import About from './components/about/About';
import Leaderboard from './components/leaderboard/Leaderboard';
import Match from './components/match/Match';
import League from './components/league/League';
import Contact from './components/contact/Contact';

const App = () => {
  return (
    <>
      <Header />

      <main className='main'>
        <Home />
        <About />
        <Leaderboard />
        <Match />
        <League />
        <Contact />
      </main>
    </>
  );
}

export default App;
