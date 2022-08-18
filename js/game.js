// --------------------------------------------- global variable ------------------------------------------------------
let pileOfCards;
let cardPointer = 0;

let my_deck = Array(5);
let user1_deck = Array(5);
let user2_deck = Array(5);
let user3_deck = Array(5);

let round = 0;

const INITIAL_USER_MONEY = 1000;
const INITIAL_USER_BATTING = 10;

let ALIVE;

let START_MONEY = ["", "", "", ""];
//---------------------------------------------------------------------------------------------------------------------

window.onload = function() {
    buttonControl(false)
    let user0_name=document.getElementById('user0_name');
    user0_name.textContent=getParameterByName('nickname').split('.')[0];
};

// -------------------------------------------- button click event ----------------------------------------------------
function start_game(isFirst) {
    shuffleCards();
    buttonControl(true);

    nextRound_distributeCards();
    nextRound_distributeCards();
    nextRound_distributeCards();

    update_cards_image(true);

    setTotalBattingMoney(0);
    if(isFirst) setUserMoney([INITIAL_USER_MONEY, INITIAL_USER_MONEY, INITIAL_USER_MONEY, INITIAL_USER_MONEY]);
    batting([INITIAL_USER_BATTING, INITIAL_USER_BATTING, INITIAL_USER_BATTING, INITIAL_USER_BATTING]);
    ALIVE = [true, true, true, true];
    START_MONEY[0] = "0." + (Number(document.getElementById("user0_money").textContent) + INITIAL_USER_BATTING);
    START_MONEY[1] = "1." + (Number(document.getElementById("user1_money").textContent) + INITIAL_USER_BATTING);
    START_MONEY[2] = "2." + (Number(document.getElementById("user2_money").textContent) + INITIAL_USER_BATTING);
    START_MONEY[3] = "3." + (Number(document.getElementById("user3_money").textContent) + INITIAL_USER_BATTING);
}
function put_rank(rank){


}
function exit_game(isRegame) {
    pileOfCards = Array(40);
    cardPointer = 0;

    my_deck = Array(5);
    user1_deck = Array(5);
    user2_deck = Array(5);
    user3_deck = Array(5);

    round = 0;  // 0 ~ 4

    let every_cards_DO = document.getElementsByClassName("card");

    for(let i=0; i<every_cards_DO.length; i++)
        every_cards_DO.item(i).style.backgroundImage = "";

    buttonControl(false);
    printGameResult("");

    setTotalBattingMoney(0);
    if(!isRegame)  {
        let user0_money=document.getElementById('user0_money');
        const data={type:"put_rank",id:getParameterByName('nickname').split('.')[1],win_cnt:user0_money.textContent};
        request(data,put_rank);
        setUserMoney([0, 0, 0, 0]);
        document.getElementById("win_cnt").textContent = "0";
        document.getElementById("lose_cnt").textContent = "0";

        location.href="index.html";
    }

}

function reGame() {
    exit_game(true);
    start_game(false);
}

// ----------------------------------------------- Game Logic function ------------------------------------------------
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function go(batting_or_die) {

    if(!batting_or_die) {
        // die
        endOneGameEvent(true);
        return;
    }

    if(ALIVE[1]) ALIVE[1] = getRandomTrueFalse();
    if(ALIVE[2]) ALIVE[2] = getRandomTrueFalse();
    if(ALIVE[3]) ALIVE[3] = getRandomTrueFalse();

    alert(document.getElementById("user0_name").textContent + " : " + ((ALIVE[0])?"Batting!\n":"die!\n") +
            document.getElementById("user1_name").textContent + " : " + ((ALIVE[1])?"Batting!\n":"die!\n") +
            document.getElementById("user2_name").textContent + " : " + ((ALIVE[2])?"Batting!\n":"die!\n") +
            document.getElementById("user3_name").textContent + " : " + ((ALIVE[3])?"Batting!\n":"die!\n"));

    goBatting();

    switch (round) {
        case 3:
        case 4:
            nextRound_distributeCards();
            update_cards_image(true);
            break;
        case 5:
            endOneGameEvent(false);
            break;
        default:
            break;
    }
}

function nextRound_distributeCards() {
    if(round < 3) {
        my_deck[round] = pick_card();
        user1_deck[round] = pick_card();
        user2_deck[round] = pick_card();
        user3_deck[round] = pick_card();
    } else {
        my_deck[round] = pick_card();
        if(ALIVE[1]) user1_deck[round] = pick_card();
        if(ALIVE[2]) user2_deck[round] = pick_card();
        if(ALIVE[3]) user3_deck[round] = pick_card();
    }
    round++;
}

