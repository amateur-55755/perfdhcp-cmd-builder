// a set of functions that provide manipulation of the GUI by button presses and the like

// Add more `-o`
function moreOption() {
  // Find the current greatest 'nonEncapO-n' and add 1 for new ID
  let baseID = 'noEncapO';
  const [ id1, id2, id3, id4 ] = getIDs(baseID);
  // append this html to id addToMe
  let name = 'Option (-o)';
  let description = 'Non-encapsulated option (-o) content (e.g., -o 88,01610162016300) suitable for dhcp4 or dhcp6';
  let newRow = moreRows(id1,id2,id3,id4,name,description);
}

function getIDs(baseID) {
  // find a free id
  let start = 1;
  let max = start+1000;
  let id1 = '';
  let i = 0;
  for (i = start; i < max; i++) {
    id1 = baseID+'-'+i;
    if (document.getElementById(id1)) {
      // that one already exists ... bummer
    } else {
      // found a free id
      break;
    }
  }
  let id2 = id1+'-1';
  let id3 = baseID+'type-'+i+'-1';
  let id4 = baseID+'id-'+i;
  return [ id1, id2, id3, id4 ];
}

// Add more `-o 82`
function moreOption82() {
  // Find the current greatest 'EncapO-n' and add 1 for new ID
  let baseID = 'EncapO';
  const [ id1, id2, id3, id4 ] = getIDs(baseID);
  // append this html to id addToMe
  let name = 'Option 82 (-o 82,...)';
  let description = 'Encapsulated option 82 (-o 82,...) content (e.g., -o 82,0105564C414E31) suitable for dhcp4';
  let newRow = moreRows(id1,id2,id3,id4,name,description);
}

// Add more `--or`
function moreRelay6option() {
  // Find the current greatest 'dhcp6relay-n' and add 1 for new ID
  let baseID = 'dhcp6relay';
  const [ id1, id2, id3, id4 ] = getIDs(baseID);
  // append this html to id addToMe
  let name = 'DHCP6 Relay option (--or)';
  let description = 'Relay options that are added at the relay layer (e.g., --or 18:1,564C414E31)<br>';
  description += '<b>Note:</b> Requires DHCPv6, a dhcp6 address in "Send from/to", and implies `-A 1`';
  let newRow = moreRows(id1,id2,id3,id4,name,description);
}

// the content to add (structure is generic)
function moreRows(id1,id2,id3,id4,name,description) {

  // the form content
  // Create div container
  let newDIV = document.createElement("div");
  // get option values
  const [ optionsArray, optionsText ] = optionValues();
  // add content to div container
  let content = "<div class='formRow'><div class='FieldLabel'><label for='"+id1+"'>"+name+"</label></div><div class='FieldInput' id='"+id1+"'>";
  content += "</div><div class='FieldDescription'>"+description+"</div></div>";
  newDIV.innerHTML = content;
  // append new div container to the existing overall div container
  document.getElementById('addToMe').appendChild(newDIV);

  // add code input box
  let newINPUT = document.createElement("input");
  newINPUT.type = 'number';
  newINPUT.name = id4;
  newINPUT.id = id4;
  newINPUT.placeholder = 'code';
  newINPUT.min  = 1;
  newINPUT.step = 1;
  newINPUT.max  = 255;
  document.getElementById(id1).appendChild(newINPUT);
  // add line break
  let newBR = document.createElement("br");
  document.getElementById(id1).appendChild(newBR);
  // add input and select box
  moreParts(id1,id2);
  // add moreParts button
  let newBUTTON = document.createElement("button");
  //newBUTTON.type='button';
  //newBUTTON.onclick='moreParts("'+id1+'","'+id2+'")';
  newBUTTON.addEventListener('click', () => moreParts(id1,id2));
  newBUTTON.textContent = 'Add Part';
  document.getElementById(id1).appendChild(newBUTTON);
  // add another linebreak:
  newBR = document.createElement("br");
  document.getElementById(id1).appendChild(newBR);
}

function optionValues() {
  // the option values (so they only exist once)
  const optionsArray = [ '', 'ip4','ip6','int32','uint32','uint16','uint8','fqdn','string','boolean','binary', 'hexidecimal' ];
  const optionsText =  [ 'Select data type','IPv4 address','IPv6 address','int32','uint32','uint16','uint8','fqdn (RFC1035 encoded)','string','boolean','binary','hexidecimal' ];
  return [ optionsArray, optionsText ];
}

// Add more parts to `-o`
function moreParts(containerID,id) {
  const idParts = id.split('-');
  // increment the second id to one that does not exist
  let existence = true;
  idParts[2]=parseInt(idParts[2]);
  let max = idParts[2]+1000;
  let newId = '';
  while (existence) {
    idParts[2] = idParts[2]+1;
    newId = idParts[0]+'-'+idParts[1]+'-'+idParts[2];
    if (document.getElementById(newId)) {
      // this one exists ... increment again
    } else if (idParts[2] > max) {
      // cannot add any more parts
      return(false);
    } else {
      // found the next id
      existence = false;
    }
  }
  // The next id is known.  Let us add the form content to this container
  const [ optionsArray, optionsText ] = optionValues();
  let newIdSelect = idParts[0]+'type-'+idParts[1]+'-'+idParts[2];
  // add the new input text box
//  let contentInput = "<input type='text' id='"+newId+"' name='"+newId+"'>";
  let newINPUT = document.createElement("input");
  newINPUT.type = 'text';
  newINPUT.name = newId;
  newINPUT.id = newId;
//  newINPUT.innerHTML = contentInput;
  document.getElementById(containerID).appendChild(newINPUT);

  let newSELECT = document.createElement("select");
  newSELECT.id = newIdSelect;
  newSELECT.name = newIdSelect;
  // counter intuitively add the select list to the document
  document.getElementById(containerID).appendChild(newSELECT);

  // add options to the select list after the append
  for (let i = 0; i < optionsArray.length; i++) {
    const newOPTION = document.createElement("option");
    newOPTION.value = optionsArray[i];
    newOPTION.textContent = optionsText[i];
    newSELECT.appendChild(newOPTION);
  }
}

