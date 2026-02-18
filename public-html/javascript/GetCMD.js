function GetCMD() {
  // command variable
  let cmd='sudo perfdhcp';

  // Validate that dhcp4 or dhcp6 was chosen.  Return, if not.
  let elems=document.getElementById('main').elements;
  // was dhcp4 or dhcp6 chosen?
  if (elems[0].checked) {
    cmd+=' -4';
  } else if (elems[1].checked) {
    cmd+=' -6';
  } else {
    // one or the other (dhcp4 or dhcp6) needs to be checked
    ErrorMessage('ConfTypeSelection','one or the other (dhcp4 or dhcp6) needs to be checked');
    return('');
  }

  // -r <n> where <n> is a positive integer.  Rate at which to send packets
  // output the -r <n> if <n> exists
  if (document.getElementById('rate').value === '') {
    // it is empty - do nothing
  } else {
    cmd+=' -r '+document.getElementById('rate').value;
  }

  // -R <n> where <n> is a positive integer.  Number of clients to simulate
  // output the -R <n> if <n> exists
  if (document.getElementById('SimulateClientCount').value === '') {
    // it is empty - do nothing
  } else {
    cmd+=' -R '+document.getElementById('SimulateClientCount').value;
  }

  // -Y <n> where <n> is a positive integer. Client delay simulation begin seconds
  // output the -Y <n> if <n> exists
  if (document.getElementById('outageStart').value === '') {
    // it is empty - do nothing
  } else if (document.getElementById('outageStart').value && document.getElementById('outageDuration').value === '') {
    // -y is required with -Y and we cannot have a meaningful default
    ErrorMessage('OutageStartDiv','-y is required with -Y and it is not possible to have a meaningful default');
    ErrorMessage('outageDurationDiv','');
    return('');
  } else {
    cmd+=' -Y '+document.getElementById('outageStart').value;
  }

  // -y <n> where <n> is a positive integer. Client delay simulation duration seconds
  // output the -y <n> if <n> exists
  if (document.getElementById('outageDuration').value === '') {
    // it is empty - do nothing
  } else {
    cmd+=' -y '+document.getElementById('outageDuration').value;
    if (document.getElementById('outageStart').value === '') {
      // we can infer 0 here.
      cmd+=' -Y 0';
    }
  }

  // -p <n> where <n> is a positive integer.  Number of seconds for the test to run
  // output the -p <n> if <n> exists
  if (document.getElementById('period').value === '') {
    // it is empty - do nothing
  } else {
    cmd+=' -p '+document.getElementById('period').value;
  }

  // -A 1 needs to come before `--or ` content
  if (document.getElementById('dhcp6relayHop').checked == true && document.getElementById('ConfType1').checked == true) {
    ErrorMessage('dhcp6relayHopDiv','DHCP6 Relay hops (-A 1) is not valid with DHCPv4');
    ErrorMessage('ConfTypeSelection','');
    return('');
  }
  if (document.getElementById('dhcp6relayHop').checked || is4or6(document.getElementById('WhereHowToSend').value) == 'IPv6') {
    document.getElementById('dhcp6relayHop').checked = true;
    cmd+=' -A 1';
  }

  // output `-o` content identified by "noEncapO" identifier prefix
  // output `-o 82` content identified by "EncapO" identifier prefix
  // output `--or` content identifid by "dhcp6relay" identifier prefix
  // iterate the elements of form id "main"
  // init some variables that need during runs
  const baseIDs = [ 'noEncapO','EncapO','dhcp6relay'  ];
  for (let n = 0; n < baseIDs.length; n++) {
    //const regex = /^noEncapOid\-[0-9]+$/g;
    const regex = new RegExp("^"+baseIDs[n]+"id\-[0-9]+$",'g');
    let id1 = 0;
    let code = 0;
    let id2 = 0;
    const tuples = [ ];
    for (let i = 0; i < elems.length; i++) {
      // look for elements with the id like /^noEncapO\-[0-9]+$/ <- note that this is only used as an id in the div we don't need it - no form content
      // the [0-9]+ shall be set to id1 <- do not need, as noted above
      // Find the option code which will be noEncapOid-{id1} and set new variable "code" to this value
      if (elems[i].name.search(regex) != -1) {
        // found one
        const parts = elems[i].name.split('-');
        id1 = parseInt(parts[1]);
        code = parseInt(elems[i].value);
        // ned hex container
        let hex = '';
        const regex2 = new RegExp("^"+baseIDs[n]+"-"+id1+"\-[0-9]+$",'g');
        for (let x = 0; x < elems.length; x++) {
          if (elems[x].name.search(regex2) != -1) {
            // Find the option parts which will be /^noEncapO-{id1}\-[0-9]+$/
            // Set the part id to id2
            const parts = elems[x].name.split('-');
            id2 = parseInt(parts[2]);
            // For each option part found, for this particular option, find the type of the part: noEncapOtype-{id1}-{id2}
            let typeID = baseIDs[n]+'type-'+id1+'-'+id2;
            if (elems[x].value && document.getElementById(typeID).value) {
              // for each option part and type found, encode it adding the result to the hex container
              let hexBytes = getHexBytes(elems[x].value,document.getElementById(typeID).value);
              if (hexBytes) {
                hex += hexBytes;
              } else {
                ErrorMessage(baseIDs[n]+'-'+id1,'');
                return('');
              }
            }
          // when complete, add `-o {code},{hex}` to the {cmd} variable.
          }
        }
        if (Number.isNaN(code)) {
          console.log(baseIDs[n]+'-'+id1);
          ErrorMessage(baseIDs[n]+'-'+id1,'code requires a positive integer between 0 and 255');
          return('');
        }
        //cmd += ' -o '+code+','+hex;
        if (code && hex) {
          tuples.push(code+','+hex);
        } else {
          ErrorMessage(baseIDs[n]+'-'+id1,'Unknown error while processing code or data');
          return('');
        }
      }
    }
    let hex82 = '';
    for (let i = 0; i < tuples.length; i++) {
      const [ code, hex ] = tuples[i].split(',');;
      if (baseIDs[n] == 'noEncapO') {
        cmd += ' -o '+code+','+hex;
      } else if (baseIDs[n] == 'EncapO') {
        // this one requires special handling because it is a grouping of sub-options
        // convert code to hex
        let chex = decToHex(code,'uint8');
        // get length
        let L = decToHex(hex.length / 2,'uint8');
        // add all to hex82 created earlier
        hex82 += chex+L+hex;
      } else if (baseIDs[n] == 'dhcp6relay') {
        // some small validation and inferences required here to make sure the resultant command will work
        if (document.getElementById('dhcp6relayHop').checked) {
          // -A 1 was checked ... good
        } else {
          // it was not checked but it *is* required so let us infer
          cmd += ' -A 1';
          document.getElementById('dhcp6relayHop').checked = true;
        }
        cmd += ' --or 1:'+code+','+hex;
      } else {
        ErrorMessage(false,'Unknown option specified: '+baseIDs[n]);
        return('');
      }
    }
    if (baseIDs[n] == 'EncapO' && hex82) {
      // option 82 was added, make sure it is DHCPv4
      if (document.getElementById('ConfType2').checked == true) {
        ErrorMessage('ConfTypeSelection','Option 82 is DHCPv4 only');
        ErrorMessage('EncapO-1','');
        return('');
      }
      // this requires usage outside of the for loop after all of the concatonation during the for loop
      // I could have done this by appending during the for loop but decided this was more readable
      cmd += ' -o 82,'+hex82;
      hex82 = '';
    }
  }
  // The above algorithm will probably apply to the other types as well evaluate after
  // I may be able to *partially* do this in a function but there are behaviors that are different
  // between all three of these
  // I was able to reuse most of it with only some special conditions specified

  // if WhereHowToSend contains an IP address, then pop that on the end, else add `-l <interface>` assuming it was an interface
  // return if it was empty
  if (document.getElementById('WhereHowToSend').value === '') {
    ErrorMessage('WhereHowToSendDiv','Send from/to is a required field');
    return('');
  } else if (is4or6(document.getElementById('WhereHowToSend').value) == 'IPv4' && document.getElementById('ConfType2').checked == true) {
    ErrorMessage('WhereHowToSendDiv','An IPv4 address was entered in Send from/to and DHCPv6 was chosen as the packet type');
    ErrorMessage('ConfTypeSelection','');
    return('');
  } else if (is4or6(document.getElementById('WhereHowToSend').value) == 'IPv6' && document.getElementById('ConfType1').checked == true) {
    ErrorMessage('WhereHowToSendDiv','An IPv6 address was entered in Send from/to and DHCPv4 was chosen as the packet type');
    ErrorMessage('ConfTypeSelection','');
    return('');
  } else if (is4or6(document.getElementById('WhereHowToSend').value)) {
    cmd+=' '+document.getElementById('WhereHowToSend').value;
  } else {
    cmd+=' -l '+document.getElementById('WhereHowToSend').value;
  }

  // output the command
  document.getElementById('CommandOutputTA').innerHTML = cmd;
}