function distributeMoney(sortedResultInfo) {
    // todo
    let deltaUserMoneyArr = [0, 0, 0, 0];
    let winnerCnt = Number(sortedResultInfo.split("#")[0]) + 1;
    let resultInfo = sortedResultInfo.split("#")[1];
    const totalBattingMoney = Number(document.getElementById("total_batting_money").textContent);
    const _deltaMoney = parseInt(String(totalBattingMoney / Number(winnerCnt)));
    //alert("total : " + totalBattingMoney + " winnercnt : " + winnerCnt + " dstMoney : " + _deltaMoney);
    for(let i=0; i<4; i++)
        if(i < winnerCnt)
            deltaUserMoneyArr[i] = Number(_deltaMoney);

    let my_win_flag = false;
    for(let i=0; i<winnerCnt;i++)
        if(Number(resultInfo.split("//")[i].split(".")[0]) === 0) {
            my_win_flag = true;
            break;
        }
    if(my_win_flag)
        document.getElementById("win_cnt").textContent = Number(document.getElementById("win_cnt").textContent) + 1;
    else
        document.getElementById("lose_cnt").textContent = Number(document.getElementById("lose_cnt").textContent) + 1;


    updateUserMoney(deltaUserMoneyArr, resultInfo);
    //alert(deltaUserMoneyArr);
}

function makeResultTextHTML(sortedResultInfo) {
    const deck_type = ["No-pair", "One-pair", "3-Straight", "Two_pair", "4-Straight", "Triple", "5-Straight"];
    let result = "";
    let winnerCnt = sortedResultInfo.split("#")[0];

    for(let i=0; i<4; i++) {
        let targetUser = sortedResultInfo.split("#")[1].split("//")[i].split(".");
        result += ((i <= winnerCnt)?"&#x2605;":"")
            + document.getElementById(("user" + targetUser[0] + "_name")).textContent + "<br>\t";
        if(Number(targetUser[1]) !== -1)
            result+= deck_type[targetUser[1]] + "<br>" + getUserMoneyDiffStr(parseInt(targetUser[0]))
            + "<br>" + "\ttop : " + targetUser[2] + "<br>"
            + ((i!==3)?"----------------<br>":"");
        else
            result+= "DIE<br>" + getUserMoneyDiffStr(parseInt(targetUser[0])) + "<br>" + ((i!==3)?"----------------<br>":"");

    }
    return result;
}

function sortUserResult(resultInfo) {
    let winnerCnt = 0, _maxWinType, _maxWinNum;
    const user_result = resultInfo.split("//");
    for(let i=0; i<4; i++)
        user_result[i] = i + "." + user_result[i];

    user_result.sort(function(i, j) {
        //alert(i + "\n" + j);
        return -(Number(i.split(".")[1])*10 + Number(i.split(".")[2]) -
            (Number(j.split(".")[1])*10 + Number(j.split(".")[2])));
    });

    // check winner
    _maxWinType = user_result[0].split(".")[1];
    _maxWinNum = user_result[0].split(".")[2];
    for(let i=1; i<4; i++)
        if(user_result[i].split(".")[1] === _maxWinType
                && user_result[i].split(".")[2] === _maxWinNum)
            winnerCnt = i;

    return winnerCnt + "#" + user_result.join("//");
}

function getRandomTrueFalse() {
    return parseInt((Math.random() * 10) % 10) !== 0;
}

