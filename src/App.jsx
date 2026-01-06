import React from 'react';
import './App.css';
import Header from './components/header/Header';
import Home from './components/header/home/Home';
import Leaderboard from './components/leaderboard/Leaderboard';
import Calendar from './components/calendar/Calendar';
import Footer from './components/footer/Footer';
import ScrollUp from './components/scrollup/ScrollUp';

const App = () => {
  return (
    <>
      <Header />

      <main className='main'>
        <Home />
        <Leaderboard />
        <Calendar />
      </main>

      <Footer />
      <ScrollUp />
    </>
  );
}

export default App;
