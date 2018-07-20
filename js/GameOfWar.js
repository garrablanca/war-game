// Clear out the mess to start!
console.clear();

// Define the Card Class
var Card = (function(){

  // Member Vars
  //index: '# 0-51 signifies the index of a card in a new deck of cards'
  //value: 'numerical value: 1 - 13'
  //suit: 'spades, diamonds, clubs, hearts'

  // Prototype members
  //number: '2 - 10, J, Q, K, A'
  //name: ' {number} of {suit} '
  //          ['Spades', 'Diamonds', 'Clubs', 'Hearts']
  var suitNames = ['spades', 'diamonds', 'clubs', 'hearts'],
      suitCodes = ['\u2664', '\u2662', '\u2667', '\u2661'],
      Card = function(index){
        this.index = index;
        this.value = (index % 13)+1;
        this.suit = suitNames[Math.floor(index/13)];
        this.code = suitCodes[Math.floor(index/13)];
      };

  Card.prototype = {
    get number() {
      switch(this.value) {
        case 11:
          return 'J';
        case 12:
          return 'Q';
        case 13:
          return 'K';
        case 1:
          return 'A';
        default:
          return this.value;
      }
      return this.value;
    },
    get name() {
      var numberName = (function(n){
        switch(n){
          case 'A': return 'Ace';
          case 'K': return 'King';
          case 'Q': return 'Queen';
          case 'J': return 'Jack';
          default: return n;
        }
      })(this.number);
      return numberName + ' of ' + this.suit;
    },
    get suitUnicodeArray() { return suitCodes; },
    get suitNameArray() { return suitNames; }
  };

  return Card;
})();

// Create player2 decks
var player2Deck = [], player1Deck = [],
    drawIndex;

function init() {
  // initialisation stuff here
  console.log(new Card(13));

  /*** START GAME SETUP ***/

  // Create Deck of cards
  var deck = Array.apply(null, Array(52)).map(function(_, i){ return new Card(i); });

  //for( var i = 0 ; i < 13 ; i++ ){
    //console.log( deck[i] );
  //}

  // Deal cards to player2s (2)
  while( deck.length > 0 ){

    // Draw Card for player2
    drawIndex = Math.random() * deck.length;
    player2Deck.push( deck.splice(drawIndex, 1)[0] );

    // Draw Card for player1
    drawIndex = Math.random() * deck.length;
    player1Deck.push( deck.splice(drawIndex.player1, 1)[0] );

  }
}

init();

var rewards = [];