function endOneGameEvent(isDie) {
    let resultInfo = "";

    document.getElementById("bt_confirm").toggleAttribute("disabled", false);
    document.getElementById("bt_batting").toggleAttribute("disabled", true);
    document.getElementById("bt_die").toggleAttribute("disabled", true);
    update_cards_image(false);

    if(!isDie) {
        resultInfo+=Judge(my_deck);
        if(ALIVE[1]) resultInfo += "//" + Judge(user1_deck); else resultInfo += "//-1.-1";
        if(ALIVE[2]) resultInfo += "//" + Judge(user2_deck); else resultInfo += "//-1.-1";
        if(ALIVE[3]) resultInfo += "//" + Judge(user3_deck); else resultInfo += "//-1.-1";
        let sortedResult = sortUserResult(resultInfo);
        distributeMoney(sortedResult);
        printGameResult(makeResultTextHTML(sortedResult));
    } else {
        alert("YOU DIE");
        const battingMoney = parseInt(document.getElementById("total_batting_money").textContent);
        let nonDieCntAndIndex = findNonDieCnt();
        const nonDieCnt = Number(nonDieCntAndIndex.split("//")[0]);
        let nonDieIndexArr = nonDieCntAndIndex.split("//")[1].split(".");
        const distMoney = parseInt(String(battingMoney/nonDieCnt));

        // print alive user result
        let resultText = "";
        for(let i=0; i<nonDieCnt; i++) {
            document.getElementById("user" + nonDieIndexArr[i] + "_money").textContent =
                parseInt(document.getElementById("user" + nonDieIndexArr[i] + "_money").textContent) + distMoney;

            resultText += "&#x2605;" + document.getElementById("user" + nonDieIndexArr[i] + "_name").textContent + "<br>+"+
                (Number(document.getElementById("user" + nonDieIndexArr[i] + "_money").textContent) - Number(START_MONEY[nonDieIndexArr[i]].split(".")[1])) + "<br>" + "-----------------<br>";
        }

        // print dead user result
        for(let i=0; i<4; i++) {
            let flag = true;
            for(let j=0; j<nonDieCnt; j++)
                if(Number(nonDieIndexArr[j]) === i) flag = false;

            if(flag)
                resultText += document.getElementById("user" + i + "_name").textContent + "<br>DIE<br>" +
                    "-" + Number((START_MONEY[i].split(".")[1]) - parseInt(document.getElementById("user" + i + "_money").textContent))
                    + "<br>--------------------<br>";
        }
        printGameResult(resultText);
        document.getElementById("lose_cnt").textContent = Number(document.getElementById("lose_cnt").textContent) + 1;

    }
}

function goBatting() {
    let totalBattingMoneyDO = document.getElementById("total_batting_money");
    let _battingMoney = parseInt(String(Number(totalBattingMoneyDO.textContent) / 2));
    for(let i=0; i<4; i++) {
        if(ALIVE[i]) {
            // user batting
            let targetUserMoneyDO = document.getElementById("user" + i + "_money");
            targetUserMoneyDO.textContent = String(Number(targetUserMoneyDO.textContent) - _battingMoney);
            setTotalBattingMoney(Number(totalBattingMoneyDO.textContent) + _battingMoney);
        }

    }
}

function findNonDieCnt() {
    let cnt=0;
    let resultText = "";
    for(let i=1; i<4; i++)
        if(ALIVE[i]) {
            resultText += ((cnt === 0)?"":".") + String(i);
            cnt++;
        }
    return cnt + "//" + resultText;
}
// ----------------------------------------------- UI-related function ------------------------------------------------
function animate(card) {
    card.style.transition = "all 1s ease";
    card.style.transform = "rotateY(360deg)";

    setTimeout(function() {
                card.style.webkitTransform = "";
                card.style.webkitTransition = "";
              }, 1100);
}

function animate_reset(card) {
    card.style.transform = "rotateY(0deg)";

    setTimeout(function() {
                card.style.webkitTransform = "";
              }, 1100);
}

function update_cards_image(hidden) {
    let my_cards_DO = document.getElementsByClassName("my_card");
    let user1_cards_DO = document.getElementsByClassName("user1_cards");
    let user2_cards_DO = document.getElementsByClassName("user2_cards");
    let user3_cards_DO = document.getElementsByClassName("user3_cards");

    let user_deck = [user1_deck, user2_deck, user3_deck];
    let cards_DO_arr = [user1_cards_DO, user2_cards_DO, user3_cards_DO];

    for(let i = 0; i < round; i++) {
        animate(my_cards_DO.item(i));
        if (round > 3) {
          animate_reset(my_cards_DO.item(i));
          if (i == (round-1)) animate(my_cards_DO.item(i));
        }
        my_cards_DO.item(i).style.backgroundImage = "url('./images/cards/" + my_deck[i].image_file_name + "')";
        my_cards_DO.item(i).style.backgroundSize = "80px 100px";
    }

    for(let j = 0; j < 3; j++) {
        for(let i=0; i<round; i++) {
            if(hidden && i <= 1)
                cards_DO_arr[j].item(i).style.backgroundImage =
                    "url('./images/cards/hidden.jpg')";
            else {
                if (user_deck[j][i]) {
                  animate(cards_DO_arr[j].item(i));
                                    if (round > 3) {
                                      animate_reset(cards_DO_arr[j].item(i));
                                      if (i == (round-1)) animate(cards_DO_arr[j].item(i));
                                    }

                cards_DO_arr[j].item(i).style.backgroundImage =
                    "url('./images/cards/" + user_deck[j][i].image_file_name + "')";
                  }
                }
            cards_DO_arr[j].item(i).style.backgroundSize = "50px 67px";
        }
    }

    if (hidden == 0) {
      for(let j = 0; j < 3; j++)
        for(let i=0; i<round; i++) {
          animate_reset(my_cards_DO.item(i));
          animate_reset(cards_DO_arr[j].item(i));
      }

      for(let j = 0; j < 3; j++)
        for(let i = 0; i < 2; i++)
          animate(cards_DO_arr[j].item(i));

    }
}


