function showRelnotes(id,buttonID) {
  // get the element (div) and button div by the submitted id
  let elem = document.getElementById(id);
  let button = document.getElementById(buttonID);
  // toggle on the display of the div
  if (elem.style.display == 'block') {
    // it is being hidden:
    elem.style.display = 'none';
    button.style.display = 'none';
  } else {
    // it is being shown:
    elem.style.display = 'block';
    button.style.display = 'block';
    // go get the relnotes from the server
    // let text = ServerComm(false,'relnotes.html','GET');
    // add the relnotes to the div
    // document.getElementById(id).innerHTML = text;
  }
}
