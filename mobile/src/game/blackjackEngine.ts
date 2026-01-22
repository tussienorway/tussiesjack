export interface Card {
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  suit: '♠' | '♥' | '♦' | '♣';
}

export class BlackjackEngine {
  private deck: Card[] = [];
  private playerHand: Card[] = [];
  private dealerHand: Card[] = [];
  private drawnCards = 0;
  private readonly maxCards = 6 * 52 * 0.75; // 6 decks, 75% threshold

  constructor(numDecks: number = 1) {
    this.initializeDeck(numDecks);
  }

  private initializeDeck(numDecks: number) {
    const ranks: Array<Card['rank']> = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits: Array<Card['suit']> = ['♠', '♥', '♦', '♣'];
    
    this.deck = [];
    for (let d = 0; d < numDecks; d++) {
      for (const rank of ranks) {
        for (const suit of suits) {
          this.deck.push({ rank, suit });
        }
      }
    }
    this.shuffleDeck();
  }

  private shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  private reshuffle() {
    if (this.drawnCards > this.maxCards) {
      this.initializeDeck(6);
      this.drawnCards = 0;
    }
  }

  dealHand(): { playerHand: Card[]; dealerHand: Card[] } {
    this.reshuffle();
    
    this.playerHand = [];
    this.dealerHand = [];
    
    for (let i = 0; i < 2; i++) {
      this.playerHand.push(this.deck.pop()!);
      this.dealerHand.push(this.deck.pop()!);
      this.drawnCards += 2;
    }
    
    return {
      playerHand: [...this.playerHand],
      dealerHand: [...this.dealerHand],
    };
  }

  hit(): Card {
    const card = this.deck.pop()!;
    this.playerHand.push(card);
    this.drawnCards++;
    return card;
  }

  calculateScore(hand: Card[]): number {
    let score = 0;
    let aces = 0;
    const cardValues: Record<Card['rank'], number> = {
      'A': 11, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10,
    };

    for (const card of hand) {
      score += cardValues[card.rank];
      if (card.rank === 'A') aces++;
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  }

  dealerLogic(dealerHand: Card[]): Card[] {
    let hand = [...dealerHand];
    while (this.calculateScore(hand) < 17) {
      const card = this.deck.pop()!;
      hand.push(card);
      this.drawnCards++;
    }
    return hand;
  }

  getPlayerHand(): Card[] {
    return [...this.playerHand];
  }

  getDealerHand(): Card[] {
    return [...this.dealerHand];
  }
}

export default BlackjackEngine;