function buttonControl(isStart) {
    document.getElementById("bt_start").toggleAttribute("disabled", isStart);
    document.getElementById("bt_batting").toggleAttribute("disabled", !isStart);
    document.getElementById("bt_die").toggleAttribute("disabled", !isStart);
    document.getElementById("bt_stop").toggleAttribute("disabled", !isStart);
    document.getElementById("bt_confirm").toggleAttribute("disabled", true);
    printGameResult("");
}

function printGameResult(result) {
    document.getElementById("result_text").innerHTML = result;
}

function setTotalBattingMoney(target) {
    document.getElementById("total_batting_money").textContent = target;
}

function setUserMoney(target_arr) {
    for(let i=0; i<4; i++)
        document.getElementById("user" + i + "_money").textContent = target_arr[i];
}

// input : sorted -> winner
function updateUserMoney(delta_arr, sortedResultInfo) {
    let result = sortedResultInfo.split("//");
    for(let i=0; i<4; i++)
        document.getElementById("user" + (result[i].split(".")[0]) + "_money").textContent =
            Number(document.getElementById("user" + (result[i].split(".")[0]) + "_money").textContent) + Number(delta_arr[i]);
}

// input : sorted -> user0, 1, 2, 3
function batting(moneyArr) {
    const TOTAL_BATTING_MONEY = Number(document.getElementById("total_batting_money").textContent);
    let sumBattingMoney = 0;
    for(let i=0; i<4; i++) sumBattingMoney += Number(moneyArr[i]);
    setTotalBattingMoney(TOTAL_BATTING_MONEY + sumBattingMoney);
    for(let i=0; i<4; i++)
        document.getElementById("user" + i + "_money").textContent =
            String(Number(document.getElementById("user" + i + "_money").textContent) - Number(moneyArr[i]));
}

function getUserMoneyDiffStr(userNum) {
    const _curMoney = parseInt(document.getElementById("user" + userNum + "_money").textContent);
    const diff = _curMoney - parseInt(START_MONEY[parseInt(userNum)].split(".")[1]);
    return ((diff >= 0)?("+" + diff):String(diff));
}
// --------------------------------------------- Card-related function ------------------------------------------------
function makeCardObject(cardNum) {
    let suffix;
    if(cardNum <= 10)
        suffix = "s";
    else if(cardNum <= 20)
        suffix = "d";
    else if(cardNum <= 30)
        suffix = "c";
    else if(cardNum <= 40)
        suffix = "h";

    return {
        card_number_absolute: cardNum,
        card_number_in_type: (cardNum % 10 === 0)?10 : cardNum%10,
        type: suffix,
        image_file_name: ((cardNum % 10 === 0)?10 : cardNum%10) + "_" + suffix + ".png"
    };
}

function shuffleCards() {
    pileOfCards = Array(40);

    for(let i=0; i<40; i++)
        pileOfCards[i] = makeCardObject(i + 1);

    for (let i = pileOfCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pileOfCards[i], pileOfCards[j]] = [pileOfCards[j], pileOfCards[i]];
    }

    cardPointer = 0;

    // ----------test-------------
    // let temp = "";
    // for(let i=1; i<=40; i++)
    //     temp = temp +  (pileOfCards[i - 1].card_number_absolute + " ");
    //
    // alert('Cards shuffled.\n\n' + temp);
    //----------------------------
}

function pick_card() {
    if(cardPointer !== 0 && cardPointer % 40 === 0)
        shuffleCards();
    return pileOfCards[cardPointer++];
}