// Single Round
var drawAndPlay = function(rewards){
  if( rewards ){ console.log('rewards = ', rewards); }

  // if either deck is empty, game over
  if( player2Deck.length === 0 || player1Deck.length === 0 ){

    document.querySelector('button.draw').disabled = true;
    document.querySelector('button.restart').disabled = false;
    document.querySelector('button.stop').disabled = true;
    document.querySelector('button.auto').disabled = true;

    // game over
    if( player2Deck.length > 0 ){
      console.log('player2 Won');
      document.querySelector('div.message').innerHTML = "Player 2 Wins!";
      document.querySelector('section.player2').querySelector('div[data-games-won]').setAttribute('data-games-won', parseInt(document.querySelector('section.player2').querySelector('div[data-games-won]').getAttribute('data-games-won'))+1)
    } else {
      console.log('player1 Won');
      document.querySelector('div.message').innerHTML = "Player 1 Wins!";
      document.querySelector('section.player1').querySelector('div[data-games-won]').setAttribute('data-games-won', parseInt(document.querySelector('section.player1').querySelector('div[data-games-won]').getAttribute('data-games-won'))+1)
    }
    return false;
  }
  document.querySelector('section.player1').querySelector('div.card').setAttribute("style", "background-color: white;");
  document.querySelector('section.player2').querySelector('div.card').setAttribute("style", "background-color: white;");
  // draw card from each deck
  var player2Card = player2Deck.shift(),
      player1Card = player1Deck.shift(),
      rewards = rewards ? rewards : [];

  // Update View for Drawn Cards TODO: Optimize
  var player2Section = document.querySelector('section.player2'),
      player1Section = document.querySelector('section.player1'),
      player2CardDiv = player2Section.querySelector('div.card'),
      player1CardDiv = player1Section.querySelector('div.card'),
      player2Points = player2Section.querySelector('[data-points]'),
      player1Points = player1Section.querySelector('[data-points]'),
      player2Score = player2Section.querySelector('[data-score]'),
      player1Score = player1Section.querySelector('[data-score]');

  Card.prototype.suitNameArray.forEach(function(v,i,a){
    player2CardDiv.classList.remove(v);
    player1CardDiv.classList.remove(v);
    return true;
  });

  player2CardDiv.querySelector('span.name').innerHTML = player2Card.number;
  var cardHtmlplayer2 = getCardToDraw(player2Card);
  player2CardDiv.querySelector('span.name').innerHTML = cardHtmlplayer2;
  //player2CardDiv.classList.add( player2Card.suit );
  player2Section.querySelector('div[data-cards-left]').setAttribute('data-cards-left', player2Deck.length);

  player1CardDiv.querySelector('span.name').innerHTML = player1Card.number;
  var cardHtmlplayer1 = getCardToDraw(player1Card);
  player1CardDiv.querySelector('span.name').innerHTML = cardHtmlplayer1;
  //player1CardDiv.classList.add( player1Card.suit );
  player1Section.querySelector('div[data-cards-left]').setAttribute('data-cards-left', player1Deck.length);

  var cardHtmlrewards = "";
  var pointsRewards = 0;
  var i = 0;

   //while (rewards.length > 0) {

  //}
  while (rewards.length > i) {
   pointsRewards +=  rewards[i].value;
   cardHtmlrewards += getCardToDraw(rewards[i]);
   i++;
  }
  document.querySelector('div.rewards').innerHTML = "Rewards Cards [Points: " + rewards.length + ", Value: " + pointsRewards + cardHtmlrewards +"]";


  // compare cards
  if( player2Card.value === player1Card.value ){
    console.log('tie', player2Card, player1Card);
    player1CardDiv.setAttribute("style", "background-color: yellow;");
    player2CardDiv.setAttribute("style", "background-color: yellow;");
    if(document.getElementById('tieWait').checked == true){
    document.querySelector('button.stop').dispatchEvent(new Event('click'));
    document.querySelector('div.message').innerHTML = "Hey wait, this is Tie...  Press Auto to continue!!";
    }
    // tie
      // keep the cards on the table for next round.
    rewards.push(player2Card);
    rewards.push(player1Card);

  } else if( player2Card.value > player1Card.value ){
    // player2 wins
    console.log('player2 wins round', player2Card, player1Card);
    // Add point to player2 score TODO
    player2Points.setAttribute('data-points', parseInt(player2Points.getAttribute('data-points'))+2+rewards.length);
    player2Score.setAttribute('data-score', parseInt(player2Score.getAttribute('data-score'))+player2Card.value+player1Card.value);
    player1CardDiv.setAttribute("style", "background-color: red;");
    player2CardDiv.setAttribute("style", "background-color: green;");


    // Reward Cards
    player2Deck.splice(player2Deck.length, 0, player2Card, player1Card);
    if( rewards.length > 0 ){
      player2Deck = player2Deck.concat(rewards);
      rewards.length = 0;
    }

  } else if( player2Card.value < player1Card.value ) {
    // player1 Wins
    console.log('player1 wins round', player2Card, player1Card);
    player1CardDiv.setAttribute("style", "background-color: green;");
    player2CardDiv.setAttribute("style", "background-color: red;");
    // Add point to player1 score TODO
    player1Points.setAttribute('data-points', parseInt(player1Points.getAttribute('data-points'))+2+rewards.length);
    player1Score.setAttribute('data-score', parseInt(player1Score.getAttribute('data-score'))+player2Card.value+player1Card.value);

    // Reward Cards
    player1Deck.splice(player1Deck.length, 0, player1Card, player2Card);
    if( rewards.length > 0 ){
      player1Deck = player1Deck.concat(rewards);
      rewards.length = 0;
    }

  }

  console.log('player2 Cards left = '+player2Deck.length, 'player1 Cards left = '+player1Deck.length);
  player2Section.querySelector('div[data-cards-left]').setAttribute('data-cards-left', player2Deck.length);
  player1Section.querySelector('div[data-cards-left]').setAttribute('data-cards-left', player1Deck.length);
  return true;
};



