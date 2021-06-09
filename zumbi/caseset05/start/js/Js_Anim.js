

function AnimDescription(elmnt) {
  var property =  document.getElementById("big-challenge-box");
  document.getElementById("challenge-flex-grid").classList.toggle("justify-content-start");
  document.getElementById("challenge-flex-grid").classList.toggle("justify-content-center");
  property.classList.toggle("show");
  property.classList.toggle("d-flex");
  property.classList.toggle("order-3");
  property.classList.toggle("align-items-center");


  if(property.classList.contains("show")){
    elmnt.style.backgroundColor = "#346e93";
    document.getElementById("challenge_text").style.color = "white";
    elmnt.style.minWidth = "550px";
  }
  else{
    elmnt.style.backgroundColor = "";
    document.getElementById("challenge_text").style.color = "#346e93";
    elmnt.style.minWidth = "240px";
  }

}
