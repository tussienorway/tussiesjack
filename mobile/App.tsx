import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { BlackjackEngine } from './src/game/blackjackEngine';
import { AIAgent } from './src/game/aiAgent';
import GameBoard from './src/components/GameBoard';
import Stats from './src/components/Stats';

const App = () => {
  const [gameState, setGameState] = useState({
    playerHand: [],
    dealerHand: [],
    playerScore: 0,
    dealerScore: 0,
    gameOver: false,
    message: 'Welcome to TussiesJack! Click Deal to start.',
    wins: 0,
    losses: 0,
  });

  const [engine] = useState(() => new BlackjackEngine(1));
  const [aiAgent] = useState(() => new AIAgent());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const stored = await AsyncStorage.getItem('blackjackStats');
      if (stored) {
        const { wins, losses } = JSON.parse(stored);
        setGameState(prev => ({ ...prev, wins, losses }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  const saveStats = async (newWins: number, newLosses: number) => {
    try {
      await AsyncStorage.setItem('blackjackStats', JSON.stringify({ wins: newWins, losses: newLosses }));
      await firestore().collection('games').add({
        wins: newWins,
        losses: newLosses,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const dealCards = () => {
    if (gameState.gameOver || gameState.playerHand.length > 0) return;

    const { playerHand, dealerHand } = engine.dealHand();
    setGameState(prev => ({
      ...prev,
      playerHand,
      dealerHand,
      playerScore: engine.calculateScore(playerHand),
      dealerScore: engine.calculateScore([dealerHand[0]]),
      gameOver: false,
      message: 'Your turn. Hit or Stand?',
    }));
  };

  const hitCard = () => {
    if (gameState.gameOver || gameState.playerHand.length === 0) return;

    const newCard = engine.hit();
    const newHand = [...gameState.playerHand, newCard];
    const score = engine.calculateScore(newHand);

    if (score > 21) {
      endGame('You busted! Dealer wins.', 'lose');
    } else {
      setGameState(prev => ({
        ...prev,
        playerHand: newHand,
        playerScore: score,
      }));
    }
  };

  const standCard = () => {
    if (gameState.gameOver || gameState.playerHand.length === 0) return;

    // Dealer logic
    let dealerHand = gameState.dealerHand;
    while (engine.calculateScore(dealerHand) < 17) {
      dealerHand = [...dealerHand, engine.hit()];
    }

    const playerScore = gameState.playerScore;
    const dealerScore = engine.calculateScore(dealerHand);

    let message = '';
    let result = '';

    if (dealerScore > 21) {
      message = 'Dealer busted! You win!';
      result = 'win';
    } else if (playerScore > dealerScore) {
      message = 'You win!';
      result = 'win';
    } else if (playerScore < dealerScore) {
      message = 'You lose!';
      result = 'lose';
    } else {
      message = "It's a tie!";
      result = 'tie';
    }

    setGameState(prev => ({
      ...prev,
      dealerHand,
      dealerScore,
      message,
      gameOver: true,
    }));

    endGame(message, result);
  };

  const endGame = (message: string, result: string) => {
    let newWins = gameState.wins;
    let newLosses = gameState.losses;

    if (result === 'win') newWins++;
    else if (result === 'lose') newLosses++;

    setGameState(prev => ({
      ...prev,
      gameOver: true,
      message,
      wins: newWins,
      losses: newLosses,
    }));

    saveStats(newWins, newLosses);
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      playerHand: [],
      dealerHand: [],
      playerScore: 0,
      dealerScore: 0,
      gameOver: false,
      message: 'Game reset. Click Deal to play!',
    }));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>TussiesJack</Text>
        <Text style={styles.subtitle}>AI-Powered Blackjack Agent</Text>

        <GameBoard
          playerHand={gameState.playerHand}
          dealerHand={gameState.dealerHand}
          playerScore={gameState.playerScore}
          dealerScore={gameState.dealerScore}
          message={gameState.message}
        />

        <View style={styles.controls}>
          <TouchableOpacity style={styles.btnDeal} onPress={dealCards}>
            <Text style={styles.btnText}>Deal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnHit} onPress={hitCard}>
            <Text style={styles.btnText}>Hit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnStand} onPress={standCard}>
            <Text style={styles.btnText}>Stand</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnReset} onPress={resetGame}>
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Stats wins={gameState.wins} losses={gameState.losses} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
  scroll: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 30,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  btnDeal: {
    backgroundColor: '#4ade80',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  btnHit: {
    backgroundColor: '#f87171',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  btnStand: {
    backgroundColor: '#67e8f9',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  btnReset: {
    backgroundColor: '#60a5fa',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default App;