window.onload = function(){
  var btnDraw = document.querySelector('button.draw');
  var btnDeal = document.querySelector('button.restart');
  var btnStop = document.querySelector('button.stop');
  var btnAuto = document.querySelector('button.auto');

  var rounds = 0;

  btnDraw.addEventListener('click', function(event){
    var keepGoing = drawAndPlay(rewards);
    if( !keepGoing ){
      clearInterval(window.intervalID);
    }else{
      rounds++;
      document.querySelector('div.round').innerHTML = "Round: " + rounds;

      if(document.getElementById('100rounds').checked == true){
        if(rounds>=100){
          btnStop.dispatchEvent(new Event('click'));
          var winnerMsg = "";
          var player1TotalPoints = parseInt(document.querySelector('section.player1').querySelector('div[data-points]').getAttribute('data-points'));
          var player2TotalPoints = parseInt(document.querySelector('section.player2').querySelector('div[data-points]').getAttribute('data-points'));
          if (player1TotalPoints>player2TotalPoints){
            winnerMsg = "the winner is</br> Player 1</br> with "+player1TotalPoints+" points ☺!";
            document.querySelector('section.player1').querySelector('div[data-games-won]').setAttribute('data-games-won', parseInt(document.querySelector('section.player1').querySelector('div[data-games-won]').getAttribute('data-games-won'))+1)
            //document.getElementById('100rounds').checked = false;
          }else if (player1TotalPoints<player2TotalPoints){
            winnerMsg = "the winner is</br> Player 2</br> with "+player2TotalPoints+" points ☺!";
            document.querySelector('section.player2').querySelector('div[data-games-won]').setAttribute('data-games-won', parseInt(document.querySelector('section.player2').querySelector('div[data-games-won]').getAttribute('data-games-won'))+1)
            //document.getElementById('100rounds').checked = false;
          }else{
            winnerMsg = "we have a tie, well if you want, you can play CHESS instead ☺!";
          }
          document.querySelector('div.message').innerHTML = "Ok... At this "+rounds+" rounds, "+winnerMsg;
          btnDraw.disabled = true;
          btnDeal.disabled = false;
          btnAuto.disabled = true;
          btnStop.disabled = true;
        }
      }
    }
  });

  btnDeal.addEventListener('click', function(event){
     player2Deck = [], player1Deck = [], drawIndex;
     init();
     rounds = 0;
     document.querySelector('section.player2').querySelector('div[data-cards-left]').setAttribute('data-cards-left', player2Deck.length);
     document.querySelector('section.player1').querySelector('div[data-cards-left]').setAttribute('data-cards-left', player1Deck.length);
     document.querySelector('section.player1').querySelector('div[data-score]').setAttribute('data-score', 0 );
     document.querySelector('section.player2').querySelector('div[data-score]').setAttribute('data-score', 0 );
     document.querySelector('section.player1').querySelector('div[data-points]').setAttribute('data-points', 0 );
     document.querySelector('section.player2').querySelector('div[data-points]').setAttribute('data-points', 0 );
     document.querySelector('section.player1').querySelector('div.card').querySelector('span.name').innerHTML = "";
     document.querySelector('section.player2').querySelector('div.card').querySelector('span.name').innerHTML = "";
     document.querySelector('section.player1').querySelector('div.card').setAttribute("style", "background-color: white;");
     document.querySelector('section.player2').querySelector('div.card').setAttribute("style", "background-color: white;");
     document.querySelector('div.rewards').innerHTML = "Rewards Cards [Points: 0, Value: 0]";
     document.querySelector('div.round').innerHTML = "Round: " + rounds;
     console.clear;
     btnDraw.disabled = false;
     btnDeal.disabled = true;
     btnAuto.disabled = false;
     btnStop.disabled = true;
     document.querySelector('div.message').innerHTML = "Choose either AUTO PLAY or DRAW one";
     //selfPlay();
  });

  btnAuto.addEventListener('click', function(event){
      selfPlay();
      btnDraw.disabled = true;
      btnDeal.disabled = true;
      btnAuto.disabled = true;
      btnStop.disabled = false;
      document.querySelector('div.message').innerHTML = "Auto Playing... ";
  });

  btnStop.addEventListener('click', function(event){
      clearInterval(window.intervalID);
      btnDraw.disabled = false;
      btnDeal.disabled = true;
      btnAuto.disabled = false;
      btnStop.disabled = true;
      document.querySelector('div.message').innerHTML = "Waiting...  this game is not over!";
  });


 function selfPlay(){
   window.intervalID = setInterval(function(){
     btnDraw.dispatchEvent(new Event('click'));
   }, 50);
 };


 btnDraw.disabled = false;
 btnDeal.disabled = true;
 btnAuto.disabled = false;
 btnStop.disabled = true;

};

