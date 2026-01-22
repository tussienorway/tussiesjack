API_SETUP.md  # TussiesJack AI Pro - Claude API Setup Guide

## Overview
TussiesJack AI Pro uses **Claude 3.5 Sonnet** from Anthropic - the best AI model for:
- **Advanced mathematical reasoning**
- **Probability calculations**
- **Card counting strategy**
- **Blackjack game theory**

## Why Claude 3.5 Sonnet?
1. **Superior Math Skills** - Better at complex probability calculations
2. **Memory & Context** - Tracks card history accurately
3. **Strategic Reasoning** - Understands blackjack variance
4. **Vision Capabilities** - Can analyze card images directly
5. **Reliability** - 99.8% accuracy on math problems

## Setup Steps

### 1. Get Claude API Key
- Go to https://console.anthropic.com
- Sign up or log in
- Create an API key
- Copy your key (starts with `sk-ant-v1-`)

### 2. Update the App

Find this line in `index.html`:
```javascript
const CLAUDE_API_KEY='sk-ant-v1-PLACEHOLDER';
```

Replace `PLACEHOLDER` with your actual key:
```javascript
const CLAUDE_API_KEY='sk-ant-v1-YOUR_ACTUAL_KEY_HERE';
```

### 3. Test the App

#### Option A: Manual Card Testing
1. Enter cards in format: `2,3,4,5,6,7,8,9,T,J,Q,K,A`
2. Example: `5,6,J,K` = Player has 5+6=11, Dealer shows K
3. Click "Analyze Cards"
4. Claude will:
   - Identify the cards
   - Calculate running count
   - Calculate true count
   - Provide recommendation with confidence
   - Show mathematical reasoning

#### Option B: Camera Testing
1. Click "Start Camera"
2. Point at real blackjack cards
3. Click "Capture"
4. Claude analyzes the image

## How Card Counting Works

### Running Count
- Low cards (2-6): +1
- High cards (10-A): -1  
- Neutral (7-9): 0

### True Count
- Adjusted by remaining decks: Running Count ÷ (Cards Remaining ÷ 52)
- Higher true count = more advantage for player

### Example
- Running Count: +8
- Cards Remaining: 156 (3 decks)
- True Count: 8 ÷ 3 = 2.67

## Expected Win Rates

With **Perfect Basic Strategy**: ~50% win rate
With **Card Counting**: 50.5% - 52% win rate (long term)
With **Perfect Memory**: 52%+ win rate

## Why 50-52% is Realistic

Blackjack is nearly a 50/50 game because:
1. Dealer bust rate: ~28%
2. Player bust rate: ~16% (you can control this)
3. Ties are frequent
4. Card counting only gives 0.5%-2% edge

## Testing the Probability

Click **"Run 1000 Simulations"** to see:
- Expected win rate for random play
- Expected win rate with card counting
- Statistical validation

## Features Included

✅ Live camera analysis  
✅ Image upload analysis  
✅ Manual card input  
✅ Running count tracker  
✅ True count calculator  
✅ Bankroll management  
✅ Win/loss statistics  
✅ ROI tracking  
✅ 1000-hand simulations  
✅ Claude 3.5 Sonnet integration  

## Troubleshooting

### "API Error"
- Check your API key is correct
- Make sure it starts with `sk-ant-v1-`
- Verify your account has credits

### "Camera access denied"
- Check browser permissions for camera
- Use HTTPS (required for camera access)
- Use on smartphone for best results

### "Invalid image"
- Ensure good lighting
- Show all 4 cards clearly (player 2, dealer 1-2)
- Use clear, face-up cards

## Mathematical Proof

Blackjack math shows that with:
- Correct basic strategy: Player advantage = -0.5%
- Card counting added: Player advantage = +0.5% to +2%
- Perfect information: Player advantage = +2% to +5%

This means:
- 1000 hands × $10 bet × 1% edge = ~$100 profit
- 10,000 hands × $10 bet × 1% edge = ~$1000 profit

## API Costs

Claude 3.5 Sonnet pricing:
- Input: $0.003 per 1K tokens
- Output: $0.015 per 1K tokens

~1000 analyses = ~$2-5 in API costs

## Need Help?

Check the repository README.md for more information.

Good luck beating the dealer! 🍀
