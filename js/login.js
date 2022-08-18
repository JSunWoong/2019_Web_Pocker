function request(data,callback){
  const xhr=new XMLHttpRequest();
  let response='.';
  xhr.open('POST', 'http://210.125.73.145:8080/poker/rest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.send(Object.keys(data).map(key => `${key}=${data[key]}`).join('&'));

  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if(xhr.status === 200) {

        // alert(xhr.responseText);
        callback(xhr.responseText);
      }
      else {
        alert('Error!');
      }
    }
  };
  return response;
}
function ButtonClick(){
  let id = document.getElementById('id');
  let password = document.getElementById('password');
  const data={type:"login", id:id.value, pw:password.value};
  request(data,page_go);
}
function page_go(nickname){
  let id = document.getElementById('id');
  if(nickname.length===8){
    alert('ID혹은 Password를 다시 확인하세요');
  }
  else{
    location.href="main.html?nickname="+nickname.split('.')[1]+'.'+id.value;
  }
}
function get_rank(rank){
  if(rank.split('//')[0]===''){}
  else{
    let row=rank.split('//').length-1;
    for(let i=0;i<row;i++){
      let data=rank.split('//')[i];
      let table1=document.getElementById('insertTable');
      let tr=document.createElement('tr');
      tr.setAttribute("height","30");
      let td1=document.createElement('th');
      td1.setAttribute("width","100");
      td1.innerText=i+1;
      let td2=document.createElement('th');
      td2.setAttribute("width","100");
      td2.innerText=data.split('.')[0];
      let td3=document.createElement('th');
      td3.setAttribute("width","100");
      td3.innerText=data.split('.')[1];
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      table1.appendChild(tr);
    }
  }

}
window.onload = function(){
  const data={type:"get_rank"};
  request(data,get_rank);
};