var forceRedraw = function(element){

    if (!element) { return; }

    var n = document.createTextNode(' ');
    var disp = element.style.display;  // don't worry about previous display style

    element.appendChild(n);
    element.style.display = 'none';

    setTimeout(function(){
        element.style.display = disp;
        n.parentNode.removeChild(n);
    },20); // you can play with this timeout to make it as short as possible
}

var getCardToDraw = function(cardValues){

  var cardHeader = ""+
                  "<section class='card card--"+ cardValues.suit +"' value="+ cardValues.number + ">";

  var cardFooter = "</section>";

  var cardBody = "";
  switch (cardValues.value) {
    case 0:
        cardBody = ""+
            "<div class='card__inner card__inner--centered'>"+
              "<div class='card__column'>"+
                "<div></div>"+
                "<div></div>"+
                "<div></div>"+
              "</div>"+
            "</div>";
        break;
    case 1:
        cardBody = ""+
            "<div class='card__inner card__inner--centered'>"+
              "<div class='card__column'>"+

                "<div style='font-size:500%;background: #fff;'>"+ cardValues.code +"</div>"+

              "</div>"+
            "</div>";
        break;
    case 2:
        cardBody = ""+
            "<div class='card__inner card__inner--centered'>"+
              "<div class='card__column'>"+
                "<div class='card__symbol'></div>"+
                "<div class='card__symbol'></div>"+
              "</div>"+
            "</div>";
        break;
    case 3:
        cardBody = ""+
            "<div class='card__inner card__inner--centered'>"+
              "<div class='card__column'>"+
              "<div class='card__symbol'></div>"+
              "<div class='card__symbol'></div>"+
              "<div class='card__symbol'></div>"+
              "</div>"+
            "</div>";
        break;
    case 4:
        cardBody = ""+
        "<div class='card__inner'>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>";
        break;
    case 5:
        cardBody = ""+
        "<div class='card__inner'>"+
          "<div class='card__column'>"+
           "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
          "<div class='card__column card__column--centered'>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
        "</div>";
        break;
    case 6:
        cardBody = ""+
        "<div class='card__inner'>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
        "</div>";
            break;
    case 7:
        cardBody = ""+
        "<div class='card__inner'>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
          "<div class='card__column card__column--centered'>"+
            "<div ></div>"+
            "<div class='card__symbol card__symbol--big'></div>"+
            "<div ></div>"+
          "</div>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
        "</div>";

            break;
    case 8:
        cardBody = ""+
        "<div class='card__inner'>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
          "<div class='card__column card__column--centered'>"+
            "<div class='card__symbol card__symbol--big'></div>"+
            "<div class='card__symbol card__symbol--big'></div>"+
          "</div>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
        "</div>";
            break;
    case 9:
        cardBody = ""+
        "<div class='card__inner'>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol card__symbol--rotated'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
          "<div class='card__column card__column--centered'>"+
            "<div class='card__symbol card__symbol'></div>"+
          "</div>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol card__symbol--rotated'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
        "</div>";
            break;
    case 10:
        cardBody = ""+
        "<div class='card__inner'>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol card__symbol--rotated'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
          "<div class='card__column card__column--centered'>"+
            "<div class='card__symbol card__symbol--big'></div>"+
            "<div class='card__symbol card__symbol--big'></div>"+
          "</div>"+
          "<div class='card__column'>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol'></div>"+
            "<div class='card__symbol card__symbol--rotated'></div>"+
            "<div class='card__symbol'></div>"+
          "</div>"+
        "</div>";
            break;
    case 11:
        cardBody = ""+
            "<div class='card__inner card__inner--centered'>"+
              "<div class='card__column'>"+
                "<div></div>"+
                "<div style='font-size:200%;background: #fff;'>"+cardValues.number+" "+ cardValues.code+"</div>"+
                "<div style='font-size:400%;background: #fff;'>"+cardValues.value+"</div>"+
              "</div>"+
            "</div>";
            break;
    default:
        cardBody = ""+
        "<div class='card__inner card__inner--centered'>"+
          "<div class='card__column'>"+
            "<div></div>"+
            "<div style='font-size:200%;background: #fff;'>"+cardValues.number+" "+ cardValues.code +"</div>"+
            "<div style='font-size:400%;background: #fff;'>"+cardValues.value+"</div>"+
          "</div>"+
        "</div>";
  }
  return cardHeader+cardBody+cardFooter;
}
