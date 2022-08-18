function straight(cards,chk){
    let card = Array(5);
    let cnt=0;
    for(let i=0;i<(cards.length);i++){
        if(chk[cards[i].card_number_in_type]==1) card[cnt++]=cards[i].card_number_in_type;
        else if(chk[cards[i].card_number_in_type]>1){
            card[cnt++]=cards[i].card_number_in_type;
            i+=(chk[cards[i].card_number_in_type]-1);
        }
    }
    let cn=0,max=2;
    let max_i=0;
    for(let i=0;i<3;i++){
        if(i>3 && max<3) return 'false';
        cn=1;
        for(let j=i;j<cnt;j++){
            if(card[j]+1==card[j+1]){
                cn++;
                if(cn>max){
                    max=cn;
                    max_i=card[j+1];
                }
            }
            else{
                cn=1;
                break;
            }
        }
        if(max==5){
            let ans='6.';
            ans+=max_i;
            return ans;
        }
        else if(max==4){
            let ans='4.';
            ans+=max_i;
            return ans;
        }
        else if(max==3){
            let ans='2.';
            ans+=max_i;
            return ans;
        }
    }
    return 'false';
}

function three(chk,result){
    let max=0;
    let ans='5.';
    for(let i=1;i<=10;i++){
        if(chk[i]==3) max=i;
    }
    if(max==0 && result=='false') return 'false';
    else if(max==0) return result;
    ans+=max;
    return ans;
}
function two(chk,result){
    let a=0,b=0;
    let ans='3.';
    for(let i=1;i<=10;i++){
        if(chk[i]==2){
            if(a==0) a=i;
            else if(b==0) b=i;
            else{
                if(a<i) a=i;
                else if(b<i) b=i;
            }
        }
    }
    if(a!=0 && b!=0){
        if(a>b){
            ans+=a;
            return ans;
        }
        else{
            ans+=b;
            return ans;
        }
    }
    return result;
}
function one(chk,result){
    let max=0;
    for(let i=1;i<=10;i++){
        if(chk[i]==2 && max<i){
            max=i;
        }
    }
    if(result=='false' && max==0){
        return 'false';
    }
    else if(max==0) return result;
    let ans='1.';
    ans+=max;
    return ans;
}
function nopair(chk){
    let max=0;
    for(let i=1;i<=10;i++){
        if(chk[i]==1 && max<i){
            max=i;
        }
    }
    let ans='0.';
    ans+=max;
    return ans;
}

/**
 * @return {string}
 */
function Judge(deck){
    // deep copy
    let cards = Array.prototype.slice.call(deck);
    //my_deck[i].card_number_absolute;
    let card_chk = Array(11);
    for(let i=0;i<=10;i++) card_chk[i]=0;
    for(let i=0;i<cards.length;i++){
        card_chk[cards[i].card_number_in_type]++;
    }


    cards.sort(function(a,b){
        return a.card_number_in_type-b.card_number_in_type;
    });
    // for(let i=0;i<cards.length;i++)
    //     alert(cards[i].card_number_in_type);

    let result='';
    result=straight(cards,card_chk);
    let result_ans=result.split('.');
    if(result=='false' || result_ans[0]<'5'){
        result=three(card_chk,result);
    }
    result_ans=result.split('.');
    if(result=='false' || result_ans[0]<'3'){
        result=two(card_chk,result);
    }
    result_ans=result.split('.');
    if(result=='false'){
        result=one(card_chk,result);
    }
    result_ans=result.split('.');
    if(result=='false'){
        result=nopair(card_chk);
    }
    result_ans=result.split('.');
    switch (result_ans[0]) {
        case '6' : return result; //5straight
        case '5' : return result; //triple
        case '4' : return result; //4straight
        case '3' : return result; //twopair
        case '2' : return result; //3straight
        case '1' : return result; //onpair
        case '0' : return result; //nopair
    }
}